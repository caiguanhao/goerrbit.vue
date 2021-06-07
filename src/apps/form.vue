<template>
  <form v-on:submit.prevent="submit">
    <div class="mb-3 row">
      <label class="col-sm-2 col-form-label">Name</label>
      <div class="col-sm-8">
        <input type="text" class="form-control" v-model="obj.Name" ref="Name"
          v-bind:disabled="!currentUser.IsAdmin">
      </div>
    </div>
    <div class="mb-3 row">
      <label class="col-sm-2 col-form-label">API Key</label>
      <div class="col-sm-8">
        <input type="text" class="form-control" v-model="obj.ApiKey" ref="ApiKey"
          v-bind:disabled="!currentUser.IsAdmin">
      </div>
      <div class="col-sm-2">
        <div class="form-control-plaintext" v-if="currentUser.IsAdmin">
          <a href v-on:click.prevent="generateApiKey">Regenerate</a>
        </div>
      </div>
    </div>
    <div class="mb-3 row">
      <label class="col-sm-2 col-form-label">Fingerprinter</label>
      <div class="col-sm-8" v-if="obj.ActualFingerprinter">
        <div class="form-control-plaintext">
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="checkbox" v-model="customFingerprinter"
                v-bind:disabled="!currentUser.IsAdmin">
              <span>Custom Fingerprinter</span>
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="checkbox"
                v-bind:disabled="!currentUser.IsAdmin || !customFingerprinter"
                v-model="currentFingerprinter.ErrorClass">
              <span>Error Class</span>
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="checkbox"
                v-bind:disabled="!currentUser.IsAdmin || !customFingerprinter"
                v-model="currentFingerprinter.Message">
              <span>Message</span>
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="checkbox"
                v-bind:disabled="!currentUser.IsAdmin || !customFingerprinter"
                v-model="currentFingerprinter.Component">
              <span>Component</span>
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="checkbox"
                v-bind:disabled="!currentUser.IsAdmin || !customFingerprinter"
                v-model="currentFingerprinter.Action">
              <span>Action</span>
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="checkbox"
                v-bind:disabled="!currentUser.IsAdmin || !customFingerprinter"
                v-model="currentFingerprinter.EnvironmentName">
              <span>Environment Name</span>
            </label>
          </div>
          <div class="form-check">
            <div class="input-group input-group-sm backtrace">
              <span class="input-group-text">Backtrace Lines</span>
              <input class="form-control" type="number" min="-1" step="1"
                v-bind:disabled="!currentUser.IsAdmin || !customFingerprinter"
                v-model.number="currentFingerprinter.BacktraceLines">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-3 row">
      <div class="col-sm-10 offset-sm-2">
        <button type="submit" class="btn btn-primary"
          v-bind:disabled="!currentUser.IsAdmin || loading">Submit</button>
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
    currentFingerprinter () {
      if (this.obj.Fingerprinter) {
        return this.obj.Fingerprinter
      }
      return this.obj.ActualFingerprinter
    },
    customFingerprinter: {
      get () {
        return !!this.obj.Fingerprinter
      },
      set (val) {
        if (val) {
          this.obj.Fingerprinter = JSON.parse(JSON.stringify(this.obj.ActualFingerprinter))
        } else {
          this.obj.Fingerprinter = null
        }
      }
    }
  },
  methods: {
    generateApiKey () {
      let key = []
      let chars = 'abcdef0123456789'
      for (let i = 0; i < 32; i++) {
        key.push(chars.charAt(Math.floor(Math.random() * 16)))
      }
      this.obj.ApiKey = key.join('')
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
            if (!e || !e.toastShown) {
              this.$toast().error('Error updating app')
            }
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
        this.$toast().success('Successfully created app')
      }, (e) => {
        this.loading = false
        if (!this.processErrors(e)) {
          if (!e || !e.toastShown) {
            this.$toast().error('Error creating app')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.backtrace {
  width: 240px;
}
</style>
