<template>
  <div class="mb-3 border-bottom">
    <h1 class="h3">Add App</h1>
  </div>
  <Form class="col-sm-8" v-bind:obj="app" ref="form" />
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
    http.post(`/apps`).then(res => {
      next(vm => {
        vm.app = res.data.App
        setTimeout(() => {
          vm.$refs.form.generateApiKey()
        })
      })
    }, next)
  },
  beforeRouteUpdate (to, from, next) {
    http.post(`/apps`).then(res => {
      this.app = res.data.App
      setTimeout(() => {
        this.$refs.form.generateApiKey()
      })
      next()
    }, next)
  }
}
</script>

<style scoped>
</style>
