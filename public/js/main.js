/* globals Vue */

import { init } from "./wasm_helper.js";
import App from "./components/App.js";

init().then(() => {
    const app = Vue.createApp(App);
    app.provide("unmount", () => app.unmount());
	app.mount("#app");
})
.catch(e => console.error(e));
