<template>
  <div class="p-3 bg-light border rounded-3 mb-4 d-sm-flex align-items-center justify-content-between">
    <div class="mb-3 mb-sm-0">
      <h4>Apps</h4>
    </div>
    <div>
      <router-link v-bind:to="{ name: 'RouteAppsNew' }" class="btn btn-primary">Add a New App</router-link>
    </div>
  </div>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th width="100">#</th>
          <th>Name</th>
          <th width="200">Errors</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="app in apps">
          <td v-text="app.Id"></td>
          <td>
            <router-link v-bind:to="{ name: 'RouteAppsShow', params: { id: app.Id } }"
              v-text="app.Name"></router-link>
          </td>
          <td>
            <span class="badge rounded-pill"
              v-bind:class="app.ProblemsCount === 0 ? 'bg-success' : 'bg-danger'"
              v-text="app.ProblemsCount"></span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import http from '../http'

export default {
  data () {
    return {
      apps: []
    }
  },
  beforeRouteEnter (to, from, next) {
    http.get('/apps', { params: to.query }).then(res => {
      next(vm => {
        vm.apps = res.data.Apps
      })
    }, next)
  },
  beforeRouteUpdate (to, from, next) {
    http.get('/apps', { params: to.query }).then(res => {
      this.apps = res.data.Apps
      next()
    }, next)
  }
}
</script>

<style scoped>
</style>
