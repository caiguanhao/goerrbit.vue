<template>
  <form v-on:submit.prevent="submit">
    <div class="mb-3 row">
      <label class="col-sm-2 col-form-label">Name</label>
      <div class="col-sm-8">
        <input type="text" class="form-control" v-model="obj.Name" ref="Name">
      </div>
    </div>
    <div class="mb-3 row">
      <label class="col-sm-2 col-form-label">API Key</label>
      <div class="col-sm-8">
        <input type="text" class="form-control" v-model="obj.ApiKey" ref="ApiKey">
      </div>
      <div class="col-sm-2">
        <div class="form-control-plaintext">
          <a href v-on:click.prevent="obj.ApiKey = generateKey()">Regenerate</a>
        </div>
      </div>
    </div>
    <div class="mb-3 row">
      <div class="col-sm-10 offset-sm-2">
        <button type="submit" class="btn btn-primary"
          v-bind:disabled="loading">Submit</button>
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
  methods: {
    generateKey () {
      let key = []
      let chars = 'abcdef0123456789'
      for (let i = 0; i < 32; i++) {
        key.push(chars.charAt(Math.floor(Math.random() * 16)))
      }
      return key.join('')
    },
    submit () {
      this.loading = true
      this.processErrors()
      if (this.obj.Id) {
        http.put(`/apps/${this.obj.Id}`, this.obj).then(res => {
          this.loading = false
          for (let key in res.data.App) {
            this.obj[key] = res.data.App[key]
          }
          this.$router.push({
            name: 'RouteAppsShow',
            params: {
              id: res.data.App.Id
            }
          })
          this.$toast().success('Successfully updated app')
        }, (e) => {
          this.loading = false
          if (!this.processErrors(e)) {
            this.$toast().error('Error updating app')
          }
        })
        return
      }
      http.post(`/apps`, this.obj).then(res => {
        this.loading = false
        this.$router.push({
          name: 'RouteAppsShow',
          params: {
            id: res.data.App.Id
          }
        })
        this.$toast().success('Successfully creating app')
      }, (e) => {
        this.loading = false
        if (!this.processErrors(e)) {
          this.$toast().error('Error creating app')
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
