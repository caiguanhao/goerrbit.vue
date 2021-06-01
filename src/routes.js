import { createRouter, createWebHistory } from 'vue-router'

import RouteApps from './apps/index.vue'
import RouteAppsShow from './apps/show.vue'
import RouteProblemsShow from './problems/show.vue'
import RouteError from './errors/index.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'RouteHome', component: RouteApps, alias: [ '/apps' ] },
    { path: '/apps/:id', name: 'RouteAppsShow', component: RouteAppsShow },
    {
      path: '/apps/:id/problems/:pid/notices/:nid',
      name: 'RouteNoticesShow',
      component: RouteProblemsShow
    },
    {
      path: '/apps/:id/problems/:pid',
      name: 'RouteProblemsShow',
      component: RouteProblemsShow
    },
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
