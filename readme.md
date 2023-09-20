
# minetest-web

Minetest for the web

Heavily based on the work of @paradust7's [minetest-wasm](https://github.com/paradust7/minetest-wasm)

State: **WIP**

# Running

```sh
# initialize npm assets
cd public
npm ci
cd ..

# start app
WEBDEV=true go run .
```

Visit http://127.0.0.1:8080

# Environment vars

* `WEBDEV` if "true": all assets are loaded dynamically, anything else: embedded mode
* `ALLOWED_HOST` Optional: host to only allow connections to
* `ALLOWED_PORT` Optional: port to only allow connections to