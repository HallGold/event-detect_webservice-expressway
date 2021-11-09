import Vue from 'vue'
import Vuex from 'vuex'

// import user from './module/user'
// import app from './module/app'

Vue.use(Vuex)

export default new Vuex.Store({
  //加载动画
  state: {
    isLoading: false, //加载状态
  },
  mutations: {
    //加载的状态
    updateLoadingStatus(state, isLoading) {
      state.isLoading = isLoading
    }
  },
  actions: {
    //
  },
  modules: {
    // user,
    // app
  }
})
