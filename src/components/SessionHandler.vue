<template>
  <div v-if="showSessionExpiredModal" class="modal">
    <div class="modal-content">
      <h2>Session Expired</h2>
      <p>Your session has expired. Please log in again to continue.</p>
      <div class="button-container">
        <button @click="handleLogin" class="btn btn-primary">
          Login
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'SessionHandler',
  data() {
    return {
      checkInterval: null
    };
  },
  computed: {
    ...mapState('auth', ['isSessionExpired']),
    showSessionExpiredModal() {
      return this.isSessionExpired;
    }
  },
  methods: {
    ...mapActions('auth', ['checkSession', 'clearSessionExpired']),
    handleLogin() {
      this.clearSessionExpired();
      this.$router.push('/login');
    },
    startSessionCheck() {
      // Check session every 30 seconds
      this.checkInterval = setInterval(() => {
        this.checkSession();
      }, 30000);
    }
  },
  mounted() {
    this.startSessionCheck();
  },
  beforeUnmount() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

h2 {
  margin-bottom: 1rem;
  color: #333;
}

p {
  margin-bottom: 1.5rem;
  color: #666;
}

.button-container {
  display: flex;
  justify-content: center;
}

.btn {
  padding: 0.5rem 2rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
  border: none;
}
</style>