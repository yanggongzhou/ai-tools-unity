// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/main.css'
Vue.use(ElementUI,{size:'small'})
import TagTextarea from './packages/index'
Vue.use(TagTextarea)
import { Session } from "./api/auth";
Vue.prototype.$Session = Session;
import vcolorpicker from 'vcolorpicker'//颜色选择器
Vue.use(vcolorpicker)
import animated from "animate.css"
Vue.use(animated)
import promptMessage from '@/components/tooltips/index.js'
Vue.use(promptMessage)
import drr from '@minogin/vue-drag-resize-rotate'
Vue.component('drr', drr)

import store from './store';
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
