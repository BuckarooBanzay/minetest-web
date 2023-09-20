/* globals Vue */

import { ready } from "./wasm_helper.js";
import App from "./components/App.js";

ready
.then(() => {
    const app = Vue.createApp(App);
    app.provide("unmount", () => app.unmount());
	app.mount("#app");
})
.catch(e => console.error(e));
