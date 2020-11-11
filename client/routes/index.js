import Vue from 'vue';
import VueRouter from 'vue-router';
import MainPage from "../pages/MainPage";
import ViewerPage from "../pages/ViewerPage";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        component: MainPage
    },
    {
        path: '/viewer/:id',
        component: ViewerPage
    }
];

export default new VueRouter({
    mode: 'history',
    hash: false,
    routes,
});
