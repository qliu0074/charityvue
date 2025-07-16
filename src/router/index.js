import { createRouter, createWebHistory } from 'vue-router'
import AdminDashboard from '../views/AdminDashboard.vue'

import FindCharity from '../views/FindCharity.vue'
import FeedbackPage from '../views/FeedbackPage.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import MapFirst from '../components/mapFirst.vue'
import HomePage from '../views/HomePage.vue'

const routes = [
  { path: '/', name: 'HomePage', component: HomePage },
  { path: '/AdminDashboard',name: 'AdminDashboard',component: AdminDashboard},
  { path: '/HomePage', name: 'HomePage', component: HomePage },
  { path: '/FindPage', name: 'FindPage', component: FindCharity },
  { path: '/FeedbackPage', name: 'FeedbackPage', component: FeedbackPage },
  { path: '/FirebaseSigninView', name: 'FirebaseSigninView', component: FirebaseSigninView },
  { path: '/mapFirst', name: 'Map', component: MapFirst },
  { path: '/AdminDashboard', name: 'AdminDashboard', component: AdminDashboard },
  { path: '/FirebaseRegisterView', name: 'FirebaseRegisterView', component: FirebaseRegisterView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
