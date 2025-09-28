import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Cases from '../views/Cases.vue'
import CreateCase from '../views/CreateCase.vue'
import CaseDetail from '../views/CaseDetail.vue'
import AdminPanel from '../views/AdminPanel.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/cases',
    name: 'Cases',
    component: Cases,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-case',
    name: 'CreateCase',
    component: CreateCase,
    meta: { requiresAuth: true, requiresRole: 'frontline' }
  },
  {
    path: '/cases/:id',
    name: 'CaseDetail',
    component: CaseDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { requiresAuth: true, requiresRole: 'admin' }
  },
  {
    path: '/',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresRole && authStore.agent.role !== to.meta.requiresRole) {
    next('/dashboard')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router