<template>
  <ProblemsHeader />
  <Problems v-bind:problems="problems"
    v-bind:showingResolved="$route.query.status === 'resolved'"
    v-bind:apps="apps" v-bind:pagination="pagination"
    v-on:reload="reload">
    <h5 class="mb-0 text-muted">No errors have been caught yet</h5>
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
      problems: [],
      pagination: {},
      apps: []
    }
  },
  methods: {
    load () {
      window.lastAppId = null
    },
    reload () {
      http.get('/problems', { params: this.$route.query }).then(res => {
        this.problems = res.data.Problems
        this.pagination = res.data.Pagination
        this.apps = res.data.Apps
        this.query = this.$route.query.query
        this.load()
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    http.get('/problems', { params: to.query }).then(res => {
      next(vm => {
        vm.problems = res.data.Problems
        vm.pagination = res.data.Pagination
        vm.apps = res.data.Apps
        vm.query = to.query.query
        vm.load()
      })
    }, next)
  },
  beforeRouteUpdate (to, from, next) {
    http.get('/problems', { params: to.query }).then(res => {
      this.problems = res.data.Problems
      this.pagination = res.data.Pagination
      this.apps = res.data.Apps
      this.query = to.query.query
      this.load()
      next()
    }, next)
  }
}
</script>

<style scoped>
</style>
