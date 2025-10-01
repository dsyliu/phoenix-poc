<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Cases</h3>
        <div class="stat-number">{{ totalCases }}</div>
      </div>
      <div class="stat-card">
        <h3>Open Cases</h3>
        <div class="stat-number">{{ openCases }}</div>
      </div>
      <div class="stat-card">
        <h3>My Cases</h3>
        <div class="stat-number">{{ myCases }}</div>
      </div>
      <div class="stat-card">
        <h3>High Priority</h3>
        <div class="stat-number">{{ highPriorityCases }}</div>
      </div>
    </div>
    
    <div class="recent-cases">
      <h2>Recent Cases</h2>
      <div v-if="casesStore.loading" class="loading">Loading cases...</div>
      <div v-else-if="casesStore.error" class="error">{{ casesStore.error }}</div>
      <div v-else-if="recentCases.length === 0" class="no-cases">No cases found</div>
      <div v-else class="cases-table-container">
        <table class="cases-table">
          <thead>
            <tr>
              <th>Case Title</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="case_ in recentCases" 
              :key="case_.id" 
              class="case-row"
              @click="$router.push(`/cases/${case_.id}`)"
            >
              <td class="case-title">
                <div class="title-content">
                  <span class="title-text">{{ case_.title }}</span>
                  <span class="case-id">#{{ case_.id.slice(-8) }}</span>
                </div>
              </td>
              <td class="case-customer">
                <div class="customer-info">
                  <span class="customer-name">{{ case_.customerName }}</span>
                  <span class="customer-email">{{ case_.customerEmail }}</span>
                </div>
              </td>
              <td class="case-status">
                <span :class="['status-badge', case_.status]">{{ case_.status }}</span>
              </td>
              <td class="case-priority">
                <span :class="['priority-badge', case_.priority]">{{ case_.priority }}</span>
              </td>
              <td class="case-assigned">
                <span v-if="case_.assignedTo" class="assigned-agent">
                  {{ getAssignedAgentName(case_.assignedTo) }}
                </span>
                <span v-else class="unassigned">Unassigned</span>
              </td>
              <td class="case-date">
                {{ formatDate(case_.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCasesStore } from '../stores/cases'
import axios from 'axios'
import '../styles/Dashboard.css'

export default {
  name: 'Dashboard',
  setup() {
    const authStore = useAuthStore()
    const casesStore = useCasesStore()
    const agents = ref([])
    
    const totalCases = computed(() => casesStore.cases.length)
    const openCases = computed(() => 
      casesStore.cases.filter(c => c.status === 'open').length
    )
    const myCases = computed(() => 
      casesStore.cases.filter(c => c.assignedTo === authStore.agent.id).length
    )
    const highPriorityCases = computed(() => 
      casesStore.cases.filter(c => c.priority === 'high' || c.priority === 'critical').length
    )
    
    const recentCases = computed(() => 
      casesStore.cases.slice(0, 5)
    )
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
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
    
    onMounted(async () => {
      authStore.initializeAuth()
      await Promise.all([
        casesStore.fetchCases(),
        fetchAgents()
      ])
    })
    
    return {
      authStore,
      casesStore,
      totalCases,
      openCases,
      myCases,
      highPriorityCases,
      recentCases,
      formatDate,
      getAssignedAgentName
    }
  }
}
</script>

