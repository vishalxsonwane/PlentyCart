<!-- App.vue -->
<template>
  <div id="app">
    <div v-if="isLoading" class="loading-screen">
      <div class="spinner"></div>
    </div>
    <template v-else>
      <SessionHandler />
      <the-navigation />
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
import TheNavigation from '@components/layout/TheNavigation.vue'
import SessionHandler from '@components/SessionHandler.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'App',
  
  components: {
    TheNavigation,
    SessionHandler
  },

  computed: {
    ...mapState('auth', ['isLoading'])
  },

  methods: {
    ...mapActions('auth', ['checkAuthState'])
  },

  async created() {
    // Check auth state when app loads
    await this.checkAuthState()
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>