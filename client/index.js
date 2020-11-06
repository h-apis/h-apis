import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Vue from 'vue';
import store from './store';
import VuetifyApp from './components/App';
import vuetify from './plugins/vuetify';

new Vue({
    vuetify,
    store,
    render: h => h(VuetifyApp),
}).$mount('#app');
