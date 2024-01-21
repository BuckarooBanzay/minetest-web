
const store = Vue.reactive({
    visible: true
});

export const hide = () => store.visible = false;
export const show = () => store.visible = true;

export const is_visible = () => store.visible;