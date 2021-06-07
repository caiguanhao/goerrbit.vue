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
    field: Object,
    options: Object
  }
}
</script>
