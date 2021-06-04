<template>
  <form v-on:submit.prevent="signIn">
    <img class="mb-4" src="/android-chrome-512x512.png" alt="errbit" width="72" height="72">
    <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

    <div class="form-floating">
      <input type="text" class="form-control" v-model="name" ref="Name">
      <label>Name</label>
    </div>
    <div class="form-floating mb-3">
      <input type="password" class="form-control" v-model="password" ref="Password">
      <label>Password</label>
    </div>

    <div class="checkbox mb-3">
      <label>
        <input type="checkbox" v-model="rememberMe"> Remember me
      </label>
    </div>
    <button class="w-100 btn btn-lg btn-primary mb-4" type="submit"
      v-bind:disabled="loading">Sign in</button>
  </form>
</template>

<script>
import http from '../http'

export default {
  data () {
    return {
      loading: false,
      name: null,
      password: null,
      rememberMe: false
    }
  },
  methods: {
    signIn () {
      this.loading = true
      this.processErrors()
      http.post('/sign-in', {
        name: this.name,
        password: this.password
      }).then(res => {
        this.loading = false
        if (this.rememberMe) {
          if (window.localStorage) window.localStorage.setItem('token', res.data.Token)
          if (window.sessionStorage) window.sessionStorage.removeItem('token')
        } else {
          if (window.localStorage) window.localStorage.removeItem('token')
          if (window.sessionStorage) window.sessionStorage.setItem('token', res.data.Token)
        }
        this.$router.push({ name: 'RouteHome' })
      }, (e) => {
        this.loading = false
        if (!this.processErrors(e)) {
          this.$toast().error('Error signing in')
        }
      })
    }
  }
}
</script>

<style scoped>
form {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

form ::v-deep(.invalid-feedback) {
  margin-bottom: 15px;
}

input[type="text"]:not(.is-invalid) {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

input[type="password"]:not(.is-invalid) {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
