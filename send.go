package main

import (
	"fmt"
	"net/http"
)

func SendError(w http.ResponseWriter, status int, err error) {
	fmt.Printf("HTTP Error %d: '%s'\n", status, err.Error())
	w.WriteHeader(status)
	w.Write([]byte(err.Error()))
}
