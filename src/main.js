import Vue from 'vue'
import VueRouter from 'vue-router'
import VueAxios from 'vue-axios';
import axios from 'axios';
Vue.use(VueAxios,axios);

//import template vuejs
import App from './App.vue';
import CreateItem from './CreateItem.vue';
import UploadImage from './UploadImage.vue';
Vue.use(VueRouter)
const routes = [
  {
        name: 'CreateItem',
        path: '/',
        component: CreateItem
    },
    {
        name: 'UploadImage',
        path: '/upload',
        component: UploadImage
    }
];
const router = new VueRouter({ mode: 'history', routes: routes});
new Vue(Vue.util.extend({ router }, App)).$mount('#app');