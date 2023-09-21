/* globals Vue */

const store = Vue.reactive({
    list: []
});

export default {
    data: () => store,
    created: function() {
        const min = 37, max = 42;
        if (this.list.length == 0) {
            fetch("http://servers.minetest.net/list")
            .then(r => r.json())
            .then(l => l.list)
            .then(l => l.filter(e => e.proto_max > min && e.proto_min < max))
            .then(l => this.list = l);
        }
    },
    template: /*html*/`
    <table class="table table-dark table-sm table-striped">
        <thead>
            <tr>
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
                <td style="max-width: 15ch;">{{server.address}}</td>
                <td>{{server.clients}}/{{server.clients_max}}</td>
                <td style="max-width: 16ch;">{{server.version}}</td>
                <td>{{server.gameid}}</td>
                <td style="max-width: 20ch;">{{server.name}}</td>
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