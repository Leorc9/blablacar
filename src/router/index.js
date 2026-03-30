import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const Home = () => import('@/views/Home.vue')
const Login = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')
const SearchRides = () => import('@/views/SearchRides.vue')
const RideDetail = () => import('@/views/RideDetail.vue')
const CreateRide = () => import('@/views/CreateRide.vue')
const MyRides = () => import('@/views/MyRides.vue')
const BookedRides = () => import('@/views/BookedRides.vue')
const Profile = () => import('@/views/Profile.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/search-rides', component: SearchRides },
    { path: '/ride/:id', component: RideDetail },
    { path: '/create-ride', component: CreateRide, meta: { requiresAuth: true } },
    { path: '/my-rides', component: MyRides, meta: { requiresAuth: true } },
    { path: '/booked-rides', component: BookedRides, meta: { requiresAuth: true } },
    { path: '/profile', component: Profile, meta: { requiresAuth: true } }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.currentUser) {
    next('/login')
    return
  }

  next()
})

export default router
