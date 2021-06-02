import { createApp } from 'vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Toast, { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import router from './routes'
import i18n from './i18n'
import utils from './utils'

const app = createApp(App)
app.use(router)
app.use(Toast).mixin({ methods: { $toast: useToast } })
app.mixin(i18n)
app.mixin(utils)
app.mount('body')
