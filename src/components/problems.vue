<template>
  <template v-if="hasNoProblems">
    <h3 v-if="isSearch">No errors matched your query</h3>
    <template v-else><slot /></template>
  </template>
  <template v-else>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th width="200">
            <div v-if="apps">APP</div>
            <div v-else>ENV</div>
          </th>
          <th>WHAT / WHERE</th>
          <th width="200">LATEST</th>
          <th width="100">COUNT</th>
          <th width="100">RESOLVE</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="problem in problems" class="clickable-row"
          v-bind:class="{ highlighted: lastProblemId === problem.Id,
                          resolved: !!problem.ResolvedAt }">
          <td>
            <div v-if="apps">
              <router-link v-bind:to="{ name: 'RouteAppsShow', params: { id: problem.AppId } }"
                v-text="appNames[problem.AppId]">
              </router-link>
              <small class="ms-2"><small v-text="problem.Environment"></small></small>
            </div>
            <div v-else v-text="problem.Environment"></div>
          </td>
          <td>
            <router-link v-bind:to="{ name: 'RouteProblemsShow', params: { id: problem.AppId, pid: problem.Id } }"
              class="clickable-row-target" v-text="problem.Message"></router-link>
            <div class="small fst-italic text-muted" v-text="problem.Location"></div>
          </td>
          <td>
            <div class="text-nowrap" v-text="timeago(problem.LastNoticeAt)"></div>
          </td>
          <td>
            <span class="badge rounded-pill"
              v-bind:class="problem.NoticesCount === 0 ? 'bg-success' : 'bg-danger'"
              v-text="problem.NoticesCount"></span>
          </td>
          <td>
            <a href class="text-primary"
              v-if="!problem.ResolvedAt"
              v-on:click.prevent="resolve(problem)"><faicon icon="thumbs-up" /></a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Pagination v-bind:pagination="pagination" />
  </template>
</template>

<script>
import * as timeago from 'timeago.js'
import Pagination from '../components/pagination.vue'
import http from '../http'

export default {
  props: {
    apps: Array,
    problems: Array,
    pagination: Object
  },
  components: {
    Pagination
  },
  data () {
    return {
      lastProblemId: null
    }
  },
  computed: {
    appNames () {
      if (!this.apps) {
        return null
      }
      let map = {}
      for (let i = 0; i < this.apps.length; i++) {
        map[this.apps[i].Id] = this.apps[i].Name
      }
      return map
    },
    isSearch () {
      return !!this.$route.query.query
    },
    hasNoProblems () {
      return this.pagination.TotalCount === 0
    }
  },
  methods: {
    timeago (time) {
      return timeago.format(time)
    },
    resolve (problem) {
      if (!window.confirm('Resolve this issue? It can be unresolved later.')) return
      http.put(`/apps/${problem.AppId}/problems/${problem.Id}/resolve`).then(res => {
        this.$toast().success('Successfully resovled issue')
        for (let key in res.data.Problem) {
          problem[key] = res.data.Problem[key]
        }
      }, () => {
        this.$toast().error('Error resolving issue')
      })
    }
  },
  created () {
    this.lastProblemId = window.lastProblemId
    window.lastProblemId = null
    window.lastAppId = null
  }
}
</script>

<style scoped>
.resolved {
  opacity: 0.5;
}
</style>
