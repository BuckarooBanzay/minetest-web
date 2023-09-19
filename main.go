package main

import (
	"net/http"
	"os"
)

func main() {

	fs := http.FileServer(http.FS(os.DirFS(".")))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cross-Origin-Embedder-Policy", "require-corp")
		w.Header().Set("Cross-Origin-Opener-Policy", "same-origin")
		fs.ServeHTTP(w, r)
	})

	http.HandleFunc("/proxy", HandleProxy)

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
