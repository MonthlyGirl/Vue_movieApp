import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
/***********************************************************************
使用的步骤：
    1. 创建一个仓库
    2. 提供 state
    3. 提供 修改数据的 mutations
**********************************************************************/
export default new Vuex.Store({
  state: {
    address: null
  },
// 这个对象里面定义对 state 的操作（curd）,同步操作
  mutations: {
    save_address: function (state, payload) {
      state.address = payload;
    },
  },
  actions: {
  },
  modules: {
  }
})
