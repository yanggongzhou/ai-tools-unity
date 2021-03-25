import Vue from 'vue';
import Vuex from 'vuex';
import result from './modules/result'
import sToken from './modules/sToken'
Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    result,
    sToken
  }
})

