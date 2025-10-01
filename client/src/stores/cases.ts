import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { Case, CreateCaseRequest, CaseFilters } from '../types'

export const useCasesStore = defineStore('cases', () => {
  const cases = ref<Case[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const fetchCases = async (filters: CaseFilters = {}): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams(filters as Record<string, string>)
      const response = await axios.get<Case[]>(`/api/cases?${params}`)
      cases.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch cases'
    } finally {
      loading.value = false
    }
  }
  
  const createCase = async (caseData: CreateCaseRequest): Promise<{ success: boolean; case?: Case; error?: string }> => {
    try {
      const response = await axios.post<Case>('/api/cases', caseData)
      cases.value.unshift(response.data)
      return { success: true, case: response.data }
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to create case' 
      }
    }
  }
  
  const updateCaseStatus = async (caseId: string, status: Case['status'], agentId: string): Promise<{ success: boolean; case?: Case; error?: string }> => {
    try {
      const response = await axios.patch<Case>(`/api/cases/${caseId}/status`, {
        status,
        agentId
      })
      const index = cases.value.findIndex(c => c.id === caseId)
      if (index !== -1) {
        cases.value[index] = response.data
      }
      return { success: true, case: response.data }
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to update case status' 
      }
    }
  }
  
  const assignCase = async (caseId: string, agentId: string): Promise<{ success: boolean; case?: Case; error?: string }> => {
    try {
      const response = await axios.patch<Case>(`/api/cases/${caseId}/assign`, {
        agentId
      })
      const index = cases.value.findIndex(c => c.id === caseId)
      if (index !== -1) {
        cases.value[index] = response.data
      }
      return { success: true, case: response.data }
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to assign case' 
      }
    }
  }
  
  const addNote = async (caseId: string, content: string, agentId: string): Promise<{ success: boolean; case?: Case; error?: string }> => {
    try {
      const response = await axios.patch<Case>(`/api/cases/${caseId}/notes`, {
        content,
        agentId
      })
      const index = cases.value.findIndex(c => c.id === caseId)
      if (index !== -1) {
        cases.value[index] = response.data
      }
      return { success: true, case: response.data }
    } catch (err: any) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to add note' 
      }
    }
  }
  
  return {
    cases,
    loading,
    error,
    fetchCases,
    createCase,
    updateCaseStatus,
    assignCase,
    addNote
  }
})