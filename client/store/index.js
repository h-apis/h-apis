import Vue from 'vue'
import Vuex, { createLogger } from 'vuex';
import sweet from './modules/sweet';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        sweet,
    },
    strict: debug,
    plugins: debug ? [createLogger()] : [],
});
