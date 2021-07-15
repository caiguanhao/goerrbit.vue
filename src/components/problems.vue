<template>
  <div class="d-flex justify-content-center mb-3" v-if="hasUndo">
    <span class="bg-dark text-white py-2 px-3 rounded-3">
      <span v-text="`${updated.ids.length} problems marked as ${updated.type === 'resolved' ? 'resolved' : 'unresolved'}.`"></span>
      <a href class="ms-3 text-white" v-on:click.prevent="undo">Undo</a>
    </span>
  </div>
  <template v-if="hasNoProblems">
    <h5 class="mb-0 text-muted" v-if="isSearch">No errors matched your query</h5>
    <template v-else><slot /></template>
  </template>
  <template v-else>
  <div class="btn-group btn-group-sm">
    <button type="button" class="btn btn-secondary"
      v-on:click.prevent="selections.show = !selections.show"
      v-text="selections.show ? 'Selection: ON' : 'Selection: OFF'"></button>
    <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split"
      data-bs-toggle="dropdown" data-bs-reference="parent">
      <span class="visually-hidden">Toggle Dropdown</span>
    </button>
    <ul class="dropdown-menu">
      <li>
        <a class="dropdown-item" href
          v-on:click.prevent="selectAll()">Select All On This Page</a>
      </li>
      <li><hr class="dropdown-divider"></li>
      <li class="d-flex justify-content-between">
        <h6 class="dropdown-header" v-text="`SELECTED: ${selections.problemIds.length}`"></h6>
        <a class="small h6 mb-0 py-2 pe-3" href
          v-if="selections.problemIds.length"
          v-on:click.prevent="clear()">Clear</a>
      </li>
      <li v-if="showingResolved">
        <a class="dropdown-item" href
          v-bind:class="{ disabled: !selections.problemIds.length }"
          v-on:click.prevent="setAsUnresolved()">Mark As Unresolved</a>
      </li>
      <li v-else>
        <a class="dropdown-item" href
          v-bind:class="{ disabled: !selections.problemIds.length }"
          v-on:click.prevent="setAsResolved()">Mark As Resolved</a>
      </li>
      <li>
        <a class="dropdown-item" href
          v-bind:class="selections.problemIds.length ? 'text-danger' : 'disabled'"
          v-on:click.prevent="merge()">Merge</a>
      </li>
      <li>
        <a class="dropdown-item" href
          v-bind:class="selections.problemIds.length ? 'text-danger' : 'disabled'"
          v-on:click.prevent="unmerge()">Unmerge</a>
      </li>
      <li>
        <a class="dropdown-item" href
          v-bind:class="selections.problemIds.length ? 'text-danger' : 'disabled'"
          v-on:click.prevent="remove()">Delete</a>
      </li>
    </ul>
  </div>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th width="1%" v-if="selections.show"></th>
          <th width="18%">
            <div v-if="apps">APP</div>
            <div v-else>ENV</div>
          </th>
          <th>
            <SortButton sort="message" defaultOrder="asc"
              v-bind:pagination="pagination">WHAT / WHERE</SortButton>
          </th>
          <th width="15%">
            <SortButton sort="last_notice_at" v-bind:pagination="pagination">LATEST</SortButton>
          </th>
          <th width="10%">
            <SortButton sort="notices_count" v-bind:pagination="pagination">COUNT</SortButton>
          </th>
          <th width="10%">RESOLVE</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="problem in problems" class="clickable-row"
          v-bind:class="{ highlighted: lastProblemId === problem.Id,
                          resolved: !showingResolved && !!problem.ResolvedAt }">
          <td v-if="selections.show">
            <input type="checkbox" class="clickable-row-target shift-key-select"
              v-model="selections.problemIds" v-bind:value="problem.Id" />
          </td>
          <td>
            <div class="d-flex align-items-end" v-if="apps">
              <router-link v-bind:to="{ name: 'RouteAppsShow', params: { id: problem.AppId } }"
                class="app-name" v-text="appNames[problem.AppId]">
              </router-link>
              <small class="ms-1">
                <router-link v-bind:to="{ query: { environment: problem.Environment } }"
                  class="small" v-text="problem.Environment">
                </router-link>
              </small>
            </div>
            <div v-else>
              <router-link v-bind:to="{ query: { environment: problem.Environment } }"
                v-text="problem.Environment">
              </router-link>
            </div>
          </td>
          <td>
            <router-link v-bind:to="{ name: 'RouteProblemsShow', params: { id: problem.AppId, pid: problem.Id } }"
              class="clickable-row-target message text-break" v-text="problem.Message || '(empty)'"></router-link>
            <div class="small fst-italic text-muted" v-if="problem.Location" v-text="problem.Location"></div>
            <router-link v-bind:to="{ name: 'RouteProblemsShow', params: { id: problem.AppId, pid: problem.Id }, hash: '#comments' }"
              class="comment-btn" v-if="commentFor(problem.Id)">
              <strong v-text="commentFor(problem.Id).UserName + ':'"></strong>
              <span class="ms-2" v-text="commentFor(problem.Id).Body"></span>
            </router-link>
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
            <small v-else class="text-success fst-italic">(resolved)</small>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Pagination v-if="pagination.TotalPages > 1" v-bind:pagination="pagination" />
  </template>
</template>

