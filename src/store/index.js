// src/store/index.js
import { createStore } from 'vuex'
import auth from './modules/auth'
import products from './modules/products'
import orders from './modules/orders'
import users from './modules/users'
import cart from './modules/cart'

const store = createStore({
  modules: {
    auth,
    products,
    orders,
    users,
    cart
  }
})

export default store;