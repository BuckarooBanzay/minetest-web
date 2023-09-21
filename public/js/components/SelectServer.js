import { store } from "../service/login.js";

export default {
    props: ["server"],
    methods: {
        select_server: function(server) {
            store.address = server.address;
            store.port = ""+server.port;
            this.$router.push("/");
        }
    },
    template: /*html*/`
    <i class="fa-solid fa-play" style="color: green;" v-on:click="select_server(server)"></i>
    `
};