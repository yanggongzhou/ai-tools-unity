import Vue from 'vue';
import Vuex from 'vuex';
import result from './modules/result'
import sToken from './modules/sToken'
import other from "./modules/other";
Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    result,
    sToken,
    other
  }
})

