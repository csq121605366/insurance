import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/HelloFromVux'
import hello from '../components/HelloWorld'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home
    }, {
      path: '/hello',
      name: 'hello',
      component: hello
    }
  ]
})
