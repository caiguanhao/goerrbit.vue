<template>
  <Nav />

  <div class="mb-3">
    <button type="button" class="btn btn-secondary"
      data-bs-toggle="modal" data-bs-target="#add">Add New Service...</button>
  </div>

  <div class="row">
    <div class="col-sm-6" v-bind:class="{ disabled: !service.Enabled }" v-for="service in services">
      <div class="card mb-3">
        <div class="card-header d-flex align-items-center justify-content-between">
          <label class="form-check-label">
            <input class="form-check-input" type="checkbox"
              v-on:click.prevent="toggle(service)"
              v-bind:disabled="loading"
              v-bind:checked="service.Enabled">
            <h5 class="ms-2 mb-0 d-inline" v-text="service.Name"></h5>
          </label>
          <div>
            <span class="small me-3 text-muted" v-if="loading">Test</span>
            <a href class="small me-3" v-else
              v-on:click.prevent="test(service)">Test</a>
            <a href v-on:click="edit(service)" class="small"
              data-bs-toggle="modal" data-bs-target="#edit">Edit</a>
          </div>
        </div>
        <table class="table small mb-0">
          <tbody>
            <template v-for="field in getService(service.Name, 'Fields')">
              <tr v-if="optionValueOf(service, field.Name)">
                <th width="30%" v-text="field.Label"></th>
                <td class="value" v-text="optionValueOf(service, field.Name)"></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <form v-on:submit.prevent="add" class="modal" id="add" tabindex="-1">
    <input type="text" class="fake-input">
    <input type="password" class="fake-input">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add New Service</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-2">
            <label class="form-label">Service</label>
            <select class="form-select" v-model="selectedService">
              <option v-bind:value="null">Select service...</option>
              <option v-for="service in availableServices"
                v-bind:value="service"
                v-text="service.Name"></option>
            </select>
            <div class="mt-2 text-muted" v-if="selectedService && selectedService.Description">
              <small v-SimpleHtml="selectedService.Description"></small>
            </div>
          </div>
          <div class="mb-2" v-if="selectedService && relatedApps.length">
            <select class="form-select" v-model="selectedRelatedAppId">
              <option v-bind:value="null">Enter new</option>
              <option v-for="app in relatedApps"
                v-bind:value="app.Id"
                v-text="`Copy ${selectedService.Name} settings from app ${app.Name} (#${app.Id})`"></option>
            </select>
          </div>
          <div v-if="selectedService && selectedRelatedAppId === null">
            <div class="mb-2" v-for="field in selectedService.Fields">
              <NotificationField v-bind:field="field" v-bind:ref="field.Name"
                v-bind:options="selectedServiceOptions" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary"
            v-bind:disabled="loading">Save</button>
        </div>
      </div>
    </div>
  </form>

  <form v-on:submit.prevent="submit" class="modal" id="edit" tabindex="-1">
    <input type="text" class="fake-input">
    <input type="password" class="fake-input">
    <div class="modal-dialog">
      <div class="modal-content" v-if="editingService">
        <div class="modal-header">
          <h5 class="modal-title">Editing <span v-text="editingService.Name"></span></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-2 text-muted" v-if="serviceEditing.Description">
            <small v-SimpleHtml="serviceEditing.Description"></small>
          </div>
          <div class="mb-3" v-for="field in serviceEditing.Fields">
            <NotificationField v-bind:isEdit="true" v-bind:field="field"
              v-bind:ref="field.Name" v-bind:options="editingService.Options" />
          </div>
        </div>
        <div class="modal-footer justify-content-between">
          <button type="button" class="btn btn-danger"
            v-bind:disabled="loading"
            v-on:click.prevent="remove">Remove</button>
          <button type="submit" class="btn btn-primary"
            v-bind:disabled="loading">Save</button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import http from '../http'
import Nav from './nav.vue'
import { Modal } from 'bootstrap'
import NotificationField from '../components/notification-field.vue'
import SimpleHtml from '../components/simple-html.vue'

export default {
  components: {
    Nav,
    NotificationField
  },
  directives: {
    SimpleHtml
  },
  data () {
    return {
      loading: false,
      app: {},
      selectedService: null,
      selectedServiceOptions: {},
      services: [],
      availableServices: [],
      editingService: null,
      serviceEditing: null,
      relatedApps: [],
      selectedRelatedAppId: null
    }
  },
  watch: {
    selectedService (service) {
      for (let key in this.selectedServiceOptions) {
        delete(this.selectedServiceOptions[key])
      }
      if (service) {
        service.Fields.forEach(f => {
          this.selectedServiceOptions[f.Name] = f.DefaultValue
        })
        this.getRelated(service.Name)
      } else {
        this.relatedApps = []
        this.selectedRelatedAppId = null
      }
    }
  },
  methods: {
    closeModals () {
      let m = Modal.getInstance(document.getElementById('add'))
      if (m) m.hide()
      m = Modal.getInstance(document.getElementById('edit'))
      if (m) m.hide()
    },

    getService (name, field) {
      for (let i = 0; i < this.availableServices.length; i++) {
        if (this.availableServices[i].Name === name) {
          if (field) {
            return this.availableServices[i][field]
          }
          return this.availableServices[i]
        }
      }
      return null
    },

    optionValueOf (service, fieldName) {
      let fields = this.getService(service.Name, 'Fields') || []
      let field = fields.find(f => f.Name === fieldName)
      if (field && field.Type === 'select') {
        for (let i = 0; i < field.Options.length; i++) {
          if (field.Options[i][0] === service.Options[fieldName]) {
            return field.Options[i][1]
          }
        }
      }
      return service.Options[fieldName]
    },

    edit (service) {
      this.editingService = JSON.parse(JSON.stringify(service))
      this.serviceEditing = this.getService(this.editingService.Name)
      let ignored = {}
      let fields = this.serviceEditing.Fields
      fields.forEach(f => {
        if (f.Type === 'password') {
          ignored[f.Name] = true
        }
      })
      this.editingService.Options.$$ignoredFields = ignored
      for (let key in this.$refs) {
        if (typeof(this.$refs[key].reset) === 'function') {
          this.$refs[key].reset()
        }
      }
    },

    test (service) {
      this.loading = true
      http.put(`/apps/${this.$route.params.id}/notification-services`, {
        Name: service.Name
      }).then((res) => {
        this.loading = false
        this.$toast().success('Successfully ran test')
      }, (e) => {
        this.loading = false
        if (e && e.response && e.response.data && e.response.data.Message) {
          this.$toast().error(e.response.data.Message)
        } else {
          this.$toast().error('Error testing service')
        }
      })
    },

    toggle (service) {
      this.loading = true
      http.patch(`/apps/${this.$route.params.id}/notification-services`, {
        Name: service.Name
      }).then((res) => {
        this.loading = false
        this.$toast().success('Successfully changed status')
        this.services = res.data.NotificatinonServices
      }, (e) => {
        this.loading = false
        this.$toast().error('Error changing status')
      })
    },

    add () {
      this.loading = true
      this.processErrors()

      let promise
      if (this.selectedRelatedAppId) {
        promise = http.post(`/apps/${this.$route.params.id}/notification-services/related`, {
          From: this.selectedRelatedAppId,
          Name: this.selectedService.Name
        })
      } else {
        promise = http.post(`/apps/${this.$route.params.id}/notification-services`, {
          Name: this.selectedService.Name,
          Options: this.selectedServiceOptions
        })
      }

      promise.then((res) => {
        this.loading = false
        this.selectedService = null
        this.$toast().success('Successfully added service')
        this.services = res.data.NotificatinonServices
        this.closeModals()
      }, (e) => {
        this.loading = false
        if (!this.processErrors(e)) {
          if (!e || !e.toastShown) {
            this.$toast().error('Error adding service')
          }
        }
      })
    },

    submit () {
      let options = JSON.parse(JSON.stringify(this.editingService.Options))
      let ignored = options.$$ignoredFields
      for (let key in ignored) {
        if (ignored[key] === true) delete(options[key])
      }
      delete(options.$$ignoredFields)
      this.loading = true
      this.processErrors()
      http.post(`/apps/${this.$route.params.id}/notification-services`, {
        Name: this.editingService.Name,
        Options: options
      }).then((res) => {
        this.loading = false
        this.$toast().success('Successfully updated service')
        this.services = res.data.NotificatinonServices
        this.closeModals()
      }, (e) => {
        this.loading = false
        if (!this.processErrors(e)) {
          if (!e || !e.toastShown) {
            this.$toast().error('Error editing service')
          }
        }
      })
    },

    remove () {
      if (!window.confirm('Are you sure you want to remove this service from this app?')) return
      this.loading = true
      this.processErrors()
      http.delete(`/apps/${this.$route.params.id}/notification-services`, {
        data: {
          Name: this.editingService.Name
        }
      }).then((res) => {
        this.loading = false
        this.$toast().success('Successfully removed service')
        this.services = res.data.NotificatinonServices
        this.closeModals()
      }, (e) => {
        this.loading = false
        this.$toast().error('Error removing service')
      })
    },

    getRelated (name) {
      http.get('/notification-services/related', {
        params: {
          AppId: this.$route.params.id,
          Name: name
        }
      }).then(res => {
        this.relatedApps = res.data.Apps
        this.selectedRelatedAppId = null
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    Promise.all([
      http.get(`/apps/${to.params.id}`),
      http.get('/notification-services'),
      http.get(`/apps/${to.params.id}/notification-services`)
    ]).then(res => {
      next(vm => {
        vm.app = res[0].data.App
        vm.availableServices = res[1].data.NotificatinonServices
        vm.services = res[2].data.NotificatinonServices
      })
    }, next)
  },
  beforeRouteUpdate (to, from, next) {
    Promise.all([
      http.get(`/apps/${to.params.id}`),
      http.get('/notification-services'),
      http.get(`/apps/${to.params.id}/notification-services`)
    ]).then(res => {
      this.app = res[0].data.App
      this.availableServices = res[1].data.NotificatinonServices
      this.services = res[2].data.NotificatinonServices
      next()
    }, next)
  },
  beforeRouteLeave (to, from, next) {
    this.closeModals()
    next()
  }
}
</script>

<style scoped>
.disabled {
  opacity: 0.7;
}

.value {
  white-space: pre-wrap;
}
</style>
