import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/homepage'
    },
    {
      path: '/steper',
      name: 'steper',
      component: ()=>import ('@/pages/steper')
    },
    {
      path: '/tools',
      name: 'tools',
      component: ()=>import ('@/pages/container'),
    },
    {
      path: '/homepage',
      name: 'homepage',
      component: ()=>import ('@/pages/homepage'),
    },
    {
      path: '/webcast',
      name: 'webcast',
      component: ()=>import ('@/pages/webcast'),
    },
    {
      path: '/myscript',
      name: 'myscript',
      component: ()=>import ('@/pages/myscript'),
    }
  ]
})
