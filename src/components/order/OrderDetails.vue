<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Order Details</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading order details...</p>
      </div>

      <div v-else-if="order" class="modal-body">
        <div class="order-details-wrapper">
          <div class="order-info-section">
            <h5 class="mb-3">Order Information</h5>
            <p class="mb-2"><strong>Order ID:</strong> #{{ order.orderId }}</p>
            <p class="mb-2"><strong>Order Date:</strong> {{ formatDate(order.date) }}</p>
            <p class="mb-2"><strong>Order Time:</strong> {{ order.time }}</p>
            <p class="mb-2">
              <strong>Status:</strong>
              <span :class="['status', order.payment_status ? 'paid' : 'pending']">
                {{ order.payment_status ? 'Paid' : 'Pending' }}
              </span>
            </p>
          </div>

          <div class="shipping-info-section">
            <h5 class="mb-3">Shipping Information</h5>
            <p class="mb-2"><strong>Name:</strong> {{ order.user_name }}</p>
            <p class="mb-2"><strong>Address:</strong> {{ order.user_address }}</p>
            <p class="mb-2"><strong>State:</strong> {{ order.user_state }}</p>
            <p class="mb-2"><strong>Zip Code:</strong> {{ order.user_zipcode }}</p>
          </div>
        </div>

        <div class="order-items mt-4">
          <h5 class="mb-3">Order Items</h5>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th class="text-center">Quantity</th>
                  <th class="text-end">Price</th>
                  <th class="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in order.products" :key="item.title">
                  <td>
                    <!-- <div class="d-flex align-items-center">
                      <img :src="'/' + item.imagePath" class="product-image me-3" :alt="item.title" />
                      <span class="product-title">{{ item.title }}</span>
                    </div> -->
                    <div class="product-cell">
                      <img :src="'/' + item.imagePath" class="product-image" :alt="item.title" />
                      <span class="product-name">{{ item.title }}</span>
                    </div>
                  </td>
                  <td class="text-center">{{ item.quantity }}</td>
                  <td class="text-end">₹{{ formatPrice(item.total_product_price / item.quantity) }}</td>
                  <td class="text-end">₹{{ formatPrice(item.total_product_price) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="order-summary">
          <h5 class="mb-3">Order Summary</h5>
          <div class="summary-details">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>₹{{ formatPrice(order.total_price - 5.99) }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping:</span>
              <span>₹5.99</span>
            </div>
            <div class="summary-row total">
              <strong>Total:</strong>
              <strong>₹{{ formatPrice(order.total_price) }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-5">
        <p class="text-danger">Order not found</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { formatDate } from '@/utils/formatters'

export default {
  name: 'OrderDetails',
  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState('orders', {
      order: state => state.currentOrder,
      loading: state => state.loading
    })
  },
  async created() {
    if (this.orderId) {
      try {
        await this.fetchOrderDetails(this.orderId)
      } catch (error) {
        console.error('Failed to fetch order details:', error)
      }
    }
  },
  methods: {
    ...mapActions('orders', ['fetchOrderDetails']),
    formatPrice(price) {
      return Number(price).toFixed(2);
    },
    formatDate,
    closeModal() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  border-radius: 8px;
  overflow-y: auto;
  position: relative;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
}

.close-button {
  border: none;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  color: #6c757d;
}

.close-button:hover {
  color: #000;
}

.modal-body {
  padding: 1.5rem;
}

/* Rest of your existing styles... */
.order-details-wrapper {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.order-info-section,
.shipping-info-section {
  flex: 1;
  padding: 15px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

/* More specific selector */
.product-cell .product-name {
  padding-top: 12px;
  display: inline-block;
}

/* Or add !important if needed */
.product-name {
  padding-top: 12px !important;
}

.order-summary {
  margin-top: 20px;
  border-top: 1px solid #dee2e6;
  padding-top: 20px;
}
.order-summary h5 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.product-title {
  padding-top: 4px;  /* Fine-tune text position */
}

.summary-details {
  width: 300px;
  margin-left: auto;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.summary-row.total {
  border-top: 1px solid #dee2e6;
  padding-top: 10px;
  margin-top: 10px;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
}

.status.paid {
  background: #D1E7DD;
  color: #0F5132;
}

.status.pending {
  background: #FFF3CD;
  color: #856404;
}

@media (max-width: 768px) {
  .order-details-wrapper {
    flex-direction: column;
  }
  
  .summary-details {
    width: 100%;
  }
}

.order-items {
  margin: 20px 0;
}

.order-items table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background-color: #fff;
}

.order-items th {
  background-color: #f8f9fa;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
}

.order-items td {
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;
}

/* Product column with image and title */
.product-cell {
  display: flex;
  align-items: flex-start;  /* Change from center to flex-start */
  gap: 12px;
  padding-top: 8px; 
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  margin-top: -4px;  
}

/* Column alignments */
.quantity-column {
  text-align: center;
}

.price-column,
.total-column {
  text-align: right;
}

/* Headers */
.order-items h5 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

/* Responsive table */
@media (max-width: 768px) {
  .order-items {
    overflow-x: auto;
  }
  
  .order-items table {
    min-width: 600px;
  }
}
</style>