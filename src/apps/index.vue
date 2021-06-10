<template>
  <div class="p-3 bg-light border rounded-3 mb-4 d-sm-flex align-items-center justify-content-between">
    <div class="mb-3 mb-sm-0">
      <h4>Apps</h4>
    </div>
    <div>
      <router-link v-bind:to="{ name: 'RouteAppsNew' }"
        v-if="currentUser.IsAdmin" class="btn btn-primary">Add a New App</router-link>
    </div>
  </div>
  <template v-if="pagination.TotalCount === 0 && !isSearch">
    <h5 class="mb-0 text-muted">No apps have been created yet</h5>
  </template>
  <template v-else>
  <div class="d-sm-flex align-items-center justify-content-end">
    <form class="mb-3" v-on:submit.prevent="search">
      <div class="input-group">
        <input type="text" class="form-control" v-model="query">
        <button class="btn btn-outline-secondary" type="submit">Search</button>
      </div>
    </form>
  </div>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th>
            <SortButton sort="name" v-bind:pagination="pagination">NAME</SortButton>
          </th>
          <th width="20%">NOTIFY</th>
          <th width="20%">ERRORS</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="app in apps" class="clickable-row"
          v-bind:class="{ highlighted: lastAppId === app.Id }">
          <td>
            <router-link v-bind:to="{ name: 'RouteAppsShow', params: { id: app.Id } }"
              v-text="app.Name"></router-link>
          </td>
          <td>
            <router-link v-bind:to="{ name: 'RouteAppsNotifications', params: { id: app.Id } }"
              v-text="count(app.NotificationServicesCount)"></router-link>
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
  <Pagination v-if="pagination.TotalPages > 1" v-bind:pagination="pagination" />
  </template>
</template>

<script>
import http from '../http'
import Pagination from '../components/pagination.vue'
import SortButton from '../components/sort-button.vue'

export default {
  data () {
    return {
      apps: [],
      pagination: {},
      lastAppId: null,
      query: null
    }
  },
  components: {
    Pagination,
    SortButton
  },
  computed: {
    isSearch () {
      return !!this.$route.query.query
    }
  },
  methods: {
    load () {
      this.lastAppId = window.lastAppId
      window.lastAppId = null
      window.lastProblemId = null
    },
    search () {
      this.$router.push({
        name: this.$route.name,
        query: {
          query: this.query || undefined
        }
      })
    },
    count (c) {
      if (!c) {
        return '0 enabled'
      }
      if (c.Enabled > 0 && c.Disabled > 0) {
        return `${c.Enabled} enabled, ${c.Disabled} disabled`
      }
      if (c.Enabled === 0 && c.Disabled > 0) {
        return `${c.Disabled} disabled`
      }
      return `${c.Enabled} enabled`
    }
  },
  beforeRouteEnter (to, from, next) {
    http.get('/apps', { params: to.query }).then(res => {
      next(vm => {
        vm.apps = res.data.Apps
        vm.pagination = res.data.Pagination
        vm.query = to.query.query
        vm.load()
      })
    }, next)
  },
  beforeRouteUpdate (to, from, next) {
    http.get('/apps', { params: to.query }).then(res => {
      this.apps = res.data.Apps
      this.pagination = res.data.Pagination
      this.query = to.query.query
      this.load()
      next()
    }, next)
  }
}
</script>

<style scoped>
</style>
