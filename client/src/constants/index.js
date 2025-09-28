// Frontend constants - fetches from backend config
import axios from 'axios'

// Default configuration (fallback)
const defaultConfig = {
  categories: [
    { value: 'billing', label: 'Billing' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'product', label: 'Product Issue' },
    { value: 'service', label: 'Service Quality' },
    { value: 'other', label: 'Other' }
  ],
  priorities: [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ],
  statuses: [
    { value: 'open', label: 'Open' },
    { value: 'investigating', label: 'Investigating' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ]
};

// Current configuration (will be updated from API)
let currentConfig = { ...defaultConfig };

// Export reactive constants
let CASE_CATEGORIES = currentConfig.categories;
let CASE_PRIORITIES = currentConfig.priorities;
let CASE_STATUSES = currentConfig.statuses;

// Function to fetch configuration from API
const fetchConstants = async () => {
  try {
    const response = await axios.get('/api/cases/constants');
    currentConfig = response.data;
    
    // Update exported constants
    CASE_CATEGORIES = currentConfig.categories;
    CASE_PRIORITIES = currentConfig.priorities;
    CASE_STATUSES = currentConfig.statuses;
    
    return currentConfig;
  } catch (error) {
    console.warn('Failed to fetch configuration from API, using defaults:', error);
    return defaultConfig;
  }
};

// Initialize configuration on module load
fetchConstants().catch(() => {
  console.log('Using default configuration');
});

export {
  CASE_CATEGORIES,
  CASE_PRIORITIES,
  CASE_STATUSES,
  fetchConstants,
  defaultConfig
};