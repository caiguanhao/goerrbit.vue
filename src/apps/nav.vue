<template>
  <ul class="nav nav-pills mb-3">
    <li class="nav-item">
      <router-link class="nav-link" active-class="active"
        v-bind:to="{ name: 'RouteAppsEdit' }">Edit App</router-link>
    </li>
    <li class="nav-item">
      <router-link class="nav-link" active-class="active"
        v-bind:to="{ name: 'RouteAppsNotifications' }">Notification Services</router-link>
    </li>
  </ul>
</template>
