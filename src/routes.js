import { createRouter, createWebHistory } from 'vue-router'

import RouteApps from './apps/index.vue'
import RouteAppsShow from './apps/show.vue'
import RouteAppsNew from './apps/new.vue'
import RouteAppsEdit from './apps/edit.vue'
import RouteProblems from './problems/index.vue'
import RouteProblemsShow from './problems/show.vue'
import RouteError from './errors/index.vue'

const router = createRouter({
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'RouteHome', component: RouteApps, alias: [ '/apps' ] },
    { path: '/apps/new', name: 'RouteAppsNew', component: RouteAppsNew },
    { path: '/apps/:id', name: 'RouteAppsShow', component: RouteAppsShow },
    { path: '/apps/:id/edit', name: 'RouteAppsEdit', component: RouteAppsEdit },
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
    { path: '/errors', name: 'RouteProblems', component: RouteProblems },
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
