import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Vue from 'vue';
import store from './store';
import router from './routes';
import VuetifyApp from './App';
import vuetify from './plugins/vuetify';

new Vue({
    vuetify,
    store,
    router,
    render: h => h(VuetifyApp),
}).$mount('#app');
