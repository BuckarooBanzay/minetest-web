package main

import (
	"fmt"
	"net"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{}

func HandleProxy(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		SendError(w, 500, err)
		return
	}

	go func() {
		err = HandleConnection(conn)
		if err != nil {
			fmt.Printf("WS Error: %s\n", err)
		}
	}()
}

func HandleConnection(conn *websocket.Conn) error {
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

	if protocol != "UDP" {
		return fmt.Errorf("TCP not supported")
	}

	fmt.Printf("Connecting to '%s:%d'\n", host, port)

	uaddr, err := net.ResolveUDPAddr("udp", fmt.Sprintf("%s:%d", host, port))
	if err != nil {
		return err
	}

	udpconn, err := net.DialUDP("udp", nil, uaddr)
	if err != nil {
		return err
	}

	errchan := make(chan error, 1)

	conn.WriteMessage(websocket.TextMessage, []byte("PROXY OK"))

	go func() {
		buf := make([]byte, 3000)
		for {
			len, err := udpconn.Read(buf)
			if err != nil {
				errchan <- err
				return
			}
			fmt.Printf("UDP->WS len=%d\n", len)
			err = conn.WriteMessage(websocket.BinaryMessage, buf[:len])
			if err != nil {
				errchan <- err
				return
			}
		}
	}()

	go func() {
		for {
			_, data, err = conn.ReadMessage()
			if err != nil {
				errchan <- err
				return
			}
			//TODO: check magic
			fmt.Printf("WS->UDP len=%d\n", len(data))
			_, err = udpconn.Write(data)
			if err != nil {
				errchan <- err
				return
			}
		}
	}()

	return <-errchan
}
