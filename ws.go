package main

import (
	"fmt"
	"net"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync/atomic"

	"github.com/gorilla/websocket"
)

var MinetestMagic = []byte{0x4f, 0x45, 0x74, 0x03}

var upgrader = websocket.Upgrader{}

func HandleProxy(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		SendError(w, 500, err)
		return
	}

	go func() {
		err = handleConnection(conn)
		if err != nil {
			fmt.Printf("WS Error: %s\n", err)
		}
	}()
}

func handleConnection(conn *websocket.Conn) error {
	_, data, err := conn.ReadMessage()
	if err != nil {
		return err
	}
	defer conn.Close()

	parts := strings.Split(string(data), " ")
	if len(parts) != 5 {
		return fmt.Errorf("invalid command: '%s'", data)
	}
	if parts[0] != "PROXY" {
		return fmt.Errorf("command not implemented: '%s'", parts[0])
	}
	if parts[1] != "IPV4" {
		return fmt.Errorf("ip version not implemented: '%s'", parts[1])
	}
	protocol := parts[2]
	host := parts[3]
	port, _ := strconv.ParseInt(parts[4], 10, 32)

	if port < 1 || port >= 65536 {
		return fmt.Errorf("invalid port: %d", port)
	}

	fmt.Printf("Connecting to '%s:%d'\n", host, port)

	// only allow dns requests and minetest-protocol forwarding
	if host == "10.0.0.1" && port == 53 && protocol == "TCP" {
		err = resolveDNS(conn)
	} else if protocol == "UDP" {
		allowed_host := os.Getenv("ALLOWED_HOST")
		if allowed_host != "" && host != allowed_host {
			// try to resolve first
			ips, err := net.LookupIP(allowed_host)
			if err != nil {
				return err
			}
			if len(ips) == 0 {
				return fmt.Errorf("could not resolve allowed host: '%s'", allowed_host)
			}
			found := false
			for _, ip := range ips {
				if ip.String() == host {
					found = true
					break
				}
			}

			if !found {
				return fmt.Errorf("host not allowed: '%s'", host)
			}
		}

		allowed_port := os.Getenv("ALLOWED_PORT")
		if allowed_port != "" && parts[4] != allowed_port {
			return fmt.Errorf("port not allowed: '%s'", parts[4])
		}

		err = forwardData(conn, host, port)
	} else {
		return fmt.Errorf("unsupported command: '%s'", data)
	}
	return err
}

func resolveDNS(conn *websocket.Conn) error {
	conn.WriteMessage(websocket.TextMessage, []byte("PROXY OK"))

	_, data, err := conn.ReadMessage()
	if err != nil {
		return err
	}

	fmt.Printf("Resolving host: '%s'\n", string(data))

	ips, err := net.LookupIP(string(data))
	if err != nil {
		return err
	}

	if len(ips) == 0 {
		return fmt.Errorf("host not found")
	}

	err = conn.WriteMessage(websocket.BinaryMessage, []byte(ips[0]))
	if err != nil {
		return err
	}

	return conn.Close()
}

func forwardData(conn *websocket.Conn, host string, port int64) error {
	fmt.Printf("Forwarding data to %s:%d\n", host, port)

	uaddr, err := net.ResolveUDPAddr("udp", fmt.Sprintf("%s:%d", host, port))
	if err != nil {
		return err
	}

	udpconn, err := net.DialUDP("udp", nil, uaddr)
	if err != nil {
		return err
	}
	errchan := make(chan error, 1)
	run := atomic.Bool{}
	run.Store(true)

	conn.WriteMessage(websocket.TextMessage, []byte("PROXY OK"))

	go func() {
		buf := make([]byte, 3000)
		for run.Load() {
			len, err := udpconn.Read(buf)
			if err != nil {
				errchan <- err
				return
			}
			err = conn.WriteMessage(websocket.BinaryMessage, buf[:len])
			if err != nil {
				errchan <- err
				return
			}
		}
	}()

	go func() {
		for run.Load() {
			_, data, err := conn.ReadMessage()
			if err != nil {
				errchan <- err
				return
			}
			if len(data) < 9 {
				errchan <- fmt.Errorf("invalid packet size: %d", len(data))
				return
			}

			// ensure that we are using the minetest protocol
			for i, b := range MinetestMagic {
				if data[i] != b {
					errchan <- fmt.Errorf("invalid magic at offset %d: %d", i, data[i])
					return
				}
			}

			_, err = udpconn.Write(data)
			if err != nil {
				errchan <- err
				return
			}
		}
	}()

	err = <-errchan
	run.Store(false)
	conn.Close()
	return err
}
