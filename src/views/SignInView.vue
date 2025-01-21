<template>
  <div class="login-view">
    <the-navigation />

    <main class="main-content">
      <div class="container">
        <div class="login-content">
          <h1 class="page-title">Sign In to PlentyCart</h1>

          <!-- Error Alert -->
          <div v-if="error" class="alert" role="alert">
            {{ error }}
          </div>

          <form @submit.prevent="handleSubmit" class="login-form">
            <div class="form-group">
              <label for="email" class="form-label">Email address</label>
              <input v-model="form.email" type="email" class="form-input" :class="{ 'is-invalid': emailError }"
                id="email" placeholder="Enter your email" @input="validateEmail" required>
              <small v-if="emailError" class="error-message">
                {{ emailError }}
              </small>
              <small class="helper-text">
                We'll never share your email with anyone else.
              </small>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <div class="password-input-wrapper">
                <input 
                  v-model="form.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  class="form-input" 
                  :class="{ 'is-invalid': passwordError }"
                  id="password" 
                  placeholder="Enter your Password" 
                  @input="validatePassword" 
                  required
                >
                <button
                  type="button"
                  class="password-toggle"
                  @click="togglePasswordVisibility"
                >
                  <i class="mdi" :class="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    style="cursor: pointer; font-size: 20px;"
                  ></i>
                </button>
              </div>
              <small v-if="passwordError" class="error-message">
                {{ passwordError }}
              </small>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'loging in...' : 'Sign In' }}
              </button>

              <router-link :to="{ name: 'signup' }" class="btn btn-secondary">
                New User Registration
              </router-link>
            </div>
          </form>

          <div class="back-link">
            <router-link :to="{ name: 'home' }" class="btn btn-text">
              ← Back to Main
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'

export default {
  name: 'loginView',

  components: {
    TheHeader,
    TheFooter
  },

  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      emailError: '',
      passwordError: '',
      error: '',
      loading: false,
      showPassword: false
    }
  },

  watch: {
    authError(error) {
      this.error = error
    }
  },

  computed: {
    ...mapGetters('auth', {
      isAuthenticated: 'isAuthenticated',
      authError: 'authError'
    })
  },

  async created() {
    // Check if user is already authenticated
    if (this.isAuthenticated) {
      const redirect = this.$route.query.redirect || '/'
      this.$router.push(redirect)
    }
  },

  methods: {
    ...mapActions('auth', ['login']),

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },

    validateEmail() {
      const emailRegex = /^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]+\.[A-Za-z]{2,4}$/
      if (!this.form.email) {
        this.emailError = 'Email is required'
      } else if (!emailRegex.test(this.form.email)) {
        this.emailError = 'Please enter a valid email'
      } else {
        this.emailError = ''
      }
    },

    validatePassword() {
      if (!this.form.password) {
        this.passwordError = 'Password is required'
      } else if (this.form.password.length < 4) {
        this.passwordError = 'Password must be at least 4 characters'
      } else {
        this.passwordError = ''
      }
    },

    async handleSubmit() {
      this.validateEmail()
      this.validatePassword()

      if (this.emailError || this.passwordError) {
        return
      }

      this.loading = true
      this.error = ''

      try {
        await this.login(this.form)
        const redirect = this.$route.query.redirect || '/'
        this.$router.push(redirect)
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style scoped>
.main-content {
  padding-top: 6rem;
  min-height: calc(100vh - 6rem);
  background-color: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.login-content {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
}

.login-form {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-input.is-invalid {
  border-color: #dc3545;
}

.helper-text {
  display: block;
  margin-top: 0.25rem;
  color: #6c757d;
  font-size: 0.875rem;
}

.error-message {
  display: block;
  margin-top: 0.25rem;
  color: #dc3545;
  font-size: 0.875rem;
}

.alert {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-primary:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #2196F3;
  color: white;
}

.btn-secondary:hover {
  background-color: #1976d2;
}

.btn-text {
  background: none;
  color: #2c3e50;
  padding: 0.5rem;
}

.btn-text:hover {
  color: #4CAF50;
}

.back-link {
  margin-top: 2rem;
  text-align: center;
}

@media (max-width: 768px) {
  .login-content {
    padding: 1rem;
  }

  .login-form {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 1.75rem;
  }
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper .form-input {
  padding-right: 2.5rem;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:focus {
  outline: none;
}

.password-toggle i {
  font-size: 1.2rem;
}
</style>