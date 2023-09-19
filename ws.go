package main

import (
	"fmt"
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

	switch protocol {
	case "TCP":
	case "UDP":
	default:
		return fmt.Errorf("protocol not implemented: '%s'", parts[2])
	}

	fmt.Printf("Connecting to '%s:%d'\n", host, port)

	conn.WriteMessage(websocket.TextMessage, []byte("PROXY OK"))

	_, data, err = conn.ReadMessage()
	if err != nil {
		return err
	}

	fmt.Printf("RX: data=%s\n", data)
	return nil
}
