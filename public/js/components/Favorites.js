import { get_favorites, remove_server } from "../service/favorites.js";
import SelectServer from "./SelectServer.js";

export default {
    components: {
        "select-server": SelectServer
    },
    computed: {
        list: get_favorites
    },
    methods: {
        remove_server: remove_server
    },
    template: /*html*/`
    <div v-if="list.length">
        <h4>Favorites</h4>
        <table class="table table-dark table-sm table-striped">
            <thead>
                <tr>
                    <th>Action</th>
                    <th>Address</th>
                    <th>Port</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="server in list">
                    <td>
                        <i class="fa fa-trash" v-on:click="remove_server(server)"></i>
                        &nbsp;
                        <select-server :server="server"/>
                    </td>
                    <td>
                        {{server.address}}
                    </td>
                    <td>
                        {{server.name}}
                    </td>
                    <td>
                        {{server.port}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `
};