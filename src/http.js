import axios from 'axios'

const http = axios.create({
  baseURL: '/api/admin',
  withCredentials: true,
  timeout: 3000
})

export default http
