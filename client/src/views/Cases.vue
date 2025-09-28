<template>
  <div class="cases">
    <div class="cases-header">
      <h1>Cases</h1>
      <router-link 
        v-if="authStore.canCreateCases" 
        to="/create-case" 
        class="btn-primary"
      >
        Create New Case
      </router-link>
    </div>
    
    <div class="filters">
      <select v-model="filters.status" @change="applyFilters">
        <option value="">All Statuses</option>
        <option 
          v-for="status in CASE_STATUSES" 
          :key="status.value" 
          :value="status.value"
        >
          {{ status.label }}
        </option>
      </select>
      
      <select v-model="filters.priority" @change="applyFilters">
        <option value="">All Priorities</option>
        <option 
          v-for="priority in CASE_PRIORITIES" 
          :key="priority.value" 
          :value="priority.value"
        >
          {{ priority.label }}
        </option>
      </select>
      
      <select v-model="filters.assignedTo" @change="applyFilters">
        <option value="">All Agents</option>
        <option :value="authStore.agent.id">My Cases</option>
      </select>
    </div>
    
    <div v-if="casesStore.loading" class="loading">Loading cases...</div>
    <div v-else-if="casesStore.error" class="error">{{ casesStore.error }}</div>
    <div v-else-if="casesStore.cases.length === 0" class="no-cases">No cases found</div>
    
    <div v-else class="cases-grid">
      <div 
        v-for="case_ in casesStore.cases" 
        :key="case_.id" 
        class="case-card"
        @click="$router.push(`/cases/${case_.id}`)"
      >
        <div class="case-header">
          <h3>{{ case_.title }}</h3>
          <span :class="['status', case_.status]">{{ case_.status }}</span>
        </div>
        
        <p class="case-description">{{ case_.description }}</p>
        
        <div class="case-customer">
          <strong>Customer:</strong> {{ case_.customerName }}
          <br>
          <strong>Email:</strong> {{ case_.customerEmail }}
        </div>
        
        <div class="case-meta">
          <span :class="['priority', case_.priority]">{{ case_.priority }}</span>
          <span class="category">{{ case_.category }}</span>
        </div>
        
        <div class="case-dates">
          <small>Created: {{ formatDate(case_.createdAt) }}</small>
          <small v-if="case_.updatedAt !== case_.createdAt">
            Updated: {{ formatDate(case_.updatedAt) }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCasesStore } from '../stores/cases'
import { CASE_STATUSES, CASE_PRIORITIES } from '../constants'
import '../styles/Cases.css'

export default {
  name: 'Cases',
  setup() {
    const authStore = useAuthStore()
    const casesStore = useCasesStore()
    
    const filters = ref({
      status: '',
      priority: '',
      assignedTo: ''
    })
    
    const applyFilters = () => {
      const activeFilters = {}
      Object.keys(filters.value).forEach(key => {
        if (filters.value[key]) {
          activeFilters[key] = filters.value[key]
        }
      })
      casesStore.fetchCases(activeFilters)
    }
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }
    
    onMounted(() => {
      casesStore.fetchCases()
    })
    
    return {
      authStore,
      casesStore,
      filters,
      applyFilters,
      formatDate,
      CASE_STATUSES,
      CASE_PRIORITIES
    }
  }
}
</script>

