<template>
  <template v-if="pagination.TotalCount === 0 && !isSearch">
    <h3 class="mb-0">No users have been created yet</h3>
  </template>
  <template v-else>
  <div class="d-sm-flex align-items-center justify-content-between">
    <div class="mb-3">
      <button class="btn btn-outline-secondary dropdown-toggle"
        type="button" data-bs-toggle="dropdown" aria-expanded="false"
        v-text="$route.query.status === 'deleted' ? 'Deleted Users' : 'Active Users'">
      </button>
      <ul class="dropdown-menu">
        <li v-if="$route.query.status === 'deleted'">
          <router-link class="dropdown-item"
            v-bind:to="{ query: { query: $route.query.query } }">Active Users</router-link>
        </li>
        <li v-else>
          <router-link class="dropdown-item"
            v-bind:to="{ query: { query: $route.query.query, status: 'deleted' } }">Deleted Users</router-link>
        </li>
      </ul>
      <router-link v-bind:to="{ name: 'RouteUsersNew' }"
        v-if="currentUser.IsAdmin" class="ms-2 btn btn-primary">Add a New User</router-link>
    </div>
    <form class="mb-3" v-on:submit.prevent="search">
      <div class="input-group">
        <input type="text" class="form-control" v-model="query">
        <button class="btn btn-outline-secondary" type="submit">Search</button>
      </div>
    </form>
  </div>
  <template v-if="pagination.TotalCount === 0 && isSearch">
    <h3 class="mb-0">No users matched your query</h3>
  </template>
  <template v-else>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th width="60">#</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" class="clickable-row">
          <td v-text="user.Id"></td>
          <td>
            <span class="badge bg-primary me-2" v-if="user.IsAdmin">
              <faicon class="small" icon="crown" />
              Admin
            </span>
            <router-link v-bind:to="{ name: 'RouteUsersEdit', params: { id: user.Id } }"
              v-text="user.Name"></router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Pagination v-if="pagination.TotalPages > 1" v-bind:pagination="pagination" />
  </template>
  </template>
</template>

<script>
import http from '../http'
import Pagination from '../components/pagination.vue'

export default {
  data () {
    return {
      users: [],
      pagination: {},
      query: null
    }
  },
  components: {
    Pagination
  },
  computed: {
    isSearch () {
      return !!this.$route.query.query
    }
  },
  methods: {
    search () {
      this.$router.push({
        name: this.$route.name,
        query: {
          status: this.$route.query.status,
          query: this.query || undefined
        }
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    http.get('/users', { params: to.query }).then(res => {
      next(vm => {
        vm.users = res.data.Users
        vm.pagination = res.data.Pagination
        vm.query = to.query.query
      })
    }, next)
  },
  beforeRouteUpdate (to, from, next) {
    http.get('/users', { params: to.query }).then(res => {
      this.users = res.data.Users
      this.pagination = res.data.Pagination
      this.query = to.query.query
      next()
    }, next)
  }
}
</script>

<style scoped>
</style>
