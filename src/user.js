import http from './http'

export default {
  data () {
    return {
      currentUser: null
    }
  },
  methods: {
    getCurrentUser () {
      return http.get('/users/me').then(res => {
        this.currentUser = res.data.User
      }, () => {
        this.currentUser = null
      })
    }
  }
}
