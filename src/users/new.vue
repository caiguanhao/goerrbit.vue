<template>
  <div class="mb-3 border-bottom">
    <h1 class="h3">Add User</h1>
  </div>
  <Form class="col-sm-8" v-bind:obj="user" ref="form" />
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
      user: {}
    }
  },
  beforeRouteEnter (to, from, next) {
    http.post(`/users`).then(res => {
      next(vm => {
        vm.user = res.data.User
      })
    }, next)
  },
  beforeRouteUpdate (to, from, next) {
    http.post(`/users`).then(res => {
      this.user = res.data.User
      next()
    }, next)
  }
}
</script>

<style scoped>
</style>
