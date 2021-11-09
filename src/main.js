// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import i18n from '@/locale'
import viewdesign from "view-design"
import './assets/themes/layout.less'
import moment from 'moment'
import VideoPlayer from 'vue-video-player'
import 'videojs-flash'
import "@/libs/jsmpeg.min.js";
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
// import vueAwesomeSwiper from 'vue-awesome-swiper'
// require('swiper/swiper.less')
// Vue.use(vueAwesomeSwiper)
Vue.use(VideoPlayer)
// import vueSwiper from 'vue-awesome-swiper'
// import '/swiper/dist/css/swiper.css'
// Vue.use(vueSwiper)
Vue.prototype.$moment = moment;
Vue.config.productionTip = false
Vue.use(viewdesign, {
    i18n: (key, value) => i18n.t(key, value)
})
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    i18n,
    components: { App },
    template: '<App/>'
})
