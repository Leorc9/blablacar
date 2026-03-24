import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import CreateRide from '@/views/CreateRide.vue'
import SearchRides from '@/views/SearchRides.vue'
import RideDetail from '@/views/RideDetail.vue'
import MyRides from '@/views/MyRides.vue'
import Profile from '@/views/Profile.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/create-ride', component: CreateRide },
  { path: '/search-rides', component: SearchRides },
  { path: '/ride/:id', component: RideDetail },
  { path: '/my-rides', component: MyRides },
  { path: '/profile', component: Profile }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
