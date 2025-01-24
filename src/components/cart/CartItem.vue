<!-- CartItem.vue -->
<template>
  <tr class="cart-item">
    <td class="product-cell">
      <div class="product-info">
        <img 
          :src="item.image_path" 
          :alt="item.title"
          class="product-image"
        >
        <div class="product-details">
          <h5 class="product-title">{{ item.title }}</h5>
          <p class="product-category">{{ item.category }}</p>
        </div>
      </div>
    </td>

    <td class="price-cell">
      ₹{{ formatPrice(item.price) }}
    </td>

    <td class="quantity-cell">
      <span class="quantity">{{ item.quantity }}</span>
    </td>

    <td class="actions-cell">
      <div class="action-controls">
        <button 
          class="action-btn decrease"
          @click="decreaseQuantity"
          title="Decrease quantity"
        >
          <i class="fas fa-minus">-</i>
        </button>
        
        <button 
          class="action-btn increase"
          @click="increaseQuantity"
          :disabled="item.quantity >= 50"
          title="Increase quantity"
        >
          <i class="fas fa-plus">+</i>
        </button>
      </div>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'CartItem',
  
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  
  methods: {
    formatPrice(price) {
      return Number(price).toFixed(2)
    },
    
    decreaseQuantity() {
      const newQuantity = this.item.quantity - 1;
      if (newQuantity === 0) {
        // Remove item from cart when quantity becomes zero
        this.$emit('remove-item', this.item.id);
      } else {
        this.$emit('update-quantity', {
          id: this.item.id,
          quantity: newQuantity
        });
      }
    },
    
    increaseQuantity() {
      if (this.item.quantity < 50) {
        this.$emit('update-quantity', {
          id: this.item.id,
          quantity: this.item.quantity + 1
        });
      }
    }
  }
}
</script>

<style scoped>
.cart-item {
  border-bottom: 1px solid #e9ecef;
}

.product-cell {
  padding: 1rem;
  width: 40%;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.product-details {
  flex: 1;
}

.product-title {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
}

.product-category {
  margin: 0;
  font-size: 0.875rem;
  color: #6c757d;
  text-transform: capitalize;
}

.price-cell {
  padding: 1rem;
  width: 20%;
  font-weight: 600;
  color: #2c3e50;
}

.quantity-cell {
  padding: 1rem;
  width: 15%;
  text-align: center;
}

.quantity {
  font-weight: 500;
  color: #2c3e50;
}

.actions-cell {
  padding: 1rem;
  width: 25%;
}

.action-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: flex-start;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #e8f5e9;
  color: #4CAF50;
}

/* Decrease button - Red theme */
.action-btn.decrease {
  background-color: #fff5f5;
  color: #dc3545;
}

.action-btn.decrease:hover:not(:disabled) {
  background-color: #dc3545;
  color: white;
}

/* Increase button - Green theme */
.action-btn.increase {
  background-color: #e8f5e9;
  color: #4CAF50;
}

.action-btn.increase:hover:not(:disabled) {
  background-color: #4CAF50;
  color: white;
}

.action-btn:hover:not(:disabled) {
  background-color: #4CAF50;
  color: white;
}

.action-btn:disabled {
  background-color: #f8f9fa;
  color: #ced4da;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .product-cell {
    width: 35%;
  }

  .product-image {
    width: 60px;
    height: 60px;
  }

  .price-cell {
    width: 20%;
  }

  .quantity-cell {
    width: 15%;
  }

  .actions-cell {
    width: 30%;
  }

  .action-controls {
    gap: 0.5rem;
  }

  .action-btn {
    width: 28px;
    height: 28px;
  }
}
</style>