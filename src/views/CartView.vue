<!-- CartView.vue -->
<template>
  <div class="cart-view">
    <the-navigation />
    <main class="main-content">
      <div class="container">
        <h1 class="page-title">Shopping Cart</h1>
        <cart-list
          :cart-items="cartItems"
          :loading="loading"
          @update-quantity="handleUpdateQuantity"
          @remove-item="handleRemoveItem"
          @checkout="proceedToCheckout"
        />
      </div>
    </main>
    <the-footer />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import CartList from '@/components/cart/CartList.vue'

export default {
  name: 'CartView',
  
  components: {
    TheHeader,
    TheFooter,
    CartList
  },
  
  computed: {
    ...mapState('cart', ['cartItems', 'loading'])
  },
  
  methods: {
    ...mapActions('cart', ['updateCartItem', 'removeCartItem']),
    
    async handleUpdateQuantity({ itemId, quantity }) {
      try {
        await this.updateCartItem({ itemId, quantity })
        this.$toast.success('Cart updated')
      } catch (error) {
        this.$toast.error('Failed to update cart')
      }
    },
    
    async handleRemoveItem(itemId) {
      try {
        await this.removeCartItem(itemId)
        this.$toast.success('Item removed from cart')
      } catch (error) {
        this.$toast.error('Failed to remove item')
      }
    },
    
    proceedToCheckout() {
      if (!this.$store.getters['auth/isAuthenticated']) {
        this.$router.push({
          name: 'login',
          query: { redirect: '/checkout' }
        })
      } else {
        this.$router.push({ name: 'checkout' })
      }
    }
  }
}
</script>

<style scoped>
.main-content {
  padding-top: 6rem;
  min-height: calc(100vh - 6rem);
  background-color: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }
}
</style>