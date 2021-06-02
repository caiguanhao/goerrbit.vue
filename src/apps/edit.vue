<template>
  <div class="mb-3 border-bottom">
    <h1 class="h3">Edit App</h1>
  </div>
  <Form class="col-sm-6" v-bind:obj="app" />
</template>

<script>
import http from '../http'
import Form from './form.vue'

export default {
  components: {
    Form
  },
  data () {
    return {
      app: {}
    }
  },
  beforeRouteEnter (to, from, next) {
    http.get(`/apps/${to.params.id}`).then(res => {
      next(vm => {
        vm.app = res.data.App
      })
    }, next)
  },
  beforeRouteUpdate (to, from, next) {
    http.get(`/apps/${to.params.id}`).then(res => {
      this.app = res.data.App
      next()
    }, next)
  }
}
</script>

<style scoped>
</style>
