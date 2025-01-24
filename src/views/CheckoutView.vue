<!-- CheckoutView.vue -->
<template>
  <div class="checkout-view">
    <the-navigation />

    <main class="main-content">
      <div class="container">
        <h1 class="page-title">Checkout</h1>

        <div class="checkout-layout">
          <!-- Left Column: Forms -->
          <div class="checkout-form-section">
            <!-- Shipping Address -->
            <div class="form-card">
              <div class="form-header">
                <h2>Shipping Address</h2>
              </div>
              <shipping-address-fields @address-updated="updateShippingAddress" />
            </div>

            <!-- Payment Method -->
            <div class="form-card">
              <div class="form-header">
                <h2>Payment Method</h2>
              </div>
              <payment-method-selector @payment-method-changed="updatePaymentMethod" />

              <!-- Credit Card Fields -->
              <div v-if="selectedPaymentMethod === 'credit-card'" class="mt-6">
                <credit-card-fields @card-details-updated="updateCardDetails" />
              </div>
            </div>

            <!-- Submit Button -->
            <button class="submit-order-btn" :disabled="!isFormValid || isProcessing" @click="handleSubmit">
              <i class="fas fa-lock mr-2"></i>
              {{ isProcessing ? 'Processing...' : 'Place Order' }}
            </button>
          </div>

          <!-- Right Column: Order Summary -->
          <div class="order-summary-section">
            <div class="summary-card">
              <order-summary-details :cart-items="cartItems" :subtotal="cartSubtotal" :shipping="shippingCost"
                :tax="cartTax" :total="cartTotal" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import ShippingAddressFields from '@/components/checkout/ShippingAddressFields.vue'
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector.vue'
import CreditCardFields from '@/components/checkout/CreditCardFields.vue'
import OrderSummaryDetails from '@/components/checkout/OrderSummaryDetails.vue'

export default {
  name: 'CheckoutView',

  components: {
    ShippingAddressFields,
    PaymentMethodSelector,
    CreditCardFields,
    OrderSummaryDetails
  },

  data() {
    return {
      shippingAddress: null,
      selectedPaymentMethod: 'cod', // Default to COD
      cardDetails: null,
      isProcessing: false,
      shippingCost: 5.99
    }
  },

  computed: {
    ...mapState({
      cartItems: state => state.cart.items,
      user: state => state.auth.user
    }),
    ...mapGetters('cart', [
      'cartSubtotal',
      'cartTax',
      'cartTotal'
    ]),

    isFormValid() {
      return this.shippingAddress &&
        this.selectedPaymentMethod &&
        (this.selectedPaymentMethod !== 'credit-card' || this.cardDetails)
    }
  },

  methods: {
    ...mapActions('orders', ['submitOrder']),
    ...mapActions('cart', ['clearCart']),

    updateShippingAddress(address) {
      this.shippingAddress = address
    },

    updatePaymentMethod(method) {
      this.selectedPaymentMethod = method
      if (method !== 'credit-card') {
        this.cardDetails = null
      }
    },

    updateCardDetails(details) {
      this.cardDetails = details
    },

    async handleSubmit() {
      if (!this.isFormValid) return

      this.isProcessing = true

      try {
        // Format products according to the schema
        const formattedProducts = this.cartItems.map(item => ({
          title: item.title,
          quantity: item.quantity,
          category: item.category,
          image_path: item.image_path,
          total_product_price: item.price * item.quantity
        }));

        // Get current date and time
        const now = new Date();
        const currentDate = now.toLocaleDateString('en-GB'); // format: DD/MM/YYYY
        const currentTime = now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        });

        const orderData = {
          user_email: this.user?.email,
          user_name: `${this.shippingAddress.firstName} ${this.shippingAddress.lastName}`,
          products: formattedProducts,
          user_address: `${this.shippingAddress.street}`,
          user_zipcode: this.shippingAddress.zipCode,
          user_country: 'US', // Default to US for now
          user_state: this.shippingAddress.state,
          total_price: this.cartTotal,
          payment_status: this.selectedPaymentMethod === 'cod' ? false : true,
          date: currentDate,
          time: currentTime,
          payment_method: this.selectedPaymentMethod
        }

        console.log('Submitting order with data:', orderData);

        await this.submitOrder(orderData)
        await this.clearCart()

        this.$toast?.success('Order placed successfully!') || alert('Order placed successfully!')

        this.$router.push({ name: 'home' })
      } catch (error) {
        console.error('Checkout error:', error)
        this.$toast?.error('Failed to process order. Please try again.') || alert('Failed to process order. Please try again.')
      } finally {
        this.isProcessing = false
      }
    }

  }
}
</script>

<style scoped>
.checkout-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  padding-top: 6rem;
  padding-bottom: 3rem;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
}

.checkout-form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-card,
.summary-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-card {
  padding: 1.5rem;
}

.form-header {
  margin-bottom: 1.5rem;
}

.form-header h2 {
  font-size: 1.25rem;
  color: #2c3e50;
  font-weight: 600;
}

.submit-order-btn {
  padding: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.submit-order-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.submit-order-btn:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

.order-summary-section {
  position: sticky;
  top: 7rem;
  height: fit-content;
}

.summary-card {
  padding: 1.5rem;
}

@media (max-width: 1024px) {
  .checkout-layout {
    grid-template-columns: 1fr 320px;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }

  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .form-card,
  .summary-card {
    padding: 1rem;
  }

  .order-summary-section {
    position: static;
  }
}
</style>