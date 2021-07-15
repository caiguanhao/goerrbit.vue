<template>
  <div class="p-3 bg-light border rounded-3 mb-4 d-sm-flex align-items-center justify-content-between">
    <div class="mb-3 mb-sm-0">
      <h4 class="text-break" v-text="app.Name"></h4>
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
  <Problems
    v-bind:response="response"
    v-bind:showingResolved="$route.query.status === 'resolved'"
    v-on:reload="reload">
    <h5 class="mb-0 text-muted" v-if="$route.query.status === 'resolved'">No errors have been caught yet</h5>
    <template v-else>
      <h5 class="mb-3 text-muted">No errors have been caught yet, make sure you set up your app</h5>
      <pre class="p-3 bg-light border rounded-3 mb-4" v-text="rubyCode"></pre>
    </template>
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
      response: {}
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
    load () {
      window.lastAppId = this.app.Id
    },
    reload () {
      http.get(`/apps/${this.$route.params.id}/problems`, {
        params: this.$route.query
      }).then(res => {
        this.response = res.data
        this.load()
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    Promise.all([
      http.get(`/apps/${to.params.id}`),
      http.get(`/apps/${to.params.id}/problems`, { params: to.query })
    ]).then(res => {
      next(vm => {
        vm.app = res[0].data.App
        vm.response = res[1].data
        vm.load()
      })
    }, next)
  },
  beforeRouteUpdate (to, from, next) {
    Promise.all([
      http.get(`/apps/${to.params.id}`),
      http.get(`/apps/${to.params.id}/problems`, { params: to.query })
    ]).then(res => {
      this.app = res[0].data.App
      this.response = res[1].data
      this.load()
      next()
    }, next)
  }
}
</script>

<style scoped>
</style>
