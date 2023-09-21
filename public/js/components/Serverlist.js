import { add_server, is_favorite, remove_server } from "../service/favorites.js";
import SelectServer from "./SelectServer.js";

export default {
    components: {
        "select-server": SelectServer
    },
    props: ["list"],
    methods: {
        add_server: add_server,
        remove_server: remove_server,
        is_favorite: is_favorite
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
            <tr v-for="server in list" v-bind:class="{'table-success': is_favorite(server)}">
                <td>
                    <i class="fa fa-star" style="color: yellow;" v-on:click="remove_server(server)" v-if="is_favorite(server)"></i>
                    <i class="fa-regular fa-star" v-on:click="add_server(server)" v-else></i>
                    &nbsp;
                    <select-server :server="server"/>
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