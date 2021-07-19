<template>
  <div class="d-sm-flex align-items-center justify-content-between">
    <div class="mb-3">
      <h4 class="text-break mb-0" v-text="app.Name"></h4>
      <div class="text-muted count" v-text="`Errors Caught: ${app.ProblemsCount}`"></div>
    </div>
    <ul class="nav nav-pills mb-3">
      <li class="nav-item">
        <router-link class="nav-link" active-class="active"
          v-bind:to="{ name: 'RouteAppsShow' }">Problems</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" active-class="active"
          v-bind:to="{ name: 'RouteAppsEdit' }">Edit App</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" active-class="active"
          v-bind:to="{ name: 'RouteAppsNotifications' }">Notifications</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    app: Object
  }
}
</script>

<style scoped>
.count {
  font-size: 12px;
}
</style>
