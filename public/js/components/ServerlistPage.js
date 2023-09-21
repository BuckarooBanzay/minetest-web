/* globals Vue */
import Serverlist from "./Serverlist.js";

const store = Vue.reactive({
    list: [],
    search: ""
});

export default {
    components: {
        "server-list": Serverlist
    },
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
    computed: {
        filtered_list: function() {
            return this.list.filter(server => {
                if (this.search == "") {
                    // no filter
                    return true;
                }
                if (server.address.indexOf(this.search) >= 0) {
                    return true;
                }
                if (server.description.indexOf(this.search) >= 0) {
                    return true;
                }
                if (server.name.indexOf(this.search) >= 0) {
                    return true;
                }
                return false;
            });
        }
    },
    template: /*html*/`
    <div class="row">
        <div class="col-12">
            <input type="text" class="form-control" placeholder="Search" v-model="search"/>
        </div>
    </div>
    <server-list :list="filtered_list" enable_star="true"/>
    `
};