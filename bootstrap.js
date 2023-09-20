function makeArgv(args) {
    // Assuming 4-byte pointers
    const argv = _malloc((args.length + 1) * 4);
    let i;
    for (i = 0; i < args.length; i++) {
        HEAPU32[(argv >>> 2) + i] = allocateUTF8(args[i]);
    }
    HEAPU32[(argv >>> 2) + i] = 0; // argv[argc] == NULL
    return [i, argv];
}


let emloop_pause, emloop_unpause, emloop_init_sound, emloop_invoke_main, emloop_install_pack;
let irrlicht_resize, irrlicht_force_pointerlock;
let emsocket_init, emsocket_set_proxy;

const canvas_el = document.getElementById("canvas");

function emloop_request_animation_frame() {
    emloop_pause();
    window.requestAnimationFrame(() => { emloop_unpause(); });
}


function addPack(name) {
    return fetch(`wasm/packs/${name}.pack`)
    .then(r => r.blob())
    .then(blob => blob.arrayBuffer())
    .then(ab => new Uint8Array(ab))
    .then(u8arr => {
        const len = u8arr.byteLength;
        const offset = _malloc(len);
        HEAPU8.set(u8arr, offset);
        emloop_install_pack(allocateUTF8(name), offset, len);
    });
}

function emloop_ready() {
    emloop_pause = cwrap("emloop_pause", null, []);
    emloop_unpause = cwrap("emloop_unpause", null, []);
    emloop_init_sound = cwrap("emloop_init_sound", null, []);
    emloop_invoke_main = cwrap("emloop_invoke_main", null, ["number", "number"]);
    emloop_install_pack = cwrap("emloop_install_pack", null, ["number", "number", "number"]);
    irrlicht_resize = cwrap("irrlicht_resize", null, ["number", "number"]);
    irrlicht_force_pointerlock = cwrap("irrlicht_force_pointerlock", null);
    emsocket_init = cwrap("emsocket_init", null, []);
    emsocket_set_proxy = cwrap("emsocket_set_proxy", null, ["number"]);

    addPack("base")
    .then(() => {
        const [argc, argv] = makeArgv(["./minetest", "--go", "--name", "Yoyodyne", "--password", "enter", "--address", "nodecore.mine.nu"]);
        //const [argc, argv] = makeArgv(["./minetest"]);
        emloop_invoke_main(argc, argv);

        emloop_init_sound();
        emsocket_init();
        emsocket_set_proxy(allocateUTF8("ws://127.0.0.1:8080/proxy"));

        const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;

        irrlicht_resize(width, height);
        irrlicht_force_pointerlock();
        emloop_request_animation_frame();    
    });
}

var Module = {
    canvas: canvas_el
};