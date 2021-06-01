import { createApp } from 'vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.vue'
import router from './routes'
import utils from './utils'

const app = createApp(App)
app.use(router)
app.mixin(utils)
app.mount('body')
