<template>
  <ul class="pagination justify-content-center">
    <li class="page-item" v-bind:class="{ disabled: !pagination.PrevPage }">
      <router-link v-if="pagination.PrevPage" class="page-link"
        v-bind:to="{ hash, query: queryForPage(pagination.PrevPage) }">Previous</router-link>
      <span class="page-link" v-else>Previous</span>
    </li>
    <li class="page-item"
      v-for="page in pages"
      v-bind:class="{
        active: page === pagination.CurrentPage,
        disabled: isNaN(page)
      }">
      <span class="page-link" v-if="isNaN(page)" v-text="page"></span>
      <router-link class="page-link" v-else
        v-bind:to="{ hash, query: queryForPage(page) }"
        v-text="page"></router-link>
    </li>
    <li class="page-item" v-bind:class="{ disabled: !pagination.NextPage }">
      <router-link v-if="pagination.NextPage" class="page-link"
        v-bind:to="{ hash, query: queryForPage(pagination.NextPage) }">Next</router-link>
      <span class="page-link" v-else>Next</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    pagination: Object,
    hash: String
  },
  computed: {
    pages () {
      if (this.pagination.TotalPages < 6) {
        return this.pagination.TotalPages
      }
      let pages = [ 1, 2, 3 ]
      let cp = this.pagination.CurrentPage
      let tp = this.pagination.TotalPages
      let hasCurrent = false
      if (cp > 3 && cp <= tp - 3) {
        if (cp - pages[pages.length - 1] > 1) pages.push('…')
        pages.push(cp)
        hasCurrent = true
      }
      for (let i = 3; i > 0; i--) {
        let p = tp - (i - 1)
        if (i === 3) {
          if (!hasCurrent && (p - pages[pages.length - 1] === 2)) {
            pages.push(p - 1)
          } else if (p - pages[pages.length - 1] > 1) {
            pages.push('…')
          }
        }
        pages.push(p)
      }
      return pages
    }
  },
  methods: {
    queryForPage (page) {
      let q = Object.assign({}, this.$route.query, { page })
      if (page === 1) delete(q.page)
      return q
    }
  }
}
</script>

<style>
</style>
