import axios from 'axios'
import { useToast } from 'vue-toastification'
import { ref } from 'vue'

const apiVersion = ref(null)

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
  if (res.headers && res.headers['x-goerrbit-version']) {
    apiVersion.value = res.headers['x-goerrbit-version']
  }
  return res
}, error => {
  if (error && error.response) {
    let res = error.response
    if (res.status === 403) {
      useToast().error('No permission')
      error.toastShown = true
    }
    if (res.headers && res.headers['x-goerrbit-version']) {
      apiVersion.value = res.headers['x-goerrbit-version']
    }
  }
  return Promise.reject(error)
})

http.apiVersion = apiVersion

export default http
