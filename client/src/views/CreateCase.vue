<template>
  <div class="create-case">
    <h1>Create New Case</h1>
    
    <form @submit.prevent="handleSubmit" class="case-form">
      <div class="form-row">
        <div class="form-group">
          <label for="title">Case Title *</label>
          <input 
            type="text" 
            id="title" 
            v-model="form.title" 
            required 
            placeholder="Brief description of the issue"
          />
        </div>
        
        <div class="form-group">
          <label for="category">Category *</label>
          <select id="category" v-model="form.category" required>
            <option value="">Select category</option>
            <option 
              v-for="category in CASE_CATEGORIES" 
              :key="category.value" 
              :value="category.value"
            >
              {{ category.label }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label for="description">Description *</label>
        <textarea 
          id="description" 
          v-model="form.description" 
          required 
          rows="4"
          placeholder="Detailed description of the complaint"
        ></textarea>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="customerName">Customer Name *</label>
          <input 
            type="text" 
            id="customerName" 
            v-model="form.customerName" 
            required 
            placeholder="Customer's full name"
          />
        </div>
        
        <div class="form-group">
          <label for="customerEmail">Customer Email *</label>
          <input 
            type="email" 
            id="customerEmail" 
            v-model="form.customerEmail" 
            required 
            placeholder="customer@email.com"
          />
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="customerId">Customer ID</label>
          <input 
            type="text" 
            id="customerId" 
            v-model="form.customerId" 
            placeholder="Internal customer ID (optional)"
          />
        </div>
        
        <div class="form-group">
          <label for="priority">Priority *</label>
          <select id="priority" v-model="form.priority" required>
            <option 
              v-for="priority in CASE_PRIORITIES" 
              :key="priority.value" 
              :value="priority.value"
            >
              {{ priority.label }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="form-actions">
        <button type="button" @click="$router.go(-1)" class="btn-secondary">
          Cancel
        </button>
        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? 'Creating...' : 'Create Case' }}
        </button>
      </div>
      
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCasesStore } from '../stores/cases'
import { CASE_CATEGORIES, CASE_PRIORITIES } from '../constants'
import '../styles/CreateCase.css'

export default {
  name: 'CreateCase',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const casesStore = useCasesStore()
    
    const form = ref({
      title: '',
      description: '',
      customerName: '',
      customerEmail: '',
      customerId: '',
      category: '',
      priority: 'medium'
    })
    
    const loading = ref(false)
    const error = ref('')
    
    const handleSubmit = async () => {
      loading.value = true
      error.value = ''
      
      const caseData = {
        ...form.value,
        createdBy: authStore.agent.id
      }
      
      const result = await casesStore.createCase(caseData)
      
      if (result.success) {
        router.push(`/cases/${result.case.id}`)
      } else {
        error.value = result.error
      }
      
      loading.value = false
    }
    
    return {
      form,
      loading,
      error,
      handleSubmit,
      CASE_CATEGORIES,
      CASE_PRIORITIES
    }
  }
}
</script>

