/* global Vue */

const store = Vue.reactive({
    list: []
});

function load() {
    store.list = JSON.parse(localStorage.getItem("favorites") || "[]");
}

function save() {
    localStorage.setItem("favorites", JSON.stringify(store.list));
}

load();

export const get_favorites = () => store.list;

export function remove_server(server) {
    store.list = store.list.filter(entry => {
        return entry.address != server.address || entry.port != server.port;
    });
    save();
}

export function is_favorite(server) {
    return store.list.find(entry => entry.address == server.address && entry.port == server.port);
}

export function add_server(server) {
    for (let i=0; i<store.list.length; i++){
        const entry = store.list[i];
        if (entry.address == server.address && entry.port == server.port) {
            // replace entry
            store.list[i] = {
                address: server.address,
                port: server.port,
                name: server.name
            };
            save();
            return;
        }
    }

    // append entry
    store.list.push({
        address: server.address,
        port: server.port,
        name: server.name
    });
    save();
}