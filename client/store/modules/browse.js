import axios from "axios";

/**
 * @typedef {object} PaginationQuery
 * @property {number} [page]
 * @property {string} [type]
 * @property {string} [language]
 * @property {boolean} [initialize] setPage action 에서만 사용된다.
 */

const state = () => ({
    isLoading: true,
    initialPage: 1,
    pageOffset: 0,
    language: 'all',
    /**
     * @property type {string}
     * @property tag {string}
     */
    type: undefined, // tag, series, character, type(manga, doujinshi 등) 등을 표기
    dataList: [],
});

const getters = {
    isLoading: (state) => state.isLoading,
    initialPage: (state) => state.initialPage,
    page: (state) => state.initialPage + state.pageOffset,
    language: (state) => state.language,
    type: (state) => state.type,
    subdomain: (state) => (
        `${state.type ? `${state.type}/` : ''}`
    ),
    dataList: (state) => state.dataList,
};

const actions = {
    async setPage({ commit, dispatch }, page = 1) {
        await dispatch('getDataList', { page, initialize: true });
    },
    async fetchNextPage({ commit, dispatch, getters }) {
        await dispatch('getDataList', { page: getters.page });
    },
    /**
     * @param state
     * @namespace
     * @param {object} state
     * @param {PaginationQuery?} query
     */
    async getDataList({ commit }, query) {
        try {
            const { page, initialize } = query;

            commit('setLoading', true);
            const { data } = await axios.get('/get', { params: query });
            const { list } = data;

            if (initialize) {
                commit('resetDataList');
                commit('setPage', page);
            } else {
                commit('increaseOffset');
            }

            commit('appendDataList', list);
        } catch (e) {
            alert('fetch failed');
            throw e;
        } finally {
            commit('setLoading', false);
        }
    }
};

const mutations = {
    setLoading(state, isLoading) {
        state.isLoading = isLoading;
    },
    setPage(state, page) {
        state.initialPage = page;
    },
    increaseOffset(state) {
        state.pageOffset = state.pageOffset + 1;
    },
    resetDataList(state) {
        state.dataList = [];
        state.pageOffset = 0;
    },
    appendDataList(state, newDataList) {
        state.dataList = state.dataList.concat(newDataList);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
