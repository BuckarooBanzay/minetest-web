/* globals Vue */

import { init } from "./wasm_helper.js";
import App from "./components/App.js";

init()
.then(() => fetch("info").then(r => r.json()))
.then(info => {
    const app = Vue.createApp(App);
    app.provide("unmount", () => app.unmount());
    app.provide("info", info);
	app.mount("#app");
})
.catch(e => console.error(e));
