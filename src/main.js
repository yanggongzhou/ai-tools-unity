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
      role_id:21,//角色ID；21-虚拟直播；23-真人+虚拟主播
      ai_user_id: 726,
      // ai_user_id: '' || Cookies.get('ai_user_id'),
      ai_user_phone: '' || Cookies.get('ai_user_phone'),
      ai_user_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYWdpY3MtYWQuY29tIiwiYXVkIjoiIiwiaWF0IjoxNjAwODMxNTAzLCJuYmYiOjE2MDA4MzE1MDUsImV4cCI6MTYwMDgzODcwMywiZGF0YSI6eyJ1c2VyaWQiOjcyNiwidXNlcm5hbWUiOiIxODYxMjc2NjM3MCJ9fQ.Et3YErRr0WgoYI7-o-PCiQEx01QHIUg7u8_JHgDlBbU",
      // ai_user_token: '' || Cookies.get('ai_user_token'),
      // isOpenBeforePlayTipsAgain: true && !Cookies.get('isOpenBeforePlayTipsAgain'),
      isPlayingScript: false, // 是否正在直播
    }
  },
  components: { App },
  template: '<App/>'
})
