// src/store/modules/cart.js
import axios from 'axios'

const state = {
  items: [],
  itemCount: 0,
  loading: false,
  error: null
}

const getters = {
  cartItems: state => state.items,
  itemCount: state => state.itemCount,
  
  cartSubtotal: (state) => {
    return state.items.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  },
  
  cartTax: (state, getters) => {
    return getters.cartSubtotal * 0.0625
  },
  
  cartTotal: (state, getters) => {
    return getters.cartSubtotal + getters.cartTax + 5.99 // shipping
  }
}

const actions = {
  async clearCart({ commit }) {
    try {
      // Clear cart on server
      await axios.post('/api/cart/clear', {}, { withCredentials: true });
    } catch (error) {
      console.error('Failed to clear cart on server:', error);
    } finally {
      // Always clear local cart state
      commit('CLEAR_CART');
    }
  },

  async addItemToCart({ commit }, { product, quantity }) {
    try {
      commit('SET_LOADING', true)
      
      // Make API call to add item to cart
      const response = await axios.post('/api/cart/add', {
        productId: product._id,
        quantity: quantity
      })
      
      // If API call successful, update local state
      commit('ADD_CART_ITEM', {
        id: product._id,
        title: product.title,
        price: product.price,
        quantity,
        imagePath: product.imagePath,
        category: product.category
      })
      
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw new Error('Failed to add item to cart')
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async updateCartItem({ commit }, { id, quantity }) {
    try {
      commit('SET_LOADING', true)
      
      // Make API call to update cart item
      await axios.put(`/api/cart/items/${id}`, { quantity })
      
      commit('UPDATE_CART_ITEM', { id, quantity })
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw new Error('Failed to update cart item')
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async removeFromCart({ commit }, itemId) {
    try {
      commit('SET_LOADING', true)
      
      // Make API call to remove item
      await axios.delete(`/api/cart/items/${itemId}`)
      
      commit('REMOVE_CART_ITEM', itemId)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw new Error('Failed to remove item from cart')
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Fetch cart items from server
  async fetchCartItems({ commit }) {
    try {
      commit('SET_LOADING', true)
      const response = await axios.get('/api/cart')
      commit('SET_CART_ITEMS', response.data.items)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const mutations = {
  SET_LOADING(state, status) {
    state.loading = status
  },

  CLEAR_CART(state) {
    state.items = [];
    state.itemCount = 0;
  },

  SET_ERROR(state, error) {
    state.error = error
  },

  SET_CART_ITEMS(state, items) {
    state.items = items
    state.itemCount = items.reduce((count, item) => count + item.quantity, 0)
  },

  ADD_CART_ITEM(state, item) {
    const existingItem = state.items.find(i => i.id === item.id)
    if (existingItem) {
      existingItem.quantity += item.quantity
    } else {
      state.items.push(item)
    }
    state.itemCount = state.items.reduce((count, item) => count + item.quantity, 0)
  },
  
  UPDATE_CART_ITEM(state, { id, quantity }) {
    const item = state.items.find(i => i.id === id)
    if (item) {
      item.quantity = quantity
      state.itemCount = state.items.reduce((count, item) => count + item.quantity, 0)
    }
  },
  
  REMOVE_CART_ITEM(state, itemId) {
    state.items = state.items.filter(item => item.id !== itemId)
    state.itemCount = state.items.reduce((count, item) => count + item.quantity, 0)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}