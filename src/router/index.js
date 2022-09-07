import { createRouter, createWebHashHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import InstrumentalInteraTableView from '../views/InstrumentalInteraTableView.vue'
import HCPartnershipsTableView from '../views/HCPartnershipsTableView.vue'
import Playground from'../components/canvas/PlayGround.vue'
import IntroductionView from'../views/IntroductionView.vue'
const routes = [
  /*
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  */
  {
    path: '/',
    name: 'introduction',
    component: IntroductionView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/instrumentalinteractiontable',
    name: 'Instrumental Interaction Overview',
    component: InstrumentalInteraTableView
  },
  {
    path: '/hc-partnerships-table',
    name: 'Humane-Computer Partnerships Overview',
    component: HCPartnershipsTableView
  },
  {
    path: '/playground',
    name: 'Playground',
    component: Playground
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
