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
    <table class="table table-condensed table-striped">
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
                <td>{{server.address}}</td>
                <td>{{server.clients}}/{{server.clients_max}}</td>
                <td>{{server.version}}</td>
                <td>{{server.gameid}}</td>
                <td>{{server.name}}</td>
                <td>{{server.description}}</td>
                <td>{{server.uptime}}</td>
                <td>{{server.ping}}</td>
                <td>{{server.lag}}</td>
            </tr>
        </tbody>
    </table>
    `
};