<!-- CartSummary.vue -->
<template>
  <div class="cart-summary">
    <h4 class="summary-title">Order Summary</h4>
    <div class="summary-items">
      <div class="summary-item">
        <span>Subtotal</span>
        <span>₹{{ formatPrice(subtotal) }}</span>
      </div>
      <div class="summary-item">
        <span>Shipping</span>
        <span>₹{{ formatPrice(shipping) }}</span>
      </div>
      <div class="summary-item">
        <span>Tax (6.25%)</span>
        <span>₹{{ formatPrice(tax) }}</span>
      </div>
      <div class="summary-item total">
        <span>Total</span>
        <span>₹{{ formatPrice(total) }}</span>
      </div>
    </div>
    <div class="summary-actions">
      <button class="checkout-btn" @click="handleCheckout" :disabled="!cartHasItems">
        Proceed to Checkout
      </button>
      <router-link to="/" class="continue-btn">
        Continue Shopping
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CartSummary',

  props: {
    subtotal: {
      type: Number,
      required: true
    },
    shipping: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },

  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    cartHasItems() {
      return this.total > 0
    }
  },

  methods: {
    formatPrice(price) {
      return Number(price).toFixed(2)
    },

    handleCheckout() {
      if (!this.isAuthenticated) {
        // If not authenticated, redirect to login with return URL
        this.$router.push({
          name: 'login',
          query: { redirect: '/checkout' }
        })
      } else {
        // If authenticated, proceed to checkout
        this.$router.push({ name: 'checkout' })
      }
    }
  }
}
</script>

<style scoped>
.cart-summary {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
}

.summary-title {
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.summary-items {
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  color: #2c3e50;
}

.summary-item:not(:last-child) {
  border-bottom: 1px solid #dee2e6;
}

.total {
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 2px solid #dee2e6;
}

.summary-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.checkout-btn:hover {
  background-color: #45a049;
}

.continue-btn {
  width: 100%;
  padding: 1rem;
  background-color: transparent;
  color: #2c3e50;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
}

.continue-btn:hover {
  background-color: #e9ecef;
  border-color: #adb5bd;
}

@media (max-width: 768px) {
  .cart-summary {
    padding: 1.5rem;
  }

  .summary-title {
    font-size: 1.15rem;
    margin-bottom: 1rem;
  }

  .summary-item {
    padding: 0.5rem 0;
    font-size: 0.95rem;
  }

  .total {
    font-size: 1rem;
  }

  .checkout-btn,
  .continue-btn {
    padding: 0.75rem;
  }
}
.checkout-btn:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}
</style>