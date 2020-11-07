import axios from "axios";

const state = () => ({
    isLoading: true,
    page: 1,
    language: 'all',
    /**
     * @property type {string}
     * @property tag {string}
     */
    type: undefined, // tag, series, character, type(manga, doujinshi 등) 등을 표기
    dataList: [],
});

const getters = {
    page: (state) => state.page,
    language: (state) => state.language,
    type: (state) => state.type,
    subdomain: (state) => (
        `${state.type ? `${state.type}/` : ''}`
    ),
    dataList: (state) => state.dataList,
};

const actions = {
    async initDataList({ commit }) {
        try {
            const { data } = await axios.get('/get');
            commit('setDataList', data);
        } catch (e) {
            alert('fetch failed');
        }
    },
    async getDataList(state) {
        try {
            const { data } = await axios.get('/get');
            state.dataList = data;
        } catch (e) {
            alert('fetch failed');
        }
    }
};

const mutations = {
    setLoading(state, isLoading) {
        state.isLoading = isLoading;
    },
    setDataList(state, dataList) {
        state.dataList = dataList;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
