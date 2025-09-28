<template>
  <div class="admin-panel">
    <h1>Admin Panel</h1>
    
    <div class="admin-sections">
      <!-- Configuration Management -->
      <div class="admin-section">
        <h2>Configuration Management</h2>
        
        <!-- Categories -->
        <div class="config-group">
          <h3>Categories</h3>
          <div class="config-list">
            <div v-for="category in categories" :key="category.value" class="config-item">
              <span>{{ category.label }} ({{ category.value }})</span>
              <button @click="removeCategory(category.value)" class="btn-danger">Remove</button>
            </div>
          </div>
          <div class="add-config">
            <input v-model="newCategory.value" placeholder="Category value" />
            <input v-model="newCategory.label" placeholder="Category label" />
            <button @click="addCategory" class="btn-primary">Add Category</button>
          </div>
        </div>

        <!-- Priorities -->
        <div class="config-group">
          <h3>Priorities</h3>
          <div class="config-list">
            <div v-for="priority in priorities" :key="priority.value" class="config-item">
              <span>{{ priority.label }} ({{ priority.value }})</span>
              <button @click="removePriority(priority.value)" class="btn-danger">Remove</button>
            </div>
          </div>
          <div class="add-config">
            <input v-model="newPriority.value" placeholder="Priority value" />
            <input v-model="newPriority.label" placeholder="Priority label" />
            <button @click="addPriority" class="btn-primary">Add Priority</button>
          </div>
        </div>

        <!-- Statuses -->
        <div class="config-group">
          <h3>Statuses</h3>
          <div class="config-list">
            <div v-for="status in statuses" :key="status.value" class="config-item">
              <span>{{ status.label }} ({{ status.value }})</span>
              <button @click="removeStatus(status.value)" class="btn-danger">Remove</button>
            </div>
          </div>
          <div class="add-config">
            <input v-model="newStatus.value" placeholder="Status value" />
            <input v-model="newStatus.label" placeholder="Status label" />
            <button @click="addStatus" class="btn-primary">Add Status</button>
          </div>
        </div>

        <div class="reset-section">
          <button @click="resetConfigurations" class="btn-warning">Reset All to Defaults</button>
        </div>
      </div>

      <!-- Database Overview -->
      <div class="admin-section">
        <h2>Database Overview</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total Cases</h3>
            <div class="stat-number">{{ totalCases }}</div>
          </div>
          <div class="stat-card">
            <h3>Total Agents</h3>
            <div class="stat-number">{{ totalAgents }}</div>
          </div>
          <div class="stat-card">
            <h3>Active Agents</h3>
            <div class="stat-number">{{ activeAgents }}</div>
          </div>
          <div class="stat-card">
            <h3>Open Cases</h3>
            <div class="stat-number">{{ openCases }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="message" class="message" :class="messageType">{{ message }}</div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCasesStore } from '../stores/cases'
import axios from 'axios'
import '../styles/AdminPanel.css'

export default {
  name: 'AdminPanel',
  setup() {
    const authStore = useAuthStore()
    const casesStore = useCasesStore()
    
    const categories = ref([])
    const priorities = ref([])
    const statuses = ref([])
    const agents = ref([])
    const message = ref('')
    const messageType = ref('success')
    
    const newCategory = ref({ value: '', label: '' })
    const newPriority = ref({ value: '', label: '' })
    const newStatus = ref({ value: '', label: '' })
    
    // Computed stats
    const totalCases = computed(() => casesStore.cases.length)
    const totalAgents = computed(() => agents.value.length)
    const activeAgents = computed(() => agents.value.filter(a => a.isActive).length)
    const openCases = computed(() => casesStore.cases.filter(c => c.status === 'open').length)
    
    const showMessage = (msg, type = 'success') => {
      message.value = msg
      messageType.value = type
      setTimeout(() => {
        message.value = ''
      }, 3000)
    }
    
    const loadConfigurations = async () => {
      try {
        const response = await axios.get('/api/config')
        categories.value = response.data.categories
        priorities.value = response.data.priorities
        statuses.value = response.data.statuses
      } catch (error) {
        showMessage('Failed to load configurations', 'error')
      }
    }
    
    const loadAgents = async () => {
      try {
        const response = await axios.get('/api/agents')
        agents.value = response.data
      } catch (error) {
        showMessage('Failed to load agents', 'error')
      }
    }
    
    const addCategory = async () => {
      try {
        await axios.post('/api/config/categories', {
          ...newCategory.value,
          agentId: authStore.agent.id
        })
        newCategory.value = { value: '', label: '' }
        await loadConfigurations()
        showMessage('Category added successfully')
      } catch (error) {
        showMessage(error.response?.data?.error || 'Failed to add category', 'error')
      }
    }
    
    const removeCategory = async (value) => {
      try {
        await axios.delete(`/api/config/categories/${value}`, {
          data: { agentId: authStore.agent.id }
        })
        await loadConfigurations()
        showMessage('Category removed successfully')
      } catch (error) {
        showMessage(error.response?.data?.error || 'Failed to remove category', 'error')
      }
    }
    
    const addPriority = async () => {
      try {
        await axios.post('/api/config/priorities', {
          ...newPriority.value,
          agentId: authStore.agent.id
        })
        newPriority.value = { value: '', label: '' }
        await loadConfigurations()
        showMessage('Priority added successfully')
      } catch (error) {
        showMessage(error.response?.data?.error || 'Failed to add priority', 'error')
      }
    }
    
    const removePriority = async (value) => {
      try {
        await axios.delete(`/api/config/priorities/${value}`, {
          data: { agentId: authStore.agent.id }
        })
        await loadConfigurations()
        showMessage('Priority removed successfully')
      } catch (error) {
        showMessage(error.response?.data?.error || 'Failed to remove priority', 'error')
      }
    }
    
    const addStatus = async () => {
      try {
        await axios.post('/api/config/statuses', {
          ...newStatus.value,
          agentId: authStore.agent.id
        })
        newStatus.value = { value: '', label: '' }
        await loadConfigurations()
        showMessage('Status added successfully')
      } catch (error) {
        showMessage(error.response?.data?.error || 'Failed to add status', 'error')
      }
    }
    
    const removeStatus = async (value) => {
      try {
        await axios.delete(`/api/config/statuses/${value}`, {
          data: { agentId: authStore.agent.id }
        })
        await loadConfigurations()
        showMessage('Status removed successfully')
      } catch (error) {
        showMessage(error.response?.data?.error || 'Failed to remove status', 'error')
      }
    }
    
    const resetConfigurations = async () => {
      if (!confirm('Are you sure you want to reset all configurations to defaults?')) {
        return
      }
      
      try {
        await axios.post('/api/config/reset', {
          agentId: authStore.agent.id
        })
        await loadConfigurations()
        showMessage('Configurations reset to defaults')
      } catch (error) {
        showMessage(error.response?.data?.error || 'Failed to reset configurations', 'error')
      }
    }
    
    onMounted(async () => {
      await Promise.all([
        loadConfigurations(),
        loadAgents(),
        casesStore.fetchCases()
      ])
    })
    
    return {
      categories,
      priorities,
      statuses,
      agents,
      message,
      messageType,
      newCategory,
      newPriority,
      newStatus,
      totalCases,
      totalAgents,
      activeAgents,
      openCases,
      addCategory,
      removeCategory,
      addPriority,
      removePriority,
      addStatus,
      removeStatus,
      resetConfigurations
    }
  }
}
</script>