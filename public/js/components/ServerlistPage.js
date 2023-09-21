/* globals Vue */
import Serverlist from "./Serverlist.js";
import Favorites from "./Favorites.js";

const store = Vue.reactive({
    list: [],
    busy: false,
    search: ""
});

export default {
    components: {
        "server-list": Serverlist,
        "favorites-list": Favorites
    },
    data: () => store,
    created: function() {
        const min = 37, max = 42;
        if (this.list.length == 0) {
            this.busy = true;
            fetch("http://servers.minetest.net/list")
            .then(r => r.json())
            .then(l => l.list)
            .then(l => l.filter(e => e.proto_max > min && e.proto_min < max))
            .then(l => this.list = l)
            .finally(() => this.busy = false);
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
    <div class="row" v-if="busy">
        <div class="col-4"></div>
        <div class="col-4">
            <div class="alert alert-info">
                <i class="fa fa-spinner fa-spin"></i>
                Loading serverlist
            </div>
        </div>
        <div class="col-4"></div>
    </div>
    <favorites-list/>
    <h4>Serverlist</h4>
    <div class="row" v-if="!busy">
        <div class="col-12">
            <input type="text" class="form-control" placeholder="Search" v-model="search"/>
        </div>
    </div>
    <server-list :list="filtered_list" v-if="!busy"/>
    `
};