<template>
  <div class="p-3 bg-light border rounded-3 mb-4 d-sm-flex align-items-center justify-content-between">
    <h4 class="mb-3 mb-sm-0">Unresolved Errors</h4>
    <form v-on:submit.prevent="search">
      <div class="input-group">
        <input type="text" class="form-control" v-model="query">
        <button class="btn btn-outline-secondary" type="button">Search</button>
      </div>
    </form>
  </div>
  <Problems v-bind:problems="problems" v-bind:apps="apps" v-bind:pagination="pagination" />
</template>

<script>
import http from '../http'
import Problems from '../components/problems.vue'

export default {
  components: {
    Problems
  },
  data () {
    return {
      problems: [],
      pagination: {},
      apps: [],
      query: null
    }
  },
  methods: {
    search () {
      this.$router.push({ name: this.$route.name, query: { query: this.query || undefined } })
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
