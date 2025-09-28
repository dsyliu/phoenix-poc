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
      <div v-else class="cases-list">
        <div 
          v-for="case_ in recentCases" 
          :key="case_.id" 
          class="case-item"
          @click="$router.push(`/cases/${case_.id}`)"
        >
          <div class="case-header">
            <h4>{{ case_.title }}</h4>
            <span :class="['status', case_.status]">{{ case_.status }}</span>
          </div>
          <p class="case-customer">{{ case_.customerName }} - {{ case_.customerEmail }}</p>
          <div class="case-meta">
            <span :class="['priority', case_.priority]">{{ case_.priority }}</span>
            <span class="date">{{ formatDate(case_.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCasesStore } from '../stores/cases'
import '../styles/Dashboard.css'

export default {
  name: 'Dashboard',
  setup() {
    const authStore = useAuthStore()
    const casesStore = useCasesStore()
    
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
    
    onMounted(() => {
      authStore.initializeAuth()
      casesStore.fetchCases()
    })
    
    return {
      authStore,
      casesStore,
      totalCases,
      openCases,
      myCases,
      highPriorityCases,
      recentCases,
      formatDate
    }
  }
}
</script>

