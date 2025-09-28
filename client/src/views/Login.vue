<template>
  <div class="login-container">
    <div class="login-content">
      <!-- Left Side - Branding -->
      <div class="login-branding">
        <div class="brand-logo">
          <div class="logo-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 class="brand-title">OneCase</h1>
        </div>
        <p class="brand-subtitle">Streamline your complaint management workflow</p>
        <div class="feature-list">
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Role-based access control</span>
          </div>
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Real-time case tracking</span>
          </div>
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Comprehensive reporting</span>
          </div>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="login-form-container">
        <div class="login-card">
          <div class="login-header">
            <h2>Welcome back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="email">Email address</label>
              <div class="input-container">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>
                </svg>
                <input
                  type="email"
                  id="email"
                  v-model="email"
                  required
                  placeholder="Enter your email"
                  class="form-input"
                />
              </div>
            </div>

            <button type="submit" :disabled="loading" class="login-btn">
              <span v-if="!loading">Sign in</span>
              <div v-else class="loading-spinner">
                <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/>
                  <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
                </svg>
                <span>Signing in...</span>
              </div>
            </button>

            <div v-if="error" class="error-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
              </svg>
              {{ error }}
            </div>
          </form>

          <div class="demo-section">
            <div class="divider">
              <span>Demo Accounts</span>
            </div>
            
            <div class="demo-grid">
              <button @click="quickLogin('john@company.com')" class="demo-card frontline">
                <div class="demo-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <div class="demo-info">
                  <span class="demo-role">Frontline Agent</span>
                  <span class="demo-email">john@company.com</span>
                </div>
              </button>

              <button @click="quickLogin('jane@company.com')" class="demo-card investigator">
                <div class="demo-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <div class="demo-info">
                  <span class="demo-role">Investigator</span>
                  <span class="demo-email">jane@company.com</span>
                </div>
              </button>

              <button @click="quickLogin('mike@company.com')" class="demo-card validator">
                <div class="demo-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <div class="demo-info">
                  <span class="demo-role">Validator</span>
                  <span class="demo-email">mike@company.com</span>
                </div>
              </button>

              <button @click="quickLogin('admin@company.com')" class="demo-card admin">
                <div class="demo-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <div class="demo-info">
                  <span class="demo-role">Admin</span>
                  <span class="demo-email">admin@company.com</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import "../styles/Login.css";

export default {
  name: "Login",
  setup() {
    const authStore = useAuthStore();
    const email = ref("");
    const loading = ref(false);
    const error = ref("");

    const handleLogin = async () => {
      loading.value = true;
      error.value = "";

      const result = await authStore.login(email.value);

      if (!result.success) {
        error.value = result.error;
      }

      loading.value = false;
    };

    const quickLogin = (demoEmail) => {
      email.value = demoEmail;
      handleLogin();
    };

    return {
      email,
      loading,
      error,
      handleLogin,
      quickLogin,
    };
  },
};
</script>
