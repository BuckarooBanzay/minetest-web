import Favorites from "./Favorites.js";
import Login from "./Login.js";

export default {
    inject: ["info"],
    components: {
        "login-form": Login,
        "favorites-list": Favorites
    },
    template: /*html*/`
    <login-form/>
    <favorites-list v-if="!info.AllowedHost"/>
    `
};