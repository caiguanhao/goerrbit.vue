<template>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th width="100">#</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="app in apps">
          <td v-text="app.Id"></td>
          <td>
            <router-link v-bind:to="{ name: 'RouteAppsShow', params: { id: app.Id } }"
              v-text="app.Name"></router-link>
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
