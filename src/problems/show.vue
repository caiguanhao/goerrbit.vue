<template>
  <div class="p-3 bg-light border rounded-3 mb-4">
    <h4 v-text="problem.ErrorClass"></h4>
    <div class="small">
      <strong>App: </strong>
      <router-link v-bind:to="{ name: 'RouteAppsShow', params: { id: app.Id } }"
        v-text="app.Name"></router-link>
      <strong class="ms-2">Where: </strong>
      <span v-text="problem.Location"></span>
    </div>
    <div class="small">
      <strong>Environment: </strong>
      <span v-text="problem.Environment"></span>
      <strong class="ms-2">First Notice: </strong>
      <span v-text="formatTime(problem.FirstNoticeAt)"></span>
      <strong class="ms-2">Last Notice: </strong>
      <span v-text="formatTime(problem.LastNoticeAt)"></span>
    </div>
  </div>

  <h3 v-text="notice.Message"></h3>
  <div class="d-flex">
    <template v-if="nav && !(nav.Older === null && nav.Newer === null)">
      <div class="me-3">
        <span v-if="nav.Older === null">← Older</span>
        <router-link v-else v-bind:to="{ name: 'RouteNoticesShow',
          params: { id: app.Id, pid: problem.Id, nid: nav.Older } }">← Older</router-link>
      </div>
      <div class="me-3">
        <span v-if="nav.Newer === null">Newer →</span>
        <router-link v-else v-bind:to="{ name: 'RouteNoticesShow',
          params: { id: app.Id, pid: problem.Id, nid: nav.Newer } }">Newer →</router-link>
      </div>
    </template>
    <div>
      viewing occurrence <span v-if="nav && nav.Number" v-text="nav.Number"></span> of <span v-text="problem.NoticesCount"></span>
    </div>
  </div>

  <h4 class="border-bottom pb-1 my-3">Summary</h4>
  <div class="table-responsive">
    <table class="table table-bordered">
      <tbody>
        <tr>
          <td class="fw-bold" width="200">MESSAGE</td>
          <td>
            <table class="small">
              <tbody>
                <tr v-for="item in problem.Messages">
                  <td class="pe-3" v-text="item.Percent"></td>
                  <td class="fw-bold" v-text="item.Value"></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td class="fw-bold">ERROR CLASS</td>
          <td v-text="notice.ErrorClass"></td>
        </tr>
        <tr>
          <td class="fw-bold">URL</td>
          <td v-text="notice.Url"></td>
        </tr>
        <tr>
          <td class="fw-bold">WHERE</td>
          <td v-text="notice.Location"></td>
        </tr>
        <tr>
          <td class="fw-bold">OCCURRED</td>
          <td v-text="formatTime(notice.CreatedAt)"></td>
        </tr>
        <tr>
          <td class="fw-bold">SIMILAR</td>
          <td v-text="problem.NoticesCount - 1"></td>
        </tr>
        <tr>
          <td class="fw-bold">BROWSER</td>
          <td>
            <table class="small">
              <tbody>
                <tr v-for="item in problem.UserAgents">
                  <td class="pe-3" v-text="item.Percent"></td>
                  <td class="fw-bold" v-text="item.Value"></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td class="fw-bold">ORIGIN</td>
          <td>
            <table class="small">
              <tbody>
                <tr v-for="item in problem.Hosts">
                  <td class="pe-3" v-text="item.Percent"></td>
                  <td class="fw-bold" v-text="item.Value"></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td class="fw-bold">APP SERVER</td>
          <td v-text="notice.AppServer"></td>
        </tr>
        <tr v-if="notice.AppVersion">
          <td class="fw-bold">APP VERSION</td>
          <td v-text="notice.AppVersion"></td>
        </tr>
        <tr v-if="notice.Framework">
          <td class="fw-bold">FRAMEWORK</td>
          <td v-text="notice.Framework"></td>
        </tr>
        <tr>
          <td class="fw-bold">REL. DIRECTORY</td>
          <td v-text="notice.ProjectRoot"></td>
        </tr>
      </tbody>
    </table>
  </div>

  <h4 class="border-bottom pb-1 my-3">Backtrace</h4>
  <div class="p-3 bg-light border rounded-3 mb-4 small">
    <div class="text-nowrap" v-for="b in notice.Backtraces">
      <span v-text="b.File"></span>
      <span v-if="b.Number" v-text="':' + b.Number"></span>
      <span v-if="b.Column" v-text="':' + b.Column"></span>
      &rarr;
      <span v-text="b.Method"></span>
    </div>
  </div>

  <template v-if="hasUserAttributes">
  <h4 class="border-bottom pb-1 my-3">User</h4>
  <div class="table-responsive">
    <table class="table table-bordered">
      <tbody>
        <tr v-for="(value, key) in notice.UserAttributes">
          <th v-text="key"></th>
          <td v-text="value"></td>
        </tr>
      </tbody>
    </table>
  </div>
  </template>

  <h4 class="border-bottom pb-1 my-3">Environment</h4>
  <div class="table-responsive">
    <table class="table table-bordered">
      <tbody>
        <tr v-for="(value, key) in notice.EnvVars">
          <th v-text="key"></th>
          <td v-text="value"></td>
        </tr>
      </tbody>
    </table>
  </div>

  <h4 class="border-bottom pb-1 my-3">Parameters</h4>
  <pre class="p-3 bg-light border rounded-3 mb-4" v-text="notice.Params"></pre>

  <h4 class="border-bottom pb-1 my-3">Session</h4>
  <pre class="p-3 bg-light border rounded-3 mb-4" v-text="notice.Session"></pre>
</template>

<script>
import * as timeago from 'timeago.js'
import http from '../http'

function makeRequests (params) {
  return Promise.all([
    http.get(`/apps/${params.id}`),
    http.get(`/apps/${params.id}/problems/${params.pid}`),
    params.nid ? http.get(`/apps/${params.id}/problems/${params.pid}/notices/${params.nid}`) : Promise.resolve()
  ])
}

export default {
  data () {
    return {
      app: {},
      problem: {},
      notice: {},
      nav: null
    }
  },
  computed: {
    hasUserAttributes () {
      for (let key in this.notice.UserAttributes) {
        return true
      }
      return false
    }
  },
  methods: {
    load () {
      this.getNav()
      window.lastProblemId = this.problem.Id
      window.lastAppId = this.app.Id
    },
    getNav () {
      http.get(`/apps/${this.app.Id}/problems/${this.problem.Id}/notices/${this.notice.Id}/nav`).then(res => {
        this.nav = res.data.Nav
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    makeRequests(to.params).then(res => {
      const app = res[0].data.App
      const problem = res[1].data.Problem
      if (res[2]) {
        next(vm => {
          vm.app = app
          vm.problem = problem
          vm.notice = res[2].data.Notice
          vm.load()
        })
        return
      }
      return http.get(`/apps/${to.params.id}/problems/${to.params.pid}/notices/${problem.LastNoticeId}`).then(res => {
        next(vm => {
          vm.app = app
          vm.problem = problem
          vm.notice = res.data.Notice
          vm.load()
        })
      })
    }, next)
  },
  beforeRouteUpdate (to, from, next) {
    makeRequests(to.params).then(res => {
      const app = res[0].data.App
      const problem = res[1].data.Problem
      if (res[2]) {
        this.app = app
        this.problem = problem
        this.notice = res[2].data.Notice
        this.load()
        next()
        return
      }
      return http.get(`/apps/${to.params.id}/problems/${to.params.pid}/notices/${problem.LastNoticeId}`).then(res => {
        this.app = app
        this.problem = problem
        this.notice = res.data.Notice
        this.load()
        next()
      })
    }, next)
  }
}
</script>

<style scoped>
</style>
