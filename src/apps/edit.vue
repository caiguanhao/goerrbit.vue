<template>
  <Nav />
  <Form class="col-sm-8" v-bind:obj="app" />
</template>

<script>
import http from '../http'
import Nav from './nav.vue'
import Form from './form.vue'

export default {
  components: {
    Nav,
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
