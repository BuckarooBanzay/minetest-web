package main

import (
	"fmt"
	"minetest-web/public"
	"net/http"
	"os"
)

func main() {

	var fs http.Handler
	if os.Getenv("WEBDEV") == "true" {
		// live mode
		fs = http.FileServer(http.FS(os.DirFS("public")))
	} else {
		// embedded mode
		fs = http.FileServer(http.FS(public.Webapp))
	}
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cross-Origin-Embedder-Policy", "require-corp")
		w.Header().Set("Cross-Origin-Opener-Policy", "same-origin")
		fs.ServeHTTP(w, r)
	})

	http.HandleFunc("/proxy", HandleProxy)

	fmt.Println("Listening on port 8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
