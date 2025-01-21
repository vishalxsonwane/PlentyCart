// src/store/modules/orders.js
import axios from 'axios'

const state = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null
}

const getters = {
  getOrders: state => state.orders,
  getCurrentOrder: state => state.currentOrder,
  isLoading: state => state.loading
}

const actions = {
  async submitOrder({ commit }, orderData) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.post('/api/orders', orderData, {
        withCredentials: true
      })
      
      if (response.data.order) {
        commit('SET_CURRENT_ORDER', response.data.order)
        
        // If COD, show specific success message
        if (orderData.paymentMethod === 'cod') {
          commit('SET_SUCCESS_MESSAGE', 'Order placed successfully! You will pay on delivery.')
        }
        
        return response.data.order
      } else {
        throw new Error('No order data in response')
      }
    } catch (error) {
      console.error('Order submission error:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchOrders({ commit }) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get('/api/orders')
      commit('SET_ORDERS', response.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchAllOrders({ commit }, { page = 1, limit = 10, status = '', dateFilter = '' } = {}) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get('/api/admin/orders', {
        params: { page, limit, status, dateFilter },
        withCredentials: true
      });
      commit('SET_ORDERS', response.data.orders)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async cancelOrder({ commit }, orderId) {
    try {
      const response = await axios.post(`/api/orders/${orderId}/cancel`);
      commit('UPDATE_ORDER_STATUS', { 
        orderId, 
        status: 'Cancelled' 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateOrderStatus({ commit }, { orderId, status }) {
    try {
      await axios.patch(`/api/admin/orders/${orderId}/status`, { status })
      // Optionally, you can refetch the orders after the update
      // commit('SET_ORDERS', updatedOrders)
    } catch (error) {
      console.error('Error updating order status:', error)
      throw error
    }
  },

  async refundOrder({ commit }, orderId) {
    try {
      await axios.post(`/api/admin/orders/${orderId}/refund`)
      // Optionally, you can refetch the orders after the refund
      // commit('SET_ORDERS', updatedOrders)
    } catch (error) {
      console.error('Error refunding order:', error)
      throw error
    }
  },

  async fetchOrderDetails({ commit }, orderId) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null) // Clear any previous errors
      
      const response = await axios.get(`/api/orders/detail/${orderId}`, {
        withCredentials: true
      });
      
      if (response.data) {
        commit('SET_CURRENT_ORDER', response.data)
        return response.data
      } else {
        throw new Error('Order not found')
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  clearCurrentOrder({ commit }) {
    commit('SET_CURRENT_ORDER', null)
  },
}

const mutations = {
  SET_LOADING(state, status) {
    state.loading = status
  },

  SET_ERROR(state, error) {
    state.error = error
  },

  SET_ORDERS(state, orders) {
    state.orders = orders
  },

  SET_CURRENT_ORDER(state, order) {
    state.currentOrder = order
  },
  UPDATE_ORDER_STATUS(state, { orderId, status }) {
    const orderIndex = state.orders.findIndex(order => order.orderId === orderId);
    if (orderIndex !== -1) {
      state.orders[orderIndex].order_status = status;
    }
  },

  SET_SUCCESS_MESSAGE(state, message) {
    state.successMessage = message
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}