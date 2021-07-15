<template>
  <a name="comments" id="comments" class="anchor"></a>
  <h5 class="mb-3" v-text="`Comments (${pagination.TotalCount || 0})`"></h5>
  <div class="text-muted" v-if="pagination.TotalCount === 0">No comments yet.</div>
  <transition-group v-bind:name="listTransitionName" tag="div" class="list-group mb-5">
    <div class="list-group-item py-3"
      v-bind:key="comment.Id"
      v-for="comment in comments">
      <div class="d-flex w-100 align-items-start justify-content-between">
        <div class="col-10" v-bind:class="{ more: showMore[comment.Id] }">
          <div class="d-sm-flex mb-2 align-items-center">
            <strong v-text="getUser(comment, 'Name')"></strong>
            <small class="ms-3" v-tooltip
              v-bind:title="formatTime(comment.CreatedAt)"
              v-text="timeago(comment.CreatedAt)"></small>
            <small class="ms-3 text-muted fst-italic" v-tooltip
              v-bind:title="formatTime(comment.UpdatedAt)"
              v-if="isEdited(comment)">(edited)</small>
            <a href class="ms-auto small d-block"
              v-if="comment.UserId === currentUser.Id"
              v-on:click.prevent="edit(comment)">
              <faicon icon="edit" />
              <span class="ms-2" v-if="editingComment && editingComment.Id === comment.Id">editing</span>
            </a>
          </div>
          <div class="small comment-body text-break"
            v-body
            v-text="comment.Body"></div>
          <div class="show-more">
            <a href class="small"
              v-on:click.prevent="showMore[comment.Id] = true">show more</a>
          </div>
        </div>
        <CommentAction v-on:delete="toRemove(comment.Id)" v-bind:loading="loading" />
      </div>
    </div>
  </transition-group>
  <Pagination hash="#comments" v-if="pagination.TotalPages > 1" v-bind:pagination="pagination" />
  <h5 class="mb-3" v-if="editingComment">Edit comment</h5>
  <h5 class="mb-3" v-else>Add a comment</h5>
  <form class="mb-5" v-on:submit.prevent="submit">
    <div class="col-10 mb-3">
      <textarea class="form-control" rows="5"
        v-on:keydown.enter="keySubmit"
        ref="Body" v-model="commentBody"></textarea>
    </div>
    <div class="d-flex align-items-center">
      <button type="submit" v-bind:disabled="loading" class="btn btn-primary">Submit</button>
      <a class="ms-4" href v-if="editingComment"
        v-on:click.prevent="editingComment = null">Cancel</a>
    </div>
  </form>
</template>

<script>
import http from '../http'
import Pagination from '../components/pagination.vue'
import * as timeago from 'timeago.js'
import { Tooltip } from 'bootstrap'
import CommentAction from './comment-action.vue'

const observer = (() => {
  if (window.ResizeObserver) {
    return new window.ResizeObserver(entries => {
      for (let entry of entries) {
        let truncated = entry.target.scrollHeight - entry.contentRect.height > 1
        entry.target.classList[truncated ? 'add' : 'remove']('truncated')
      }
    })
  }
  return null
})()

export default {
  props: {
    commentsResponse: Object,
    appId: Number,
    problemId: Number
  },
  components: {
    CommentAction,
    Pagination
  },
  directives: {
    tooltip: {
      mounted (el) {
        new Tooltip(el, { animation: false })
      }
    },
    body: {
      mounted (el) {
        if (observer) observer.observe(el)
      }
    }
  },
  data () {
    return {
      loading: false,
      editingComment: null,
      listTransitionName: null,
      showMore: {},
      newCommentBody: null
    }
  },
  computed: {
    comments ()   { return this.commentsResponse.Comments || []   },
    pagination () { return this.commentsResponse.Pagination || {} },
    users ()      { return this.commentsResponse.Users || {}      },
    commentBody: {
      get () {
        if (this.editingComment) {
          return this.editingComment.Body
        }
        return this.newCommentBody
      },
      set (val) {
        if (this.editingComment) {
          this.editingComment.Body = val
          return
        }
        this.newCommentBody = val
      }
    }
  },
  methods: {
    timeago (time) {
      return timeago.format(time)
    },
    getUser (comment, key) {
      if (comment && comment.UserId) {
        let user = this.users.find(u => u.Id === comment.UserId)
        if (user && key) return user[key]
        return user
      }
      return null
    },
    reload () {
      if (this.commentsResponse.$$reload) {
        this.loading = true
        this.commentsResponse.$$reload().then(res => {
          this.loading = false
          for (let key in res.data) {
            this.commentsResponse[key] = res.data[key]
          }
        }, () => {
          this.loading = false
        })
        return
      }
      const current = this.$route
      this.$router.replace({
        name: 'RouteBlank'
      }).then(() => {
        this.$router.replace(current)
      })
    },
    isEdited (comment) {
      return new Date(comment.UpdatedAt) - new Date(comment.CreatedAt) > 1000
    },
    edit (comment) {
      this.editingComment = JSON.parse(JSON.stringify(comment))
      this.$refs.Body.focus()
    },
    keySubmit (e) {
      if (e.metaKey || e.ctrlKey) {
        this.submit()
      }
    },
    submit () {
      if (this.loading) return
      this.loading = true
      this.processErrors()
      let Body = this.commentBody
      if (typeof(Body) === 'string') {
        Body = Body.trim()
      }
      let method = null
      let url = null
      if (this.editingComment) {
        method = 'put'
        url = `/apps/${this.appId}/problems/${this.problemId}/comments/${this.editingComment.Id}`
      } else {
        method = 'post'
        url = `/apps/${this.appId}/problems/${this.problemId}/comments`
      }
      http[method](url, { Body }).then(() => {
        this.loading = false
        this.$toast().success(this.editingComment ? 'Successfully updated comment' : 'Successfully added comment')
        this.editingComment = null
        this.commentBody = null
        this.reload()
      }, (e) => {
        this.loading = false
        if (!this.processErrors(e)) {
          if (!e || !e.toastShown) {
            this.$toast().error(this.editingComment ? 'Error updating comment' : 'Error adding comment')
          }
        }
      })
    },
    toRemove (commentId) {
      this.listTransitionName = 'destroy'
      let url = `/apps/${this.appId}/problems/${this.problemId}/comments/${commentId}`
      this.loading = true
      http.delete(url).then(res => {
        this.loading = false
        this.$toast().success('Successfully deleted comment')
        this.remove(commentId)
      }, (e) => {
        this.loading = false
        if (!e || !e.toastShown) {
          this.$toast().error('Failed to delete comment')
        }
        this.remove()
      })

    },
    remove (id) {
      for (let i = this.comments.length - 1; i > -1; i--) {
        if (this.comments[i].Id === id) {
          this.comments.splice(i, 1)
          this.pagination.TotalCount -= 1
        }
      }
      setTimeout(() => { // wait for animation
        this.listTransitionName = null
      }, 400)
    }
  }
}
</script>

<style scoped>
.anchor {
  display: block;
  position: relative;
  top: -80px;
  visibility: hidden;
}

.destroy-leave-active {
  transition: all 300ms ease;
}

.destroy-leave-to {
  opacity: 0;
  transform: scaleY(0);
  transform-origin: center top;
}

.comment-body {
  white-space: pre-wrap;
  display: -webkit-box;
  -webkit-line-clamp: 10;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.more .comment-body {
  -webkit-line-clamp: unset;
}

.show-more {
  display: none;
}

.truncated + .show-more {
  display: block;
}
</style>
