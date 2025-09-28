import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  const agent = ref(null)
  
  const isAuthenticated = computed(() => !!agent.value)
  
  const canCreateCases = computed(() => 
    agent.value?.role === 'frontline'
  )
  
  const canInvestigate = computed(() => 
    agent.value?.role === 'investigator' || agent.value?.role === 'validator'
  )
  
  const canCloseCases = computed(() => 
    agent.value?.role === 'validator'
  )
  
  const isAdmin = computed(() => 
    agent.value?.role === 'admin'
  )
  
  const canManageConfigurations = computed(() => 
    agent.value?.role === 'admin'
  )
  
  const hasReadOnlyAccess = computed(() => 
    agent.value?.role === 'admin'
  )
  
  const login = async (email) => {
    try {
      const response = await axios.post('/api/auth/login', { email })
      agent.value = response.data.agent
      localStorage.setItem('agent', JSON.stringify(response.data.agent))
      router.push('/dashboard')
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      }
    }
  }
  
  const logout = () => {
    agent.value = null
    localStorage.removeItem('agent')
    router.push('/login')
  }
  
  const initializeAuth = () => {
    const savedAgent = localStorage.getItem('agent')
    if (savedAgent) {
      agent.value = JSON.parse(savedAgent)
    }
  }
  
  return {
    agent,
    isAuthenticated,
    canCreateCases,
    canInvestigate,
    canCloseCases,
    isAdmin,
    canManageConfigurations,
    hasReadOnlyAccess,
    login,
    logout,
    initializeAuth
  }
})