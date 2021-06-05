import axios from 'axios'
import { useToast } from 'vue-toastification'

const http = axios.create({
  baseURL: '/api/admin',
  withCredentials: true,
  timeout: 3000
})

http.interceptors.request.use(config => {
  if (config.withCredentials) {
    let token = null
    if (!token && window.sessionStorage) {
      token = window.sessionStorage.getItem('token')
    }
    if (!token && window.localStorage) {
      token = window.localStorage.getItem('token')
    }
    if (token) {
      config.headers.Authorization = token
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

http.interceptors.response.use(res => {
  return res
}, error => {
  if (error && error.response && error.response.status === 403) {
    useToast().error('No permission')
    error.toastShown = true
  }
  return Promise.reject(error)
})


export default http
