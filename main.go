package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{}

func main() {

	fs := http.FileServer(http.FS(os.DirFS(".")))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cross-Origin-Embedder-Policy", "require-corp")
		w.Header().Set("Cross-Origin-Opener-Policy", "same-origin")
		fs.ServeHTTP(w, r)
	})

	http.HandleFunc("/proxy", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			panic(err)
		}

		// https://github.com/paradust7/webshims/blob/main/src/emsocket/proxy.js
		t, data, err := conn.ReadMessage()
		if err != nil {
			fmt.Printf("Err: %v\n", err)
			conn.Close()
			return
		}

		fmt.Printf("RX: type=%d, data=%s\n", t, data)
		conn.WriteMessage(websocket.BinaryMessage, []byte("PROXY OK"))

		t, data, err = conn.ReadMessage()
		if err != nil {
			fmt.Printf("Err: %v\n", err)
			conn.Close()
			return
		}

		fmt.Printf("RX: type=%d, data=%s\n", t, data)

		conn.Close()
	})

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
