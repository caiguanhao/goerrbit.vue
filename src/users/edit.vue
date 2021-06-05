<template>
  <div class="mb-3 border-bottom">
    <h1 class="h3">Edit User</h1>
  </div>
  <Form class="col-sm-8 mb-5" v-bind:obj="user" />
  <div class="mb-3 border-bottom">
    <h1 class="h3">Delete User</h1>
  </div>
  <div class="col-sm-8">
    <div class="mb-3 row">
      <div class="col-sm-2">
        Sessions
      </div>
      <div class="col-sm-10" v-text="user.SessionsCount"></div>
    </div>
    <div class="mb-3 row" v-if="user.DeletedAt">
      <div class="col-sm-2">
        Deleted At
      </div>
      <div class="col-sm-10" v-text="formatTime(user.DeletedAt)"></div>
    </div>
    <div class="mb-3 row">
      <div class="col-sm-10 offset-sm-2">
        <button type="button" class="btn btn-warning"
          v-if="user.DeletedAt"
          v-on:click.prevent="restore"
          v-bind:disabled="!currentUser.IsAdmin || loading">Restore</button>
        <template v-else>
          <button type="button" class="btn btn-danger"
            v-on:click.prevent="destroy"
            v-bind:disabled="!currentUser.IsAdmin || loading">Delete</button>
          <div class="text-muted mt-2">
            <small>Delete user will also delete all user's sessions</small>
          </div>
        </template>
      </div>
    </div>
  </div>
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
      user: {},
      loading: false
    }
  },
  methods: {
    restore () {
      if (!window.confirm('Are you sure you want to restore this user?')) return
      this.loading = true
      http.post(`/users/${this.user.Id}`).then(res => {
        this.loading = false
        this.$toast().success('Successfully restored user')
        for (let key in res.data.User) {
          this.user[key] = res.data.User[key]
        }
      }, (e) => {
        this.loading = false
        if (!e || !e.toastShown) {
          this.$toast().error('Failed to restore user')
        }
      })
    },
    destroy () {
      if (!window.confirm('Are you sure you want to delete this user?')) return
      this.loading = true
      http.delete(`/users/${this.user.Id}`).then(res => {
        this.loading = false
        this.$toast().success('Successfully deleted user')
        for (let key in res.data.User) {
          this.user[key] = res.data.User[key]
        }
      }, (error) => {
        this.loading = false
        if (!error || !error.toastShown) {
          this.$toast().error('Failed to delete user')
        }
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    http.get(`/users/${to.params.id}`).then(res => {
      next(vm => {
        vm.user = res.data.User
      })
    }, next)
  },
  beforeRouteUpdate (to, from, next) {
    http.get(`/users/${to.params.id}`).then(res => {
      this.user = res.data.User
      next()
    }, next)
  }
}
</script>

<style scoped>
</style>
