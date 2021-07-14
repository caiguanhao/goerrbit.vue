import { createRouter, createWebHistory } from 'vue-router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import RouteApps from './apps/index.vue'
import RouteAppsShow from './apps/show.vue'
import RouteAppsNew from './apps/new.vue'
import RouteAppsEdit from './apps/edit.vue'
import RouteAppsNotifications from './apps/notifications.vue'
import RouteProblems from './problems/index.vue'
import RouteProblemsShow from './problems/show.vue'
import RouteUsers from './users/index.vue'
import RouteUsersNew from './users/new.vue'
import RouteUsersEdit from './users/edit.vue'
import RouteSignIn from './sessions/sign-in.vue'
import RouteError from './errors/index.vue'
import RouteBlank from './errors/blank.vue'

NProgress.configure({ showSpinner: false })

const router = createRouter({
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash }
    } else if (savedPosition) {
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
    { path: '/apps/:id/notifications', name: 'RouteAppsNotifications', component: RouteAppsNotifications },
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
    { path: '/users', name: 'RouteUsers', component: RouteUsers },
    { path: '/users/new', name: 'RouteUsersNew', component: RouteUsersNew },
    { path: '/users/:id/edit', name: 'RouteUsersEdit', component: RouteUsersEdit },
    { path: '/sign-in', name: 'RouteSignIn', component: RouteSignIn, meta: { needCurrentUser: false } },
    { path: '/error', name: 'RouteError', component: RouteError },
    { path: '/\n', name: 'RouteBlank', component: RouteBlank },
    { path: '/:pathMatch(.*)*', name: 'RouteNotFound', component: RouteError }
  ],
})

router.$lastRoute = null
router.$lastError = null
router.$vm = null

router.setVM = (vm) => {
  router.$vm = vm
}

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.name === 'RouteError' || to.name === 'RouteBlank') return next()
  router.$lastRoute = to
  if (router.$vm) {
    router.$vm.getCurrentUser().then(() => {
      if (to.meta.needCurrentUser === false && router.$vm.currentUser.Id) {
        next({ name: 'RouteHome' })
      } else {
        next()
      }
    }, next)
    return
  }
  next()
})

router.afterEach((to) => {
  NProgress.done()
  setTimeout(() => {
    let title = router.$vm ? router.$vm.$t('titles.Default', null) : null
    outer:
    for (let i = 0; i < to.matched.length; i++) {
      if (!to.name) break
      let route = to.matched[i]
      for (let key in route.instances) {
        let vm = route.instances[key]
        if (!vm) break
        let t = vm.$t(`titles.${to.name}`, null)
        if (t !== null) {
          if (typeof(t) === 'function') t = t(vm)
          title = t
          break outer
        }
      }
    }
    if (typeof(title) === 'function') title = title(router.$vm)
    document.title = title
  })
})

router.onError((err) => {
  let status = 0
  if (err && err.response && err.response.status) {
    status = err.response.status
  }
  if (status === 401) {
    let redirect = router.$lastRoute ? router.$lastRoute.fullPath : undefined
    if (redirect === '/') redirect = undefined
    router.push({ name: 'RouteSignIn', query: { redirect } })
  } else {
    router.$lastError = err
    router.push({ name: 'RouteError' })
  }
})

export default router
