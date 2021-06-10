<template>
  <div class="d-sm-flex align-items-center justify-content-between">
    <div class="btn-group mb-3">
      <button class="btn btn-outline-secondary dropdown-toggle"
        type="button" data-bs-toggle="dropdown" aria-expanded="false"
        v-text="$route.query.status === 'resolved' ? 'Resolved Errors' : 'Unresolved Errors'">
      </button>
      <ul class="dropdown-menu">
        <li v-if="$route.query.status === 'resolved'">
          <router-link class="dropdown-item"
            v-bind:to="{ query: { query: $route.query.query } }">Unresolved Errors</router-link>
        </li>
        <li v-else>
          <router-link class="dropdown-item"
            v-bind:to="{ query: { query: $route.query.query, status: 'resolved' } }">Resolved Errors</router-link>
        </li>
      </ul>
    </div>
    <form class="mb-3" v-on:submit.prevent="search">
      <div class="input-group">
        <input type="text" class="form-control" v-model="query">
        <button class="btn btn-outline-secondary" type="submit">Search</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query: null
    }
  },
  watch: {
    '$route.query.query': {
      immediate: true,
      handler (value) {
        this.query = value
      }
    }
  },
  methods: {
    search () {
      this.$router.push({
        name: this.$route.name,
        query: {
          status: this.$route.query.status,
          environment: this.$route.query.environment,
          query: this.query || undefined
        }
      })
    }
  }
}
</script>
