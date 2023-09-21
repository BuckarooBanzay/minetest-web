import { store } from "../service/login.js";

export default {
    props: ["list", "enable_star"],
    methods: {
        select_server: function(server) {
            store.address = server.address;
            store.port = ""+server.port;
            this.$router.push("/");
        }
    },
    template: /*html*/`
    <table class="table table-dark table-sm table-striped">
        <thead>
            <tr>
                <th>Action</th>
                <th>Address</th>
                <th>Players</th>
                <th>Version</th>
                <th>Game</th>
                <th>Name</th>
                <th>Description</th>
                <th>Uptime</th>
                <th>Ping</th>
                <th>Lag</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="server in list">
                <td>
                    <i class="fa-regular fa-star" v-if="enable_star"></i>
                    &nbsp;
                    <i class="fa-solid fa-play" style="color: green;" v-on:click="select_server(server)"></i>
                </td>
                <td style="max-width: 15ch;">
                    {{server.address}}
                </td>
                <td>
                    {{server.clients}}/{{server.clients_max}}
                </td>
                <td style="max-width: 8ch;">
                    {{server.version}}
                </td>
                <td style="max-width: 8ch;">
                    {{server.gameid}}
                </td>
                <td style="max-width: 20ch;">
                    {{server.name}}
                </td>
                <td style="max-width: 64ch; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;" class="col-2">
                    <span>{{server.description}}</span>
                </td>
                <td>{{Math.floor(server.uptime / 3600)}} h</td>
                <td>{{Math.floor(server.ping * 1000)}} ms</td>
                <td>{{Math.floor(server.lag * 1000)}} ms</td>
            </tr>
        </tbody>
    </table>
    `
};