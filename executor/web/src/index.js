import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Vue from 'vue';
import VuetifyApp from './components/App';
import vuetify from './plugins/vuetify';

new Vue({
    vuetify,
    render: h => h(VuetifyApp)
}).$mount('#app');
