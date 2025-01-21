<template>
  <div class="cart-container">
    <div v-if="cartItems.length" class="cart-content">
      <div class="cart-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <cart-item
              v-for="item in cartItems"
              :key="item.id"
              :item="item"
              @update-quantity="updateCartQuantity"
              @remove-item="removeCartItem"
            />
          </tbody>
        </table>
      </div>
      <cart-summary
        :subtotal="cartSubtotal"
        :tax="cartTax"
        :shipping="shippingCost"
        :total="cartTotal"
        @checkout="proceedToCheckout"
      />
    </div>
    <div v-else class="empty-cart">
      <div class="empty-cart-content">
        <i class="fas fa-shopping-cart fa-3x mb-4"></i>
        <h3>Your cart is empty</h3>
        <p class="text-muted mb-4">Add items to start shopping</p>
        <router-link :to="{ name: 'home' }" class="continue-shopping-btn">
          Continue Shopping
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import CartItem from './CartItem.vue'
import CartSummary from './CartSummary.vue'

export default {
  name: 'CartList',
  
  components: {
    CartItem,
    CartSummary
  },
  
  data() {
    return {
      shippingCost: 5.99
    }
  },
  
  computed: {
    ...mapState('cart', ['items']),
    
    cartItems() {
      return this.items
    },

    cartSubtotal() {
      return this.cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    },

    cartTax() {
      return this.cartSubtotal * 0.0625
    },

    cartTotal() {
      return this.cartSubtotal + this.cartTax + this.shippingCost
    }
  },
  
  methods: {
    ...mapActions('cart', ['updateCartItem', 'removeFromCart']),
    
    updateCartQuantity({ id, quantity }) {
      this.updateCartItem({ id, quantity })
    },

    removeCartItem(itemId) {
      this.removeFromCart(itemId)
    },
    
    proceedToCheckout() {
      if (this.cartItems.length) {
        this.$router.push({ name: 'checkout' })
      }
    }
  }
}
</script>

<style scoped>
.cart-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  padding: 2rem;
}

.cart-table {
  background: white;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

th {
  padding: 1rem;
  text-align: left;
  color: #2c3e50;
  font-weight: 600;
  border-bottom: 2px solid #e9ecef;
}

.empty-cart {
  padding: 4rem 2rem;
  text-align: center;
  background: white;
}

.empty-cart-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-cart i {
  color: #6c757d;
  margin-bottom: 1rem;
}

.empty-cart h3 {
  color: #2c3e50;
  margin: 1rem 0;
  font-size: 1.5rem;
}

.empty-cart p {
  color: #6c757d;
  margin-bottom: 2rem;
}

.continue-shopping-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.continue-shopping-btn:hover {
  background-color: #45a049;
  color: white;
}

@media (max-width: 992px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .cart-content {
    padding: 1rem;
  }
  
  th, td {
    padding: 0.75rem;
  }
  
  .empty-cart {
    padding: 2rem 1rem;
  }
}
</style>