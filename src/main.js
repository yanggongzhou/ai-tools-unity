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

import Cookies from 'js-cookie';

import promptMessage from '@/components/tooltips/index.js'
Vue.use(promptMessage)
import drr from '@minogin/vue-drag-resize-rotate'
Vue.component('drr', drr)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  data: () => {
    return {
      role_id:23,//角色ID；21-虚拟直播；23-真人+虚拟主播
      ai_user_id: 726,
      // ai_user_id: '' || Session.get('ai_user_id'),
      ai_user_phone: '' || Session.get('ai_user_phone'),
      ai_user_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYWdpY3MtYWQuY29tIiwiYXVkIjoiIiwiaWF0IjoxNjAxMDE0OTc3LCJuYmYiOjE2MDEwMTQ5NzksImV4cCI6MTYwMTAyMjE3NywiZGF0YSI6eyJ1c2VyaWQiOjcyNiwidXNlcm5hbWUiOiIxODYxMjc2NjM3MCJ9fQ.sxYsoE2EMm5kWStBc7gaJ2nS3eKEO0niAblx8956ELo",
      // ai_user_token: '' || Session.get('ai_user_token'),
    }
  },
  components: { App },
  template: '<App/>'
})
