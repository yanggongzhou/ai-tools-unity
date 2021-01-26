import Vue from 'vue';
import Vuex from 'vuex';
import result from './modules/result'
Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    result,
  }
})

