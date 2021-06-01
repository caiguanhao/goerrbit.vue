import { createRouter, createWebHistory } from 'vue-router'

import RouteApps from './apps/index.vue'
import RouteError from './errors/index.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'RouteApps', component: RouteApps },
    { path: '/error', name: 'RouteError', component: RouteError },
    { path: '/:pathMatch(.*)*', component: RouteError }
  ],
})

router.$lastRoute = null
router.$lastError = null

router.beforeEach((to, from, next) => {
  if (to.name === 'RouteError') return next()
  router.$lastRoute = to
  next()
})

router.onError((err) => {
  router.$lastError = err
  router.push({ name: 'RouteError' })
})

export default router
