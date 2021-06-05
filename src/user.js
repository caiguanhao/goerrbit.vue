import http from './http'
import { reactive } from 'vue'

const currentUser = reactive({})

export default {
  computed: {
    currentUser () {
      if (!currentUser.Id) return null
      return currentUser
    }
  },
  methods: {
    getCurrentUser () {
      return http.get('/users/me').then(res => {
        for (let key in currentUser) {
          delete(currentUser[key])
        }
        for (let key in res.data.User) {
          currentUser[key] = res.data.User[key]
        }
      }, () => {
        for (let key in currentUser) {
          delete(currentUser[key])
        }
      })
    }
  }
}
