<template>
  <div class="p-3 bg-light border rounded-3 mb-4">
    <h4 v-text="app.Name"></h4>
    <div class="small"><strong>API Key: </strong><span v-text="app.ApiKey"></span></div>
  </div>
  <h4>Errors</h4>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th>ENV</th>
          <th>WHAT / WHERE</th>
          <th>LATEST</th>
          <th>COUNT</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="problem in problems">
          <td v-text="problem.Environment"></td>
          <td>
            <router-link v-bind:to="{ name: 'RouteProblemsShow', params: { id: app.Id, pid: problem.Id } }"
              v-text="problem.Message"></router-link>
            <div class="small fst-italic text-muted" v-text="problem.Location"></div>
          </td>
          <td>
            <div v-text="timeago(problem.LastNoticeAt)"></div>
          </td>
          <td>
            <div v-text="problem.NoticesCount"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import * as timeago from 'timeago.js'
import http from '../http'

export default {
  data () {
    return {
      app: {},
      problems: []
    }
  },
  methods: {
    timeago (time) {
      return timeago.format(time)
    }
  },
  beforeRouteEnter (to, from, next) {
    Promise.all([
      http.get(`/apps/${to.params.id}`),
      http.get(`/apps/${to.params.id}/problems`)
    ]).then(res => {
      next(vm => {
        vm.app = res[0].data.App
        vm.problems = res[1].data.Problems
      })
    }, next)
  },
  beforeRouteUpdate (to, from, next) {
    Promise.all([
      http.get(`/apps/${to.params.id}`),
      http.get(`/apps/${to.params.id}/problems`)
    ]).then(res => {
      this.app = res[0].data.App
      this.problems = res[1].data.Problems
      next()
    }, next)
  }
}
</script>

<style scoped>
</style>
