<template>
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
          <th width="200">COUNT</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="problem in problems" class="clickable-row"
          v-bind:class="{ highlighted: lastProblemId === problem.Id }">
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
        </tr>
      </tbody>
    </table>
  </div>
  <Pagination v-bind:pagination="pagination" />
</template>

<script>
import * as timeago from 'timeago.js'
import Pagination from '../components/pagination.vue'

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
    }
  },
  methods: {
    timeago (time) {
      return timeago.format(time)
    },
    appName (appId) {
    }
  },
  created () {
    this.lastProblemId = window.lastProblemId
    window.lastProblemId = null
    window.lastAppId = null
  },
}
</script>
