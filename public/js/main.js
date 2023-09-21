/* globals Vue, VueRouter */

import { init } from "./wasm_helper.js";
import routes from "./routes.js";
import App from "./components/App.js";

init()
.then(() => fetch("info").then(r => r.json()))
.then(info => {
    // create router instance
	const router = VueRouter.createRouter({
		history: VueRouter.createWebHashHistory(),
		routes: routes
	});

    const app = Vue.createApp(App);
    app.use(router);
    app.provide("unmount", () => app.unmount());
    app.provide("info", info);
	app.mount("#app");
})
.catch(e => console.error(e));
