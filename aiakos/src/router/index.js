import Vue from 'vue'
import Router from 'vue-router'
import Aiakos from '@/components/Aiakos'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Aiakos',
      component: Aiakos
    }
  ]
})
