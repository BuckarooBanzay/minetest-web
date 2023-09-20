import { execute } from "../wasm_helper.js";

export default {
    inject: ["unmount"],
    data: function() {
        return {
            address: "nodecore.mine.nu",
            port: "30000",
            name: "Yoyodyne",
            password: "mypw"
        };
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
        <div class="col-4">
            <input type="text" class="form-control" v-model="address" placeholder="Address"/>
            <input type="number" class="form-control" v-model="port" placeholder="Port"/>
            <input type="text" class="form-control" v-model="name" placeholder="Name"/>
            <input type="password" class="form-control" v-model="password" placeholder="Password"/>
            <a class="btn btn-primary w-100" v-on:click="launch">
                Login
            </a>
        </div>
        <div class="col-4"></div>
    </div>
    `
};