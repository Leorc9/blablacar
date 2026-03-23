import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/create-ride',
    name: 'create-ride',
    component: () => import('@/views/CreateRide.vue')
  },
  {
    path: '/search-rides',
    name: 'search-rides',
    component: () => import('@/views/SearchRides.vue')
  },
  {
    path: '/ride/:id',
    name: 'ride-detail',
    component: () => import('@/views/RideDetail.vue')
  },
  {
    path: '/my-rides',
    name: 'my-rides',
    component: () => import('@/views/MyRides.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
