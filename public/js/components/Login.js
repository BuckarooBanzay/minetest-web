import { execute } from "../wasm_helper.js";

export default {
    inject: ["unmount", "info"],
    data: function() {
        return {
            address: this.info.AllowedHost,
            port: this.info.AllowedPort,
            name: "",
            password: ""
        };
    },
    computed: {
        can_launch: function() {
            if (!this.info.FixedRemote) {
                if (this.address == "" || +this.port == 0) {
                    return false;
                }
            }
            return this.name != "" && this.password != "";
        }
    },
    methods: {
        launch: function() {
            this.unmount();
            execute([
                "--go",
                "--address", this.address,
                "--port", this.port,
                "--name", this.name,
                "--password", this.password
            ]);
        }
    },
    template: /*html*/`
    <div class="row">
        <div class="col-4"></div>
        <div class="col-4 card" style="padding: 20px;">
            <h4>Minetest web client</h4>
            <form @submit.prevent="launch">
                <input type="text" class="form-control" v-model="address" placeholder="Address" v-if="!info.AllowedHost"/>
                <input type="text" class="form-control" v-model="port" placeholder="Port" v-if="!info.AllowedPort"/>
                <input type="text" class="form-control" v-model="name" placeholder="Name"/>
                <input type="password" class="form-control" v-model="password" placeholder="Password"/>
                <button type="submit" class="btn btn-primary w-100" :disabled="!can_launch">
                    <i class="fa-solid fa-right-to-bracket"></i>
                    Login
                </button>
                <div>
                    <i class="fa-solid fa-circle-info"></i>
                    This
                    <a href="https://github.com/BuckarooBanzay/minetest-web" target="_new">
                        <i class="fa-brands fa-git-alt"></i>
                        project
                    </a>
                    is heavily based on
                    <a href="https://github.com/paradust7/minetest-wasm" target="_new">paradust's</a>
                    work on the wasm port of minetest
                </div>
            </form>
            <div class="alert alert-warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <b>NOTE:</b> This is still an experiment, some (or all) features might not work properly!
            </div>
        </div>
        <div class="col-4"></div>
    </div>
    `
};