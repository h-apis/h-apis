import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Vue from 'vue';
import infiniteScroll from 'vue-infinite-scroll';
import store from './store';
import VuetifyApp from './App';
import vuetify from './plugins/vuetify';


new Vue({
    vuetify,
    store,
    render: h => h(VuetifyApp),
    directives: {
        infiniteScroll,
    },
}).$mount('#app');
