import { createApp } from 'vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Toast, { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import router from './routes'
import i18n from './i18n'
import user from './user'
import utils from './utils'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faThumbsUp, faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
library.add(
  faThumbsUp, faCheckCircle
)
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const app = createApp(App)
app.use(router)
app.use(Toast).mixin({ methods: { $toast: useToast } })
app.mixin(i18n)
app.mixin(user)
app.mixin(utils)
app.component('faicon', FontAwesomeIcon)
const vm = app.mount('body')
router.setVM(vm)
