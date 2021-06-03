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
  <ProblemsHeader />
  <Problems v-bind:problems="problems" v-bind:pagination="pagination">
    <h3 class="mb-3">No errors have been caught yet, make sure you set up your app</h3>
    <pre class="p-3 bg-light border rounded-3 mb-4" v-text="rubyCode"></pre>
  </Problems>
</template>

<script>
import http from '../http'
import Problems from '../components/problems.vue'
import ProblemsHeader from '../components/problems-header.vue'

export default {
  components: {
    Problems,
    ProblemsHeader
  },
  data () {
    return {
      app: {},
      problems: [],
      pagination: {}
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
  beforeRouteEnter (to, from, next) {
    Promise.all([
      http.get(`/apps/${to.params.id}`),
      http.get(`/apps/${to.params.id}/problems`, { params: to.query })
    ]).then(res => {
      next(vm => {
        vm.app = res[0].data.App
        vm.problems = res[1].data.Problems
        vm.pagination = res[1].data.Pagination
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
      next()
    }, next)
  }
}
</script>

<style scoped>
</style>
