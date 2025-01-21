// src/store/modules/users.js
import axios from 'axios';

const state = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  userManagementFilters: {
    page: 1,
    limit: 10,
    role: '',
    dateFilter: '',
  },
};

const getters = {
  getUsers: (state) => state.users,
  getCurrentUser: (state) => state.currentUser,
  isLoading: (state) => state.loading,
};

const actions = {
  async fetchAllUsers({ commit, state }) {
    try {
      commit('SET_LOADING', true);
      const { page, limit, role, dateFilter } = state.userManagementFilters;
      const response = await axios.get('/api/admin/users', {
        params: { page, limit, role, dateFilter },
      });
      commit('SET_USERS', response.data.users);
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async resetUserPassword({ commit }, userId) {
    try {
      await axios.post(`/api/admin/users/${userId}/reset-password`);
    } catch (error) {
      console.error('Error resetting user password:', error);
      throw error;
    }
  },

  async toggleUserStatus({ commit, state }, userId) {
    try {
      await axios.patch(`/api/admin/users/${userId}/suspend`);
      const { page, limit, role, dateFilter } = state.userManagementFilters;
      const response = await axios.get('/api/admin/users', {
        params: { page, limit, role, dateFilter },
      });
      commit('SET_USERS', response.data.users);
    } catch (error) {
      console.error('Error suspending/activating user:', error);
      throw error;
    }
  },

  async fetchUserDetails({ commit }, userId) {
    try {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null); // Clear any previous errors

      const response = await axios.get(`/api/users/${userId}`);

      if (response.data) {
        commit('SET_CURRENT_USER', response.data);
        return response.data;
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  clearCurrentUser({ commit }) {
    commit('SET_CURRENT_USER', null);
  },

  updateUserManagementFilters({ commit }, filters) {
    commit('SET_USER_MANAGEMENT_FILTERS', filters);
  },

  async updateUserProfile({ commit, dispatch }, payload) {
    try {
      const response = await axios.patch(`/api/users/${payload.userId}/update-profile`, payload);
      commit('SET_CURRENT_USER', response.data.user);

      // Update user in auth store
      dispatch('auth/updateAuthUser', response.data.user, { root: true });

      return response.data.user;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  async updateUserPassword({ commit }, { userId, newPassword }) {
    try {
      await axios.patch(`/api/users/${userId}/update-password`, {
        newPassword,
      });
      // Optionally, you can fetch the updated user details and commit the changes
      // const updatedUser = await dispatch('fetchUserDetails', userId);
      // commit('SET_CURRENT_USER', updatedUser);
    } catch (error) {
      console.error('Error updating user password:', error);
      throw error;
    }
  },
};

const mutations = {
  SET_LOADING(state, status) {
    state.loading = status;
  },

  SET_ERROR(state, error) {
    state.error = error;
  },

  SET_USERS(state, users) {
    state.users = users;
  },

  SET_CURRENT_USER(state, user) {
    state.currentUser = user;
  },

  SET_USER_MANAGEMENT_FILTERS(state, filters) {
    state.userManagementFilters = filters;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};