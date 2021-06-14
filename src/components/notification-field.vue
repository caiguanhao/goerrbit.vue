<template>
  <label class="form-label">
    <span v-text="field.Label"></span>
    <span class="form-text ms-3" v-text="field.Hint" v-if="field.Hint"></span>
  </label>
  <textarea class="form-control" rows="5"
    v-if="field.Type === 'textarea'"
    v-bind:ref="field.Name"
    v-model="options[field.Name]"
    v-bind:placeholder="field.Placeholder"></textarea>
  <input class="form-control" autocomplete="off" type="number"
    v-else-if="field.Type === 'number'"
    v-bind:ref="field.Name"
    v-model.number="options[field.Name]"
    v-bind:placeholder="field.Placeholder">
  <div class="form-control-plaintext"
    v-else-if="isEdit && field.Type === 'password'">
    <div class="d-flex" v-if="editing[field.Name]">
      <div class="w-100">
        <input class="form-control" autocomplete="off" type="password"
          v-bind:ref="field.Name"
          v-model="options[field.Name]" v-bind:placeholder="field.Placeholder">
      </div>
      <div>
        <div class="form-control-plaintext">
          <a class="ms-3 small text-danger" href v-on:click.prevent="cancel">
            cancel
          </a>
        </div>
      </div>
    </div>
    <template v-else>
      <span v-text="options[field.Name]"></span>
      <a href class="ms-3 small" v-on:click.prevent="edit">edit</a>
    </template>
  </div>
  <input class="form-control" autocomplete="off"
    v-else
    v-bind:ref="field.Name"
    v-bind:type="field.Type || 'text'"
    v-model="options[field.Name]"
    v-bind:placeholder="field.Placeholder">
</template>

<script>
export default {
  props: {
    isEdit: Boolean,
    field: Object,
    options: Object
  },
  data () {
    return {
      editing: {}
    }
  },
  methods: {
    reset () {
      this.cancel()
    },
    edit () {
      let field = this.field.Name
      this.editing[field] = { value: this.options[field] }
      this.options[field] = null
      if (this.options.$$ignoredFields) {
        this.options.$$ignoredFields[field] = false
      }
      setTimeout(() => {
        this.$refs[field].focus()
      })
    },
    cancel () {
      let field = this.field.Name
      if (this.editing[field]) {
        this.options[field] = this.editing[field].value
      }
      delete(this.editing[field])
      if (this.options.$$ignoredFields) {
        this.options.$$ignoredFields[field] = true
      }
    }
  }
}
</script>
