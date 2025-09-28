<template>
  <div id="app" class="app-container">
    <nav class="modern-navbar" v-if="authStore.isAuthenticated">
      <div class="nav-container">
        <div class="nav-brand">
          <div class="brand-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 class="brand-text">OneCase</h2>
        </div>
        
        <div class="nav-links">
          <router-link to="/dashboard" class="nav-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Dashboard</span>
          </router-link>
          
          <router-link to="/cases" class="nav-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2"/>
              <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2"/>
              <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Cases</span>
          </router-link>
          
          <router-link to="/create-case" v-if="authStore.canCreateCases" class="nav-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="2"/>
              <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>New Case</span>
          </router-link>
          
          <router-link to="/admin" v-if="authStore.isAdmin" class="nav-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Admin</span>
          </router-link>
        </div>
        
        <div class="nav-user">
          <div class="user-info">
            <div class="user-avatar">
              {{ authStore.agent.name.charAt(0).toUpperCase() }}
            </div>
            <div class="user-details">
              <span class="user-name">{{ authStore.agent.name }}</span>
              <span class="user-role">{{ authStore.agent.role }}</span>
            </div>
          </div>
          <button @click="logout" class="logout-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2"/>
              <polyline points="16,17 21,12 16,7" stroke="currentColor" stroke-width="2"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
    
    <main class="main-content" :class="{ 'with-navbar': authStore.isAuthenticated }">
      <router-view />
    </main>
  </div>
</template>

<script>
import { useAuthStore } from './stores/auth'

export default {
  name: 'App',
  setup() {
    const authStore = useAuthStore()
    
    const logout = () => {
      authStore.logout()
    }
    
    return {
      authStore,
      logout
    }
  }
}
</script>

<style>
/* Modern CSS Variables */
:root {
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-900: #1e3a8a;
  
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  
  --success-500: #10b981;
  --warning-500: #f59e0b;
  --error-500: #ef4444;
  
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%);
  color: var(--gray-900);
  line-height: 1.6;
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Modern Navigation */
.modern-navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--gray-200);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--gray-600);
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--primary-600);
  background: var(--primary-50);
}

.nav-link.router-link-active {
  color: var(--primary-600);
  background: var(--primary-100);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 0.25rem;
  height: 0.25rem;
  background: var(--primary-500);
  border-radius: 50%;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-weight: 600;
  color: var(--gray-900);
  font-size: 0.875rem;
}

.user-role {
  font-size: 0.75rem;
  color: var(--gray-500);
  text-transform: capitalize;
}

.logout-btn {
  background: var(--gray-100);
  border: none;
  border-radius: var(--radius-lg);
  padding: 0.5rem;
  cursor: pointer;
  color: var(--gray-600);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-btn:hover {
  background: var(--error-500);
  color: white;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.main-content.with-navbar {
  padding-top: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }
  
  .nav-links {
    gap: 0.25rem;
  }
  
  .nav-link span {
    display: none;
  }
  
  .user-details {
    display: none;
  }
  
  .main-content {
    padding: 1rem;
  }
}

@media (max-width: 640px) {
  .brand-text {
    display: none;
  }
  
  .nav-links {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-top: 1px solid var(--gray-200);
    padding: 0.75rem;
    justify-content: space-around;
  }
  
  .nav-link {
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.5rem;
    font-size: 0.75rem;
  }
  
  .nav-link span {
    display: block;
  }
  
  .main-content.with-navbar {
    padding-bottom: 5rem;
  }
}
</style>

