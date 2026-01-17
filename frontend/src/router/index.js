import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'

import AppLayout from '../components/layouts/AppLayout.vue'

import PlantsView from '../views/home/PlantsView.vue'
import DashboardView from '../views/home/DashboardView.vue'
import CareLogsView from '../views/home/CareLogsView.vue'
import NeedsWaterView from '../views/home/NeedWaterView.vue'
import LocationsView from '../views/home/LocationsView.vue'
import ProfileView from '@/views/profile/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: LandingView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    

    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        { path: 'dashboard', name: 'dashboard', meta: { title: 'Dashboard' }, component: DashboardView },
        { path: 'plants', name: 'plants',  meta: { title: 'My plants' }, component: PlantsView },
        { path: 'care-logs', name: 'care-logs', meta: { title: 'Care Logs' }, component: CareLogsView },
        { path: 'needs-water', name: 'needs-water', meta: { title: 'Needs Water' }, component: NeedsWaterView },
        { path: 'locations', name: 'locations', meta: { title: 'Locations' }, component: LocationsView },
        { path: 'profile', component: ProfileView, meta: { title: 'Profile' } ,component: ProfileView },

      ],
    },


    { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
