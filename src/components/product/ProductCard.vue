<!-- ProductCard.vue -->
<template>
  <div class="product-card">
    <div class="product-image-container">
      <img 
        :src="product.imagePath" 
        :alt="product.title"
        class="product-image"
      >
      <div class="category-badge">{{ product.category }}</div>
    </div>

    <div class="product-content">
      <h3 class="product-title">{{ product.title }}</h3>
      
      <p class="product-description">{{ product.product_description }}</p>
      
      <div class="product-price">
        <span class="price">₹{{ formatPrice(product.price) }}</span>
        <span class="price-description">{{ product.price_description }}</span>
      </div>

      <div class="product-actions">
        <div class="quantity-control">
          <button 
            class="quantity-btn"
            @click="decreaseQuantity"
            :disabled="quantity <= 1"
          >
            <i class="fas fa-minus">-</i>
          </button>
          <input
            v-model.number="quantity"
            type="number"
            min="1"
            max="50"
            class="quantity-input"
          >
          <button 
            class="quantity-btn"
            @click="increaseQuantity"
            :disabled="quantity >= 50"
          >
            <i class="fas fa-plus">+</i>
          </button>
        </div>

        <button 
          class="add-to-cart-btn"
          @click="addToCart"
        >
          <i class="fas fa-shopping-cart"></i>
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ProductCard',
  
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  
  data() {
    return {
      quantity: 1
    }
  },
  
  methods: {
    ...mapActions('cart', ['addItemToCart']),
    
    formatPrice(price) {
      return price.toFixed(2)
    },

    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    },

    increaseQuantity() {
      if (this.quantity < 50) {
        this.quantity++
      }
    },
    
    async addToCart() {
      if (this.quantity > 0 && this.quantity <= 50) {
        try {
          await this.addItemToCart({
            product: this.product,
            quantity: this.quantity
          })
          this.$toast.success('Added to cart successfully')
        } catch (error) {
          this.$toast.error('Failed to add item to cart')
        }
      }
    }
  }
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

.product-image-container {
  position: relative;
  padding-top: 75%;
  overflow: hidden;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.category-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  background-color: rgba(44, 62, 80, 0.85);
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  text-transform: capitalize;
}

.product-content {
  padding: 1.5rem;
}

.product-title {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.product-description {
  color: #6c757d;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.price {
  font-size: 1.25rem;
  font-weight: 600;
  color: #4CAF50;
}

.price-description {
  color: #6c757d;
  font-size: 0.9rem;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.quantity-btn {
  background: none;
  border: none;
  color: #4CAF50;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.quantity-btn:disabled {
  color: #cbd5e0;
  cursor: not-allowed;
}

.quantity-btn:hover:not(:disabled) {
  color: #45a049;
}

.quantity-input {
  width: 3rem;
  text-align: center;
  border: none;
  padding: 0.25rem;
  color: #2c3e50;
  -moz-appearance: textfield;
}

.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.add-to-cart-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-to-cart-btn:hover {
  background-color: #45a049;
}

@media (max-width: 768px) {
  .product-content {
    padding: 1rem;
  }

  .product-title {
    font-size: 1rem;
  }

  .product-description {
    font-size: 0.9rem;
  }

  .price {
    font-size: 1.1rem;
  }
}
</style>