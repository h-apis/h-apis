const state = () => ({
    test: '',
});

const getters = {
    test(state) {
        return state.test;
    },
};

const actions = {};

const mutations = {
    setTest(state, newText) {
        state.test = newText;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
