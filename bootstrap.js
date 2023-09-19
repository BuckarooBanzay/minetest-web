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

let emloop_pause, emloop_unpause, emloop_init_sound, emloop_invoke_main;

function animate() {
    emloop_pause();
    window.requestAnimationFrame(() => { emloop_unpause(); });
}

function emloop_ready() {
    emloop_pause = cwrap("emloop_pause", null, []);
    emloop_unpause = cwrap("emloop_unpause", null, []);
    emloop_init_sound = cwrap("emloop_init_sound", null, []);
    emloop_invoke_main = cwrap("emloop_invoke_main", null, ["number", "number"]);

    const [argc, argv] = makeArgv(["./minetest"]);
    emloop_invoke_main(argc, argv);

    animate();
}

var Module = {
    canvas: document.getElementById("canvas")
};