// Frontend constants - fetches from backend config
import axios from 'axios'
import type { ConfigOption } from '../types'

interface Configuration {
  categories: ConfigOption[]
  priorities: ConfigOption[]
  statuses: ConfigOption[]
}

// Default configuration (fallback)
const defaultConfig: Configuration = {
  categories: [
    { value: 'billing', label: 'Billing' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'product', label: 'Product Issue' },
    { value: 'service', label: 'Service Quality' },
    { value: 'other', label: 'Other' }
  ],
  priorities: [
    { value: 'tier1', label: 'Tier 1' },
    { value: 'tier2', label: 'Tier 2' },
    { value: 'tier3', label: 'Tier 3' }
  ],
  statuses: [
    { value: 'open', label: 'Open' },
    { value: 'investigating', label: 'Investigating' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ]
}

// Current configuration (will be updated from API)
let currentConfig: Configuration = { ...defaultConfig }

// Export reactive constants
export let CASE_CATEGORIES = currentConfig.categories
export let CASE_PRIORITIES = currentConfig.priorities
export let CASE_STATUSES = currentConfig.statuses

// Function to fetch configuration from API
export const fetchConstants = async (): Promise<Configuration> => {
  try {
    const response = await axios.get<Configuration>('/api/cases/constants')
    currentConfig = response.data
    
    // Update exported constants
    CASE_CATEGORIES = currentConfig.categories
    CASE_PRIORITIES = currentConfig.priorities
    CASE_STATUSES = currentConfig.statuses
    
    return currentConfig
  } catch (error) {
    console.warn('Failed to fetch configuration from API, using defaults:', error)
    return defaultConfig
  }
}

// Initialize configuration on module load
fetchConstants().catch(() => {
  console.log('Using default configuration')
})

export { defaultConfig }