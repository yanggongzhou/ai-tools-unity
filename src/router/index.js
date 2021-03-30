import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/start'
    },
    {
      path: '/start',
      name: 'start',
      component: ()=>import ('@/pages/start'),
    },
    {
      path: '/tools',
      name: 'tools',
      component: ()=>import ('@/pages/container'),
    },
    {
      path: '/step',
      name: 'step',
      component: ()=>import ('@/pages/step'),
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
    },
    {
      path: '/direct',
      name: 'direct',
      component: ()=>import ('@/pages/direct'),
    },
    {
      path: '/alitts',
      name: 'alitts',
      component: ()=>import ('@/pages/alitts'),
    }
  ]
})
