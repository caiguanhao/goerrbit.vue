<template>
  <div class="mb-3 border-bottom">
    <h1 class="h3">Add App</h1>
  </div>
  <Form class="col-sm-8" v-bind:obj="app" />
</template>

<script>
import Form from './form.vue'

export default {
  components: {
    Form
  },
  data () {
    return {
      app: {}
    }
  }
}
</script>

<style scoped>
</style>
