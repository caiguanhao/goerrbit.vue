import axios from 'axios'

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
  Promise.reject(error)
})

export default http
