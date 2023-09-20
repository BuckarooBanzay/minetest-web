FROM node:20.7.0 as node-builder
WORKDIR /public
COPY public/ /public
RUN npm ci && npm run jshint && npm run bundle

FROM golang:1.21.1 as golang-builder
WORKDIR /app
COPY . /app/
COPY --from=node-builder /public /app/public
RUN go test ./...
RUN CGO_ENABLED=0 go build -ldflags="-s -w -extldflags=-static" .

FROM alpine:3.18.3
COPY --from=golang-builder /app/minetest-web /bin/minetest-web
EXPOSE 8080
ENTRYPOINT ["/bin/minetest-web"]
