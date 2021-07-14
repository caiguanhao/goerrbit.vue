<template>
  <button type="button" class="btn btn-sm btn-danger" ref="button">
    <faicon icon="trash-alt" />
  </button>
  <div class="d-none" ref="confirm">
    <div class="mb-2">Permanently delete this comment?</div>
    <div class="d-flex justify-content-between">
      <a href v-on:click.prevent="delete"
        v-bind:class="{ disabled: loading }"
        class="btn btn-sm btn-danger">Delete</a>
      <a href v-on:click.prevent="cancel"
        v-bind:class="{ disabled: loading }"
        class="btn btn-sm btn-secondary">Cancel</a>
    </div>
  </div>
</template>

<script>
import http from '../http'
import { Popover } from 'bootstrap'

export default {
  props: {
    loading: Boolean
  },
  emits: [
    'delete'
  ],
  mounted () {
    let button = this.$refs.button
    let confirm = this.$refs.confirm
    confirm.parentNode.removeChild(confirm)
    confirm.classList.remove('d-none')
    this.popover = new Popover(button, {
      html: true,
      trigger: 'focus',
      content: confirm,
      container: button
    })
  },
  methods: {
    cancel () {
      this.popover.hide()
    },
    delete () {
      this.$emit('delete')
      this.popover.hide()
    }
  }
}
</script>
