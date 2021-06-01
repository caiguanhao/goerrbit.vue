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
  <div class="p-3 bg-light border rounded-3 mb-4">
    <div v-for="b in notice.Backtraces">
      <span v-text="b.File"></span>
      <span v-if="b.Number" v-text="':' + b.Number"></span>
      <span v-if="b.Column" v-text="':' + b.Column"></span>
      &rarr;
      <span v-text="b.Method"></span>
    </div>
  </div>

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

export default {
  data () {
    return {
      app: {},
      problem: {},
      notice: {}
    }
  },
  beforeRouteEnter (to, from, next) {
    Promise.all([
      http.get(`/apps/${to.params.id}`),
      http.get(`/apps/${to.params.id}/problems/${to.params.pid}`)
    ]).then(res => {
      const app = res[0].data.App
      const problem = res[1].data.Problem
      return http.get(`/apps/${to.params.id}/problems/${to.params.pid}/notices/${problem.LastNoticeId}`).then(res => {
        next(vm => {
          vm.app = app
          vm.problem = problem
          vm.notice = res.data.Notice
        })
      })
    }, next)
  },
  beforeRouteUpdate (to, from, next) {
    Promise.all([
      http.get(`/apps/${to.params.id}`),
      http.get(`/apps/${to.params.id}/problems/${to.params.pid}`)
    ]).then(res => {
      const app = res[0].data.App
      const problem = res[1].data.Problem
      return http.get(`/apps/${to.params.id}/problems/${to.params.pid}/notices/${problem.LastNoticeId}`).then(res => {
        this.app = app
        this.problem = problem
        this.notice = res.data.Notice
        next()
      })
    }, next)
  }
}
</script>

<style scoped>
</style>
