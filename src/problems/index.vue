<template>
  <ProblemsHeader />
  <Problems v-bind:response="response"
    v-bind:showingResolved="$route.query.status === 'resolved'"
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
      response: {}
    }
  },
  methods: {
    load () {
      window.lastAppId = null
    },
    reload () {
      http.get('/problems', { params: this.$route.query }).then(res => {
        this.response = res.data
        this.query = this.$route.query.query
        this.load()
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    http.get('/problems', { params: to.query }).then(res => {
      next(vm => {
        vm.response = res.data
        vm.query = to.query.query
        vm.load()
      })
    }, next)
  },
  beforeRouteUpdate (to, from, next) {
    http.get('/problems', { params: to.query }).then(res => {
      this.response = res.data
      this.query = to.query.query
      this.load()
      next()
    }, next)
  }
}
</script>

<style scoped>
</style>
