<template>
  <div class="p-3 bg-light border rounded-3 mb-4 d-sm-flex align-items-center justify-content-between">
    <div class="mb-3 mb-sm-0">
      <h4 v-text="app.Name"></h4>
      <div class="small">
        <strong>Errors Caught:</strong> <span v-text="app.ProblemsCount"></span>
        <strong class="ms-3">API Key:</strong> <span v-text="app.ApiKey"></span>
      </div>
    </div>
    <div>
      <router-link v-bind:to="{ name: 'RouteAppsEdit', params: { id: app.Id } }" class="btn btn-primary">Edit</router-link>
    </div>
  </div>
  <template v-if="pagination.TotalCount === 0">
    <h3 class="mb-3">No errors have been caught yet, make sure you set up your app</h3>
    <pre class="p-3 bg-light border rounded-3 mb-4" v-text="rubyCode"></pre>
  </template>
  <template v-else>
  <div class="d-sm-flex align-items-center justify-content-between">
    <h4 class="mb-3">Errors</h4>
    <form class="mb-3" v-on:submit.prevent="search">
      <div class="input-group">
        <input type="text" class="form-control" v-model="query">
        <button class="btn btn-outline-secondary" type="button">Search</button>
      </div>
    </form>
  </div>
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
  <Pagination v-bind:pagination="pagination" />
  </template>
</template>

<script>
import * as timeago from 'timeago.js'
import http from '../http'
import Pagination from '../components/pagination.vue'

export default {
  components: {
    Pagination
  },
  data () {
    return {
      app: {},
      problems: [],
      pagination: {},
      query: null
    }
  },
  computed: {
    rubyCode () {
      let host = `${window.location.protocol}//${window.location.host}`
      return `# Require the airbrake gem in your App.
# ---------------------------------------------
#
# Ruby - In your Gemfile
# gem 'airbrake', '~> 5.0'
#
# Then add the following to config/initializers/errbit.rb
# -------------------------------------------------------

Airbrake.configure do |config|
  config.host = '${host}'
  config.project_id = 1 # required, but any positive integer works
  config.project_key = '${this.app.ApiKey}'

  # Uncomment for Rails apps
  # config.environment = Rails.env
  # config.ignore_environments = %w(development test)
end`
    }
  },
  methods: {
    timeago (time) {
      return timeago.format(time)
    },
    search () {
      this.$router.push({ name: this.$route.name, query: { query: this.query || undefined } })
    }
  },
  beforeRouteEnter (to, from, next) {
    Promise.all([
      http.get(`/apps/${to.params.id}`),
      http.get(`/apps/${to.params.id}/problems`, { params: to.query })
    ]).then(res => {
      next(vm => {
        vm.app = res[0].data.App
        vm.problems = res[1].data.Problems
        vm.pagination = res[1].data.Pagination
        vm.query = to.query.query
      })
    }, next)
  },
  beforeRouteUpdate (to, from, next) {
    Promise.all([
      http.get(`/apps/${to.params.id}`),
      http.get(`/apps/${to.params.id}/problems`, { params: to.query })
    ]).then(res => {
      this.app = res[0].data.App
      this.problems = res[1].data.Problems
      this.pagination = res[1].data.Pagination
      this.query = to.query.query
      next()
    }, next)
  }
}
</script>

<style scoped>
</style>
