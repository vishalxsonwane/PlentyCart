<template>
    <div class="product-list">
      <div class="row">
        <div 
          v-for="product in products"
          :key="product._id"
          class="col-md-4 col-sm-6 mb-4"
        >
          <product-card
            :product="product"
            @add-to-cart="addToCart"
          />
        </div>
      </div>
      
      <div v-if="loading" class="text-center">
        <div class="loading-spinner">
        <span class="spinner-border" role="status"></span>
        <span>Loading products...</span>
      </div>
    </div>
    
    <div v-else-if="!products.length" class="text-center">
      <p>No products found matching your criteria.</p>
    </div>
    
    <pagination-controls
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="$emit('page-change', $event)"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ProductCard from './ProductCard.vue'
import PaginationControls from '../shared/PaginationControls.vue'

export default {
  name: 'ProductList',
  
  components: {
    ProductCard,
    PaginationControls
  },
  
  props: {
    products: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  
  methods: {
    ...mapActions('cart', ['addToCart']),
    
    handleAddToCart(productData) {
      this.addToCart(productData)
        .then(() => {
          this.$toast.success('Added to cart successfully')
        })
        .catch(() => {
          this.$toast.error('Failed to add item to cart')
        })
    }
  }
}
</script>