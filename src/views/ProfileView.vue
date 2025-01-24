<template>
    <div class="profile-container">
      <h1 class="page-title">My Profile</h1>
      <form @submit.prevent="updateProfile" class="profile-form">
        <div class="form-group">
          <label for="full-name" class="form-label">Full Name</label>
          <input type="text" id="full-name" v-model="fullName" required class="form-input" />
        </div>
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input type="email" id="email" v-model="email" disabled class="form-input" />
        </div>
        <div class="form-group">
          <label for="phone-number" class="form-label">Phone Number</label>
          <input type="tel" id="phone-number" v-model="phoneNumber" required class="form-input" />
        </div>
        <div class="form-group password-section">
          <div class="password-input">
            <button
              type="button"
              class="change-password-btn"
              @click="showChangePasswordModal = true"
            >
              Change Password
            </button>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Update Profile</button>
      </form>
  
      <div class="modal" v-if="showChangePasswordModal">
        <div class="modal-content">
          <span class="close-button" @click="showChangePasswordModal = false">&times;</span>
          <h2>Change Password</h2>
          <form @submit.prevent="changePassword">
            <div class="form-group">
              <label for="new-password" class="form-label">New Password</label>
              <div class="password-input-wrapper">
                <input
                  :type="showNewPassword ? 'text' : 'password'"
                  id="new-password"
                  v-model="newPassword"
                  required
                  class="form-input password-input-field"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showNewPassword = !showNewPassword"
                >
                  <i class="mdi" :class="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    style="cursor: pointer; font-size: 20px;"
                  ></i>
                </button>
              </div>
              <small v-if="newPasswordError" class="error-message">
                {{ newPasswordError }}
              </small>
            </div>
            <div class="form-group">
              <label for="password-confirm" class="form-label">Confirm New Password</label>
              <div class="password-input-wrapper">
                <input
                  :type="showPasswordConfirm ? 'text' : 'password'"
                  id="password-confirm"
                  v-model="passwordConfirm"
                  required
                  class="form-input password-input-field"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPasswordConfirm = !showPasswordConfirm"
                >
                  <i class="mdi" :class="showPasswordConfirm ? 'mdi-eye-off' : 'mdi-eye'"
                    style="cursor: pointer; font-size: 20px;"
                  ></i>
                </button>
              </div>
              <small v-if="passwordConfirmError" class="error-message">
                {{ passwordConfirmError }}
              </small>
            </div>
            <button type="submit" class="btn btn-primary">Update Password</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState, mapActions } from 'vuex';
  
  export default {
    name: 'ProfileView',
    data() {
      return {
        fullName: '',
        email: '',
        phoneNumber: '',
        newPassword: '',
        passwordConfirm: '',
        showChangePasswordModal: false,
        showNewPassword: false,
        showPasswordConfirm: false,
        newPasswordError: '',
        passwordConfirmError: ''
      };
    },
    computed: {
      ...mapState('auth', ['user', 'isLoading']),
    },
    async mounted() {
      if (!this.user) {
        await this.$store.dispatch('auth/checkAuthState');
      }
      if (this.user) {
        this.populateUserDetails();
      }
    },
    methods: {
      ...mapActions('users', ['updateUserProfile', 'updateUserPassword']),
      populateUserDetails() {
        console.log('User details:', JSON.stringify(this.user));
        this.fullName = this.user?.full_name || '';
        this.email = this.user?.email || '';
        this.phoneNumber = this.user?.phone_number || '';
      },
      async updateProfile() {
        try {
          await this.updateUserProfile({
            userId : this.user.id,
            full_name: this.fullName,
            phone_number: this.phoneNumber,
          });
          this.$toast.success('Profile updated successfully');
          this.$router.push({ name: 'home' });
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      },
      validateNewPassword() {
        const validLength = /.{8,}/.test(this.newPassword);
        const hasCaps = /[A-Z]/.test(this.newPassword);
        const hasNums = /\d/.test(this.newPassword);
        const hasSpecials = /[~!,@#%&_\$\^\*\?\-]/.test(this.newPassword);
  
        if (!this.newPassword) {
          this.newPasswordError = 'New password is required';
        } else if (!(validLength && hasCaps && hasNums && hasSpecials)) {
          this.newPasswordError = 'Password must be at least 8 characters and include special characters, uppercase, lowercase, and numbers';
        } else {
          this.newPasswordError = '';
        }
  
        this.validatePasswordConfirm();
      },
      validatePasswordConfirm() {
        if (!this.passwordConfirm) {
          this.passwordConfirmError = 'Please confirm your new password';
        } else if (this.newPassword !== this.passwordConfirm) {
          this.passwordConfirmError = 'Passwords must match';
        } else {
          this.passwordConfirmError = '';
        }
      },
      async changePassword() {
        this.validateNewPassword();
  
        if (this.newPasswordError || this.passwordConfirmError) {
          return;
        }
  
        try {
          await this.updateUserPassword({
            userId: this.user.id,
            newPassword: this.newPassword,
          });
          this.showChangePasswordModal = false;
          this.newPassword = '';
          this.passwordConfirm = '';
          this.$toast.success('Password updated successfully');
        } catch (error) {
          console.error('Error changing password:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .profile-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .page-title {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
    margin-top: 4rem;
  }
  
  .profile-form {
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
    font-weight: 500;
    margin-bottom: 0.5rem;
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
  
  .password-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .password-input {
    display: flex;
    align-items: center;
  }
  
  .change-password-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 14rem;
  }
  
  .password-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .password-input-field {
    padding-right: 2.5rem;
  }
  
  .password-toggle {
    position: absolute;
    right: 0.75rem;
    background: none;
    border: none;
    color: #6c757d;
    cursor: pointer;
  }
  
  .password-toggle:focus {
    outline: none;
    color: #4CAF50;
  }
  
  .btn {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btn-primary {
    background-color: #4CAF50;
    color: white;
  }
  
  .modal {
    display: block;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  }
  
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 30%;
  }
  
  .close-button {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }
  
  .close-button:hover,
  .close-button:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  
  @media (max-width: 768px) {
    .profile-container {
      padding: 1rem;
    }
  
    .modal-content {
      width: 90%;
      margin: 20% auto;
    }
  }
  </style>