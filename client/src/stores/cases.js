import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useCasesStore = defineStore('cases', () => {
  const cases = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  const fetchCases = async (filters = {}) => {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams(filters)
      const response = await axios.get(`/api/cases?${params}`)
      cases.value = response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to fetch cases'
    } finally {
      loading.value = false
    }
  }
  
  const createCase = async (caseData) => {
    try {
      const response = await axios.post('/api/cases', caseData)
      cases.value.unshift(response.data)
      return { success: true, case: response.data }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to create case' 
      }
    }
  }
  
  const updateCaseStatus = async (caseId, status, agentId) => {
    try {
      const response = await axios.patch(`/api/cases/${caseId}/status`, {
        status,
        agentId
      })
      const index = cases.value.findIndex(c => c.id === caseId)
      if (index !== -1) {
        cases.value[index] = response.data
      }
      return { success: true, case: response.data }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to update case status' 
      }
    }
  }
  
  const assignCase = async (caseId, agentId) => {
    try {
      const response = await axios.patch(`/api/cases/${caseId}/assign`, {
        agentId
      })
      const index = cases.value.findIndex(c => c.id === caseId)
      if (index !== -1) {
        cases.value[index] = response.data
      }
      return { success: true, case: response.data }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to assign case' 
      }
    }
  }
  
  const addNote = async (caseId, content, agentId) => {
    try {
      const response = await axios.post(`/api/cases/${caseId}/notes`, {
        content,
        agentId
      })
      const index = cases.value.findIndex(c => c.id === caseId)
      if (index !== -1) {
        cases.value[index] = response.data
      }
      return { success: true, case: response.data }
    } catch (err) {
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