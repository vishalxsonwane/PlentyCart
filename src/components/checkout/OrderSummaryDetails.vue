<!-- OrderSummaryDetails.vue -->
<template>
  <div class="order-summary">
    <h3 class="summary-title">
      <i class="fas fa-shopping-cart"></i>
      Order Summary
    </h3>
    
    <!-- Items List -->
    <div class="items-list">
      <div 
        v-for="item in cartItems" 
        :key="item.id" 
        class="item"
      >
        <div class="item-info">
          <img 
            :src="item.image_path" 
            :alt="item.title" 
            class="item-image"
          />
          <div class="item-details">
            <h4 class="item-title">{{ item.title }}</h4>
            <div class="item-meta">
              <span class="item-quantity">Qty: {{ item.quantity }}</span>
              <span class="item-unit-price">₹{{ formatPrice(item.price) }} each</span>
            </div>
          </div>
        </div>
        <div class="item-price">
          ₹{{ formatPrice(item.price * item.quantity) }}
        </div>
      </div>
    </div>
    
    <!-- Price Breakdown -->
    <div class="price-breakdown">
      <div class="price-row">
        <span>Subtotal</span>
        <span>₹{{ formatPrice(subtotal) }}</span>
      </div>
      
      <div class="price-row">
        <span>Shipping</span>
        <span>₹{{ formatPrice(shipping) }}</span>
      </div>
      
      <div class="price-row">
        <span>Tax (6.25%)</span>
        <span>₹{{ formatPrice(tax) }}</span>
      </div>
      
      <div class="price-row total">
        <span>Total</span>
        <span>₹{{ formatPrice(total) }}</span>
      </div>
    </div>

    <!-- Secure Checkout Notice -->
    <div class="secure-notice">
      <i class="fas fa-lock"></i>
      <p>Secure Checkout - Your data is protected</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'OrderSummaryDetails',

  computed: {
    ...mapState({
      cartItems: state => state.cart.items,
      shippingCost: () => 5.99
    }),
    ...mapGetters('cart', [
      'cartSubtotal',
      'cartTax',
      'cartTotal'
    ]),
    subtotal() {
      return this.cartSubtotal || 0
    },
    shipping() {
      return this.shippingCost
    },
    tax() {
      return this.cartTax || 0
    },
    total() {
      return (this.subtotal + this.shipping + this.tax) || 0
    }
  },
  
  methods: {
    formatPrice(price) {
      return Number(price).toFixed(2)
    }
  }
}
</script>

<style scoped>
.order-summary {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.summary-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  color: #2c3e50;
  font-weight: 600;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.summary-title i {
  color: #4CAF50;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.item-info {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex: 1;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.item-details {
  flex: 1;
}

.item-title {
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.item-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.item-quantity {
  color: #4CAF50;
  font-weight: 500;
}

.item-unit-price {
  color: #6b7280;
}

.item-price {
  font-weight: 600;
  color: #2c3e50;
}

.price-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.price-row {
  display: flex;
  justify-content: space-between;
  color: #4a5568;
  font-size: 0.95rem;
}

.price-row.total {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  padding-top: 0.75rem;
  margin-top: 0.5rem;
  border-top: 2px solid #e2e8f0;
}

.secure-notice {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f0fdf4;
  border-radius: 8px;
  color: #166534;
}

.secure-notice i {
  font-size: 1.1rem;
}

.secure-notice p {
  font-size: 0.9rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .order-summary {
    padding: 1rem;
  }

  .item {
    padding: 0.75rem;
  }

  .item-image {
    width: 50px;
    height: 50px;
  }

  .item-title {
    font-size: 0.95rem;
  }

  .price-row.total {
    font-size: 1.1rem;
  }
}
</style>