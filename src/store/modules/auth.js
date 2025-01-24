// src/store/modules/auth.js
import axios from 'axios'
import router from '@/router/vueRouter'

const state = {
  isAuthenticated: false,
  isAdmin: false,
  error: null,
  isLoading: true,
  user: null  // Add explicit user initialization
}

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  isAdmin: state => state.isAdmin,
  authError: state => state.error,
  currentUser: state => state.user,
  isLoading: state => state.isLoading
}

const actions = {
  async checkSession({ commit, dispatch }) {
    try {
      const response = await axios.get('/api/auth/me', { 
        withCredentials: true 
      });
      
      if (response.data.user) {
        commit('SET_USER', response.data.user);
        commit('SET_SESSION_EXPIRED', false);
      } else {
        // Session expired
        await dispatch('handleSessionExpired');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        await dispatch('handleSessionExpired');
      }
    }
  },

  async handleSessionExpired({ commit }) {
    // Only show session expired message if user was previously logged in
    const wasLoggedIn = sessionStorage.getItem('isAuthenticated');
    
    commit('CLEAR_USER');
    sessionStorage.clear();
    
    if (wasLoggedIn) {
      window.$toast?.error('Your session has expired. Please login again.');
    }
    
    if (router.currentRoute.value.name !== 'login') {
      router.push('/login');
    }
  },

  clearSessionExpired({ commit }) {
    commit('SET_SESSION_EXPIRED', false);
  },

  async login({ commit }, credentials) {
    try {
      const response = await axios.post('/api/auth/login', credentials, {
        withCredentials: true
      });
      if (response.data.status) {
        commit('SET_AUTH_STATE', response.data.user);
      }
      else {
        commit('SET_ERROR', response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    }
  },

  async register({ commit }, userData) {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
      
      const response = await axios.post('/api/auth/register', userData, config);
      
      if (response.data.user) {
        return response.data.user;
      } else {
        throw new Error('No user data in response');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      console.error('Registration error:', error);
      throw new Error(message);
    }
  },

  async logout({ commit }) {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } finally {
      commit('CLEAR_AUTH_STATE');
      commit('CLEAR_USER'); // Add this
      sessionStorage.clear(); // Add this
    }
  },

  async checkAuthState({ commit }) {
    try {
      commit('SET_LOADING', true);
      commit('CLEAR_USER');
      const response = await axios.get('/api/auth/me', { withCredentials: true });
      
      if (response.data.user) {
        commit('SET_AUTH_STATE', response.data.user);
        commit('SET_USER', response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        commit('CLEAR_AUTH_STATE');
        commit('CLEAR_USER');
      }
    } finally {
      commit('SET_LOADING', false);
    }
  },

  updateAuthUser({ commit }, user) {
    commit('SET_USER', user);
    // Update session storage with new user data
    sessionStorage.setItem('user', JSON.stringify(user));
  },
}

const mutations = {
  SET_AUTH_STATE(state, user) {
    state.isAuthenticated = true;
    state.isAdmin = user.is_admin;
  },

  CLEAR_AUTH_STATE(state) {
    state.isAuthenticated = false;
    state.isAdmin = false;
  },
  SET_LOADING(state, value) {
    state.isLoading = value;
  },

  SET_SESSION_EXPIRED(state, value) {
    state.sessionExpired = value;
  },
  
  SET_USER(state, user) {
    state.user = user;
    state.isAuthenticated = true;
    state.isAdmin = user?.is_admin || false;
  },

  CLEAR_USER(state) {
    state.user = null;
    state.isAuthenticated = false;
    state.isAdmin = false;
  },

  SET_ERROR(state, error) {
    state.error = error;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}