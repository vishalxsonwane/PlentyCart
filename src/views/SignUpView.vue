<template>
  <div class="signup-view">
    <the-navigation />

    <main class="main-content">
      <div class="container">
        <div class="signup-content">
          <h1 class="page-title">Sign Up to PlentyCart</h1>
          <p class="subtitle">Fresh groceries delivered to your doorstep</p>

          <!-- Error Alert -->
          <div v-if="error" class="alert" role="alert">
            {{ error }}
          </div>

          <form @submit.prevent="handleSubmit" class="signup-form">
            <!-- Full Name Field -->
            <div class="form-group">
              <label for="full-name" class="form-label">Full Name</label>
              <input 
                v-model="form.full_name" 
                type="text" 
                class="form-input" 
                :class="{ 'is-invalid': fullNameError }"
                id="full-name" 
                placeholder="Enter your full name" 
                @input="validateFullName" 
                required
              >
              <small v-if="fullNameError" class="error-message">
                {{ fullNameError }}
              </small>
            </div>

            <!-- Phone Number Field -->
            <div class="form-group">
              <label for="phone-number" class="form-label">Phone Number</label>
              <input 
                v-model.number="form.phone_number" 
                type="tel" 
                class="form-input" 
                :class="{ 'is-invalid': phoneNumberError }"
                id="phone-number" 
                placeholder="Enter your phone number" 
                @input="validatePhoneNumber" 
                required
              >
              <small v-if="phoneNumberError" class="error-message">
                {{ phoneNumberError }}
              </small>
            </div>

            <!-- Email Field -->
            <div class="form-group">
              <label for="email" class="form-label">Email address</label>
              <input 
                v-model="form.email" 
                type="email" 
                class="form-input" 
                :class="{ 'is-invalid': emailError }"
                id="email" 
                placeholder="Enter your email" 
                @input="validateEmail" 
                required
              >
              <small v-if="emailError" class="error-message">
                {{ emailError }}
              </small>
              <small class="helper-text">
                We'll never share your email with anyone else.
              </small>
            </div>

            <!-- Password Field -->
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <div class="password-input-wrapper">
                <input 
                  v-model="form.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  class="form-input" 
                  :class="{ 'is-invalid': passwordError }"
                  id="password" 
                  placeholder="Enter your password" 
                  @input="validatePassword" 
                  required
                >
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  <i class="fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
                </button>
              </div>
              <small v-if="passwordError" class="error-message">
                {{ passwordError }}
              </small>
              <small class="helper-text">
                Password must be at least 8 characters and include at least one special character,
                uppercase letter, lowercase letter, and number
              </small>
            </div>

            <!-- Confirm Password Field -->
            <div class="form-group">
              <label for="password-confirm" class="form-label">Confirm Password</label>
              <div class="password-input-wrapper">
                <input 
                  v-model="form.passwordConfirm" 
                  :type="showPasswordConfirm ? 'text' : 'password'" 
                  class="form-input" 
                  :class="{ 'is-invalid': passwordConfirmError }"
                  id="password-confirm" 
                  placeholder="Re-enter your password" 
                  @input="validatePasswordConfirm" 
                  required
                >
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPasswordConfirm = !showPasswordConfirm"
                >
                  <i class="fas" :class="showPasswordConfirm ? 'fa-eye-slash' : 'fa-eye'"></i>
                </button>
              </div>
              <small v-if="passwordConfirmError" class="error-message">
                {{ passwordConfirmError }}
              </small>
            </div>
            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary" 
                :disabled="!isFormValid || loading"
              >
                {{ loading ? 'Signing up...' : 'Sign Up' }}
              </button>

              <router-link :to="{ name: 'login' }" class="btn btn-secondary">
                Already have an account?
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
import { mapActions } from 'vuex'
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'

export default {
  name: 'SignUpView',
  
  components: {
    TheHeader,
    TheFooter
  },
  
  data() {
    return {
      form: {
        full_name: '',
        phone_number: null,
        email: '',
        password: '',
        passwordConfirm: '',
        is_admin: false
      },
      fullNameError: '',
      phoneNumberError: '',
      emailError: '',
      passwordError: '',
      passwordConfirmError: '',
      error: '',
      loading: false,
      showPassword: false,
      showPasswordConfirm: false
    }
  },
  
  computed: {
    isFormValid() {
      return !this.fullNameError &&
             !this.phoneNumberError &&
             !this.emailError &&
             !this.passwordError &&
             !this.passwordConfirmError &&
             this.form.full_name &&
             this.form.phone_number &&
             this.form.email &&
             this.form.password &&
             this.form.passwordConfirm
    }
  },
  
  methods: {
    ...mapActions('auth', ['register']),
    
    validateFullName() {
      if (!this.form.full_name) {
        this.fullNameError = 'Full name is required'
      } else {
        this.fullNameError = ''
      }
    },
    
    validatePhoneNumber() {
      const phoneRegex = /^[0-9]{10}$/; // Adjust this regex to your requirements (e.g., country-specific rules)
      
      if (!this.form.phone_number) {
        this.phoneNumberError = 'Phone number is required';
      } else if (!phoneRegex.test(this.form.phone_number)) {
        this.phoneNumberError = 'Please enter a valid 10-digit phone number';
      } else {
        this.phoneNumberError = '';
      }
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
      const validLength = /.{8,}/.test(this.form.password)
      const hasCaps = /[A-Z]/.test(this.form.password)
      const hasNums = /\d/.test(this.form.password)
      const hasSpecials = /[~!,@#%&_\$\^\*\?\-]/.test(this.form.password)
      
      if (!this.form.password) {
        this.passwordError = 'Password is required'
      } else if (!(validLength && hasCaps && hasNums && hasSpecials)) {
        this.passwordError = 'Password must be at least 8 characters and include special characters, uppercase, lowercase, and numbers'
      } else {
        this.passwordError = ''
      }
      
      if (this.form.passwordConfirm) {
        this.validatePasswordConfirm()
      }
    },
    
    validatePasswordConfirm() {
      if (!this.form.passwordConfirm) {
        this.passwordConfirmError = 'Please confirm your password'
      } else if (this.form.password !== this.form.passwordConfirm) {
        this.passwordConfirmError = 'Passwords must match'
      } else {
        this.passwordConfirmError = ''
      }
    },
    
    async handleSubmit() {
      this.validateFullName()
      this.validatePhoneNumber()
      this.validateEmail()
      this.validatePassword()
      this.validatePasswordConfirm()
      
      if (!this.isFormValid) {
        return
      }
      
      this.loading = true
      this.error = ''
      
      try {
        await this.register({
          full_name: this.form.full_name,
          phone_number: this.form.phone_number,
          email: this.form.email,
          password: this.form.password,
          is_admin: this.form.is_admin
        })
        
        this.$router.push({
          name: 'login',
          query: { registered: 'true' }
        })
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to sign up'
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

.signup-content {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #6c757d;
  margin-bottom: 2rem;
}

.signup-form {
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

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
}

.password-toggle:focus {
  outline: none;
  color: #4CAF50;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
}

.checkbox-label {
  color: #2c3e50;
  font-size: 0.875rem;
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
  .signup-content {
    padding: 1rem;
  }

  .signup-form {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 1.75rem;
  }
}
</style>