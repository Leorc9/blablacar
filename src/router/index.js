import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import CreateRide from '@/views/CreateRide.vue'
import SearchRides from '@/views/SearchRides.vue'
import RideDetail from '@/views/RideDetail.vue'
import MyRides from '@/views/MyRides.vue'
import BookedRides from '@/views/BookedRides.vue'
import Profile from '@/views/Profile.vue'

const routes = [
  { 
    path: '/', 
    component: Home 
  },
  { 
    path: '/login', 
    component: Login 
  },
  { 
    path: '/register', 
    component: Register 
  },
  { 
    path: '/search-rides', 
    component: SearchRides 
  },
  { 
    path: '/ride/:id', 
    component: RideDetail 
  },
  { 
    path: '/create-ride', 
    component: CreateRide,
    meta: { requiresAuth: true }
  },
  { 
    path: '/my-rides', 
    component: MyRides,
    meta: { requiresAuth: true }
  },
  { 
    path: '/booked-rides', 
    component: BookedRides,
    meta: { requiresAuth: true }
  },
  { 
    path: '/profile', 
    component: Profile,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.currentUser) {
    next('/login')
  } else {
    next()
  }
})

export default router
