FROM alpine:3.18.3
COPY minetest-web /bin/minetest-web
EXPOSE 8080
ENTRYPOINT ["/bin/minetest-web"]