<script>
import * as timeago from 'timeago.js'
import SortButton from './sort-button.vue'
import Pagination from './pagination.vue'
import http from '../http'
import { reactive, watch } from 'vue'

let show = window.sessionStorage ? window.sessionStorage.getItem('selections.show') === '1' : false

const selections = reactive({
  show,
  problemIds: []
})

watch(() => selections.show, (val) => {
  if (!window.sessionStorage) return
  if (val) {
    window.sessionStorage.setItem('selections.show', '1')
  } else {
    window.sessionStorage.removeItem('selections.show')
  }
})

export default {
  props: {
    response: Object,
    showingResolved: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'reload'
  ],
  components: {
    Pagination,
    SortButton
  },
  data () {
    return {
      lastProblemId: null,
      updated: {
        ids: [],
        type: null
      },
      toUpdate: {
        ids: [],
        type: null
      },
      selections
    }
  },
  watch: {
    problems () {
      this.lastProblemId = window.lastProblemId
      window.lastProblemId = null

      let ids = this.problems.map(p => p.Id)
      let allOK = selections.problemIds.every(id => ids.indexOf(id) > -1)
      if (!allOK) {
        selections.problemIds = []
      }

      this.updated.ids = this.toUpdate.ids
      this.updated.type = this.toUpdate.type
      this.toUpdate.ids = []
      this.toUpdate.type = null
    }
  },
  computed: {
    apps ()       { return this.response.Apps || []       },
    comments ()   { return this.response.Comments || []   },
    problems ()   { return this.response.Problems || []   },
    pagination () { return this.response.Pagination || {} },
    appNames () {
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
    },
    hasUndo () {
      if (!this.updated) return false
      let type = this.updated.type
      let ids = this.updated.ids
      if (!type || !ids || !ids.length) return false
      if (type === 'resolved' || type === 'unresolved') {
        return true
      }
      return false
    }
  },
  methods: {
    commentFor (problemId) {
      return this.comments.find(c => c.ProblemId === problemId)
    },
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
      }, (error) => {
        if (!error || !error.toastShown) {
          this.$toast().error('Error resolving issue')
        }
      })
    },
    selectAll () {
      selections.show = true
      selections.problemIds = this.problems.map(p => p.Id)
    },
    clear () {
      selections.show = true
      selections.problemIds = []
    },
    setAsResolved (ids = null, fromUndo = false) {
      http.post('/problems/resolve', {
        ids: ids || selections.problemIds
      }).then(res => {
        this.$emit('reload')
        if (fromUndo) {
          this.toUpdate.ids = []
          this.toUpdate.type = null
        } else {
          this.toUpdate.ids = res.data.Changed
          this.toUpdate.type = 'resolved'
        }
      }, (error) => {
        if (!error || !error.toastShown) {
          this.$toast().error('Error resolving issues')
        }
      })
    },
    setAsUnresolved (ids = null, fromUndo = false) {
      http.post('/problems/unresolve', {
        ids: ids || selections.problemIds
      }).then(res => {
        this.$emit('reload')
        if (fromUndo) {
          this.toUpdate.ids = []
          this.toUpdate.type = null
        } else {
          this.toUpdate.ids = res.data.Changed
          this.toUpdate.type = 'unresolved'
        }
      }, (error) => {
        if (!error || !error.toastShown) {
          this.$toast().error('Error unresolving issues')
        }
      })
    },
    undo () {
      if (!this.hasUndo) return
      let type = this.updated.type
      let ids = this.updated.ids
      if (type === 'resolved') {
        this.setAsUnresolved(ids, true)
      } else if (type === 'unresolved') {
        this.setAsResolved(ids, true)
      } else {
        this.$toast().error('Error')
      }
    },
    merge () {
      if (!window.confirm('Merge selected issues?')) return
      http.post('/problems/merge', {
        ids: selections.problemIds
      }).then(res => {
        this.$emit('reload')
        this.$toast().success('Successfully merged issues')
      }, (error) => {
        if (!error || !error.toastShown) {
          this.$toast().error('Error merging issues')
        }
      })
    },
    unmerge () {
      if (!window.confirm('Unmerge selected issues?')) return
      http.post('/problems/unmerge', {
        ids: selections.problemIds
      }).then(res => {
        selections.problemIds = []
        this.$emit('reload')
        this.$toast().success('Successfully unmerged issues')
      }, (error) => {
        if (!error || !error.toastShown) {
          this.$toast().error('Error unmerging issues')
        }
      })
    },
    remove () {
      if (!window.confirm('Permanently delete selected issues? This action CANNOT be undone.')) return
      http.delete('/problems', {
        data: {
          ids: selections.problemIds
        }
      }).then(res => {
        this.$emit('reload')
        this.$toast().success('Successfully deleted issues')
      }, (error) => {
        if (!error || !error.toastShown) {
          this.$toast().error('Error deleting issues')
        }
      })
    }
  }
}
</script>

<style scoped>
.resolved {
  opacity: 0.5;
}

.app-name {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 100%;
  width: 0;
  min-width: 100%;
}

.comment-btn {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 3px 6px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #f9f9f9;
  font-size: 12px;
  color: #000;
  text-decoration: none;
  margin: 10px 0 0;
  max-width: 400px;
}

.comment-btn:hover {
  background: #ddd;
}
</style>
