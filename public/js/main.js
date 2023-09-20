import { ready, execute } from "./wasm_helper.js";

ready
.then(() => {
    console.log("ready");
    execute([]);
});