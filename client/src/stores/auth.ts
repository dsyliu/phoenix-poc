import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import router from '../router'
import type { Agent, LoginRequest, LoginResponse } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const agent = ref<Agent | null>(null)
  
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
  
  const canResolveCases = computed(() => 
    agent.value?.role === 'investigator' || agent.value?.role === 'validator'
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
  
  const login = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await axios.post<LoginResponse>('/api/auth/login', { email } as LoginRequest)
      agent.value = response.data.agent
      localStorage.setItem('agent', JSON.stringify(response.data.agent))
      router.push('/dashboard')
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      }
    }
  }
  
  const logout = (): void => {
    agent.value = null
    localStorage.removeItem('agent')
    router.push('/login')
  }
  
  const initializeAuth = (): void => {
    const savedAgent = localStorage.getItem('agent')
    if (savedAgent) {
      agent.value = JSON.parse(savedAgent) as Agent
    }
  }
  
  return {
    agent,
    isAuthenticated,
    canCreateCases,
    canInvestigate,
    canCloseCases,
    canResolveCases,
    isAdmin,
    canManageConfigurations,
    hasReadOnlyAccess,
    login,
    logout,
    initializeAuth
  }
})