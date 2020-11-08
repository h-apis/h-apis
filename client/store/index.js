import Vue from 'vue'
import Vuex, { createLogger } from 'vuex';
import browse from './modules/browse';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        browse,
    },
    strict: debug,
    plugins: debug ? [createLogger()] : [],
});
