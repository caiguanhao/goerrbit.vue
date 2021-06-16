<template>
  <form v-on:submit.prevent="submit">
    <input type="text" class="fake-input">
    <input type="password" class="fake-input">
    <div class="mb-3 row">
      <label class="col-sm-2 col-form-label">Name</label>
      <div class="col-sm-8">
        <input type="text" class="form-control" v-model="obj.Name" ref="Name"
          v-bind:disabled="!canEdit">
      </div>
    </div>
    <div class="mb-3 row">
      <label class="col-sm-2 col-form-label">Password</label>
      <div class="col-sm-8">
        <input type="password" class="form-control" v-model="obj.Password" ref="Password"
          v-bind:disabled="!canEdit">
        <div class="text-muted mt-2" v-if="obj.Id">
          <small>Leave blank to remain unchanged</small>
        </div>
      </div>
    </div>
    <div class="mb-3 row">
      <div class="col-sm-8 offset-sm-2">
        <div class="form-control-plaintext">
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="checkbox" v-model="obj.IsAdmin"
                v-bind:disabled="!currentUser.IsAdmin">
              <span>Admin</span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-3 row">
      <div class="col-sm-10 offset-sm-2">
        <button type="submit" class="btn btn-primary"
          v-bind:disabled="!canEdit || loading">Submit</button>
      </div>
    </div>
  </form>
</template>

<script>
import http from '../http'

export default {
  props: {
    obj: Object
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    canEdit () {
      if (this.currentUser.IsAdmin) return true
      if (this.obj.Id === this.currentUser.Id) return true
      return false
    }
  },
  methods: {
    submit () {
      this.loading = true
      this.processErrors()
      if (this.obj.Id) {
        let url = `/users/${this.obj.Id}`
        if (!this.currentUser.IsAdmin && this.obj.Id === this.currentUser.Id) {
          url = '/users/me'
        }
        http.put(url, this.obj).then(res => {
          this.loading = false
          for (let key in res.data.User) {
            this.obj[key] = res.data.User[key]
          }
          this.$router.push({
            name: 'RouteUsers'
          })
          this.$toast().success('Successfully updated user')
        }, (e) => {
          this.loading = false
          if (!this.processErrors(e)) {
            if (!e || !e.toastShown) {
              this.$toast().error('Error updating user')
            }
          }
        })
        return
      }
      http.post(`/users`, this.obj).then(res => {
        this.loading = false
        this.$router.push({
          name: 'RouteUsersEdit',
          params: {
            id: res.data.User.Id
          }
        })
        this.$toast().success('Successfully creating user')
      }, (e) => {
        this.loading = false
        if (!this.processErrors(e)) {
          if (!e || !e.toastShown) {
            this.$toast().error('Error creating user')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
