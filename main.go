package main

import (
	"encoding/json"
	"fmt"
	"minetest-web/public"
	"net/http"
	"os"

	"github.com/prometheus/client_golang/prometheus/promhttp"
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

	// Assets
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cross-Origin-Embedder-Policy", "require-corp")
		w.Header().Set("Cross-Origin-Opener-Policy", "same-origin")
		w.Header().Set("Cache-Control", "max-age=300")
		fs.ServeHTTP(w, r)
	})

	// websocket proxy
	http.HandleFunc("/proxy", HandleProxy)

	// metrics
	http.Handle("/metrics", promhttp.Handler())

	// app info endpoint
	http.HandleFunc("/info", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]any{
			"Webdev":      os.Getenv("WEBDEV") == "true",
			"AllowedHost": os.Getenv("ALLOWED_HOST"),
			"AllowedPort": os.Getenv("ALLOWED_PORT"),
		})
	})

	fmt.Println("Listening on port 8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
