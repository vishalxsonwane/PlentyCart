// src/store/modules/products.js
import axios from 'axios'

const state = {
  items: [],
  categories: [], // Added categories state
  loading: false,
  error: null,
  total: 0,
  totalPages: 0,
  currentPage: 1
}

const getters = {
  getProducts: state => state.items,
  getCategories: state => state.categories,
  isLoading: state => state.loading,
  getError: state => state.error
}

const actions = {
  async fetchProducts({ commit }, { category = '', search = '', page = 1, limit = 0 }) {
    try {
      commit('SET_LOADING', true);
      const response = await axios.get('/api/products', {
        params: {
          category,
          search,
          page,
          limit
        }
      });
      commit('SET_PRODUCTS', response.data.products);
      commit('SET_PAGINATION', {
        total: response.data.total,
        totalPages: response.data.pages,
        currentPage: response.data.page
      });
    } catch (error) {
      commit('SET_ERROR', error.message);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async fetchCategories({ commit }) {
    try {
      const categories = [
        { id: 'all', name: 'All' },
        { id: 'fruits', name: 'Fruits' },
        { id: 'vegetables', name: 'Vegetables' },
        { id: 'personalcare', name: 'Personal Care' }
      ]
      commit('SET_CATEGORIES', categories)
    } catch (error) {
      commit('SET_ERROR', error.message)
    }
  },

   // For admin product management
   async fetchAdminProducts({ commit }, { page = 1, limit = 0, category = '', search = '', status = '' }) {
    try {
      commit('SET_LOADING', true);
      const response = await axios.get('/api/admin/products', {
        params: {
          page,
          limit,
          category,
          search,
          status
        }
      });
      commit('SET_PRODUCTS', response.data.products);
      commit('SET_PAGINATION', {
        total: response.data.total,
        totalPages: response.data.totalPages,
        currentPage: response.data.page
      });
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async fetchProduct({ commit }, id) {
    try {
      commit('SET_LOADING', true);
      const response = await axios.get(`/api/admin/products/${id}`);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async createProduct({ commit }, productData) {
    try {
      commit('SET_LOADING', true);
      const response = await axios.post('/api/admin/products', productData);
      commit('ADD_PRODUCT', response.data.product);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async updateProduct({ commit }, { id, data }) {
    try {
      commit('SET_LOADING', true);
      const response = await axios.put(`/api/admin/products/${id}`, data);
      commit('UPDATE_PRODUCT', response.data.product);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async toggleProductStatus({ commit }, id) {
    try {
      commit('SET_LOADING', true);
      const response = await axios.patch(`/api/admin/products/${id}/toggle-status`);
      commit('UPDATE_PRODUCT', response.data.product);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async deleteProduct({ commit }, id) {
    try {
      commit('SET_LOADING', true);
      await axios.delete(`/api/admin/products/${id}`);
      commit('REMOVE_PRODUCT', id);
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
}

const mutations = {
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_PRODUCTS(state, products) {
    state.items = products
  },
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  ADD_PRODUCT(state, product) {
    state.items.push(product)
  },
  REMOVE_PRODUCT(state, productId) {
    state.items = state.items.filter(p => p._id !== productId);
  },
  UPDATE_PRODUCT(state, updatedProduct) {
    const index = state.items.findIndex(p => p._id === updatedProduct._id)
    if (index !== -1) {
      state.items.splice(index, 1, updatedProduct)
    }
  },
  SET_PAGINATION(state, { totalPages, currentPage, total }) {
    state.totalPages = totalPages
    state.currentPage = currentPage
    state.total = total
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}