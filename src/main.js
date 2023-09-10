import { createApp,watchEffect } from 'vue'
import App from './App.vue'
import { store } from './store.js'
import router from './router'

setYear(window.location.hash);
window.addEventListener('hashchange', () => {
    setYear(window.location.hash);
})

function setYear(str) {
    console.log(str);
    let y = Number.parseInt(str.substring(1))
    if (y>=0) y--;
    store.commit('setDisplayYear',y);
}

watchEffect(function() {
    window.location.hash = store.state.displayYear + 1;
});

createApp(App).use(store).use(router).mount('#app')
