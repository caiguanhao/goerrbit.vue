<template>
  <router-link v-bind:to="to">
    <slot />
    <faicon class="ms-1" v-if="isCurrent" v-bind:icon="isASC ? 'caret-up' : 'caret-down'" />
  </router-link>
</template>

<script>
export default {
  props: {
    sort: String,
    defaultOrder: String,
    pagination: Object
  },
  computed: {
    isCurrent () {
      return this.pagination.Sort === this.sort
    },
    isASC () {
      return this.pagination.Order === 'asc'
    },
    to () {
      let query = JSON.parse(JSON.stringify(this.$route.query))
      if (this.isCurrent) {
        query.order = this.isASC ? 'desc' : 'asc'
      } else {
        if (this.defaultOrder) query.order = this.defaultOrder
      }
      query.sort = this.sort
      return { query }
    }
  }
}
</script>
