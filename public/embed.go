package public

import (
	"embed"
)

//go:embed js/*
//go:embed wasm/*
//go:embed *html
//go:embed node_modules/vue/dist/vue.global.js
//go:embed node_modules/@fortawesome/fontawesome-free/css/all.min.css
//go:embed node_modules/@fortawesome/fontawesome-free/webfonts/*
//go:embed node_modules/bootswatch/dist/cyborg/bootstrap.min.css
var Webapp embed.FS
