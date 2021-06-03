<template>
  <ProblemsHeader />
  <Problems v-bind:problems="problems" v-bind:apps="apps" v-bind:pagination="pagination" />
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
  beforeRouteEnter (to, from, next) {
    http.get('/problems', { params: to.query }).then(res => {
      next(vm => {
        vm.problems = res.data.Problems
        vm.pagination = res.data.Pagination
        vm.apps = res.data.Apps
        vm.query = to.query.query
      })
    }, next)
  },
  beforeRouteUpdate (to, from, next) {
    http.get('/problems', { params: to.query }).then(res => {
      this.problems = res.data.Problems
      this.pagination = res.data.Pagination
      this.apps = res.data.Apps
      this.query = to.query.query
      next()
    }, next)
  }
}
</script>

<style scoped>
</style>
