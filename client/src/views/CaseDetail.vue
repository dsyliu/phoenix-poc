<template>
  <div class="case-detail">
    <div v-if="loading" class="loading">Loading case...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="caseData" class="case-content">
      
      <div class="case-header">
        <div class="case-title">
          <h1>{{ caseData.title }}</h1>
          <span :class="['status', caseData.status]">{{ caseData.status }}</span>
        </div>
        <div class="case-actions">
          <select 
            v-if="authStore.canInvestigate || authStore.canCloseCases"
            v-model="newStatus" 
            @change="updateStatus"
            class="status-select"
          >
            <option value="">Change Status</option>
            <option value="investigating" v-if="caseData.status === 'open'">
              Start Investigation
            </option>
            <option value="resolved" v-if="caseData.status === 'investigating'">
              Mark as Resolved
            </option>
            <option value="closed" v-if="caseData.status === 'resolved' && authStore.canCloseCases">
              Close Case
            </option>
          </select>
        </div>
      </div>
      
      <div class="case-info">
        <div class="info-section">
          <h3>Case Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Priority:</label>
              <span :class="['priority', caseData.priority]">{{ caseData.priority }}</span>
            </div>
            <div class="info-item">
              <label>Category:</label>
              <span>{{ caseData.category }}</span>
            </div>
            <div class="info-item">
              <label>Created:</label>
              <span>{{ formatDate(caseData.createdAt) }}</span>
            </div>
            <div class="info-item">
              <label>Last Updated:</label>
              <span>{{ formatDate(caseData.updatedAt) }}</span>
            </div>
            <div class="info-item" v-if="caseData.assignedTo">
              <label>Assigned To:</label>
              <span class="assigned-agent">{{ getAssignedAgentName(caseData.assignedTo) }}</span>
            </div>
          </div>
        </div>
        
        <div class="info-section">
          <h3>Customer Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Name:</label>
              <span>{{ caseData.customerName }}</span>
            </div>
            <div class="info-item">
              <label>Email:</label>
              <span>{{ caseData.customerEmail }}</span>
            </div>
            <div class="info-item" v-if="caseData.customerId">
              <label>Customer ID:</label>
              <span>{{ caseData.customerId }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="case-description">
        <h3>Description</h3>
        <p>{{ caseData.description }}</p>
      </div>
      
      <div class="case-notes">
        <h3>Notes & Updates</h3>
        
        <div class="add-note">
          <textarea 
            v-model="newNote" 
            placeholder="Add a note or update..."
            rows="3"
          ></textarea>
          <button 
            @click="addNote" 
            :disabled="!newNote.trim() || addingNote"
            class="btn-primary"
          >
            {{ addingNote ? 'Adding...' : 'Add Note' }}
          </button>
        </div>
        
        <div v-if="caseData.notes.length === 0" class="no-notes">
          No notes yet
        </div>
        
        <div v-else class="notes-list">
          <div 
            v-for="note in caseData.notes" 
            :key="note.id" 
            class="note-item"
          >
            <div class="note-header">
              <strong>{{ note.agentName }}</strong>
              <span class="note-date">{{ formatDate(note.timestamp) }}</span>
            </div>
            <p class="note-content">{{ note.content }}</p>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCasesStore } from '../stores/cases'
import axios from 'axios'
import '../styles/CaseDetail.css'

export default {
  name: 'CaseDetail',
  setup() {
    const route = useRoute()
    const authStore = useAuthStore()
    const casesStore = useCasesStore()
    
    const caseData = ref(null)
    const loading = ref(true)
    const error = ref('')
    const newNote = ref('')
    const addingNote = ref(false)
    const newStatus = ref('')
    const agents = ref([])
    
    const fetchCase = async () => {
      try {
        const response = await axios.get(`/api/cases/${route.params.id}`)
        caseData.value = response.data
      } catch (err) {
        error.value = err.response?.data?.error || 'Failed to fetch case'
      } finally {
        loading.value = false
      }
    }

    const fetchAgents = async () => {
      try {
        const response = await axios.get('/api/agents')
        agents.value = response.data
      } catch (err) {
        console.error('Failed to fetch agents:', err)
      }
    }

    const getAssignedAgentName = (agentId) => {
      if (!agentId) return 'Unassigned'
      const agent = agents.value.find(a => a.id === agentId)
      return agent ? agent.name : 'Unknown Agent'
    }
    
    const addNote = async () => {
      if (!newNote.value.trim()) return
      
      addingNote.value = true
      const result = await casesStore.addNote(
        caseData.value.id,
        newNote.value,
        authStore.agent.id
      )
      
      if (result.success) {
        caseData.value = result.case
        newNote.value = ''
      } else {
        error.value = result.error
      }
      
      addingNote.value = false
    }
    
    const updateStatus = async () => {
      if (!newStatus.value) return
      
      const result = await casesStore.updateCaseStatus(
        caseData.value.id,
        newStatus.value,
        authStore.agent.id
      )
      
      if (result.success) {
        caseData.value = result.case
        newStatus.value = ''
      } else {
        error.value = result.error
      }
    }
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString()
    }
    
    onMounted(async () => {
      await Promise.all([
        fetchCase(),
        fetchAgents()
      ])
    })
    
    return {
      authStore,
      caseData,
      loading,
      error,
      newNote,
      addingNote,
      newStatus,
      agents,
      addNote,
      updateStatus,
      formatDate,
      getAssignedAgentName
    }
  }
}
</script>

