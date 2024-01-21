import { is_visible } from "../service/app.js";

export default {
    computed: {
        is_visible
    },
    template: /*html*/`
    <div class="container-fluid" v-if="is_visible">
        <br>
        <router-view></router-view>
    </div>
    `
};