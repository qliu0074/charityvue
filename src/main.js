import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import db from './firebase/init'
import PrimeVue from 'primevue/config'
import 'bootstrap/dist/css/bootstrap.min.css'
import ToastService from 'primevue/toastservice'
import MultiSelect from 'primevue/multiselect'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Rating from 'primevue/rating'
import Toast from 'primevue/toast'
import Chart from 'primevue/chart'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)
app.component('MultiSelect', MultiSelect)
app.component('InputText', InputText)
app.component('AppToast', Toast)
app.component('AppButton', Button)
app.use(router)
app.use(ToastService)
app.component('appRating', Rating)
app.component('appToast', Toast)
app.component('appChart', Chart)
app.config.globalProperties.$db = db
app.use(PrimeVue)
app.mount('#app')
