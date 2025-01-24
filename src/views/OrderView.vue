<template>
  <div class="orders-container">
    <div class="header">
      <h1>Order History</h1>
      <router-link to="/" class="continue-shopping">
        Continue Shopping
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Orders Grid -->
    <div v-else class="orders-grid">
      <div v-for="order in orders" :key="order.order_id" class="order-card">
        <div class="order-header">
          <h3>Order #{{ order.order_id }}</h3>
          <span :class="['status', getStatusClass(order.order_status)]">
            {{ order.order_status }}
          </span>
        </div>
        <div class="order-info">
          <p>{{ formatDate(order.date) }} at {{ order.time }}</p>
          <p>Total Amount: ₹{{ formatPrice(order.total_price) }}</p>
          <p>Items: {{ order.products.length }}</p>
        </div>
        <div class="order-actions">
          <button class="view-details-btn" @click="viewOrderDetails(order.order_id)">
            View Details
          </button>
          <button 
            v-if="order.order_status === 'Pending'" 
            class="cancel-order-btn" 
            @click="cancelOrder(order.order_id)"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && orders.length === 0" class="empty-state">
      <p>No orders found</p>
      <router-link to="/" class="continue-shopping">
        Start Shopping
      </router-link>
    </div>
    <OrderDetails
      v-if="showOrderDetails"
      :order_id="selectedOrderId"
      @close="showOrderDetails = false"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { formatDate } from '@/utils/formatters'
import OrderDetails from '@/components/order/OrderDetails.vue'

export default {
  name: 'OrderView',
  components: {
    OrderDetails
  },
  data() {
    return {
      showOrderDetails: false,
      selectedOrderId: null
    }
  },
  computed: {
    ...mapState('orders', {
      orders: state => state.orders,
      currentOrder: state => state.currentOrder,
      loading: state => state.loading,
      error: state => state.error
    })
  },

  async created() {
    await this.fetchOrders();
  },

  methods: {
    ...mapActions('orders', ['fetchOrders', 'cancelOrder']),

    formatPrice(price) {
      return Number(price).toFixed(2);
    },
    formatDate,
    viewOrderDetails(order_id) {
      this.selectedOrderId = order_id;
      this.showOrderDetails = true;
    },
    async cancelOrder(order_id) {
      try {
        await this.$store.dispatch('orders/cancelOrder', order_id);
        this.$toast.success('Order cancelled successfully');
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Failed to cancel order');
      }
    },
    getStatusClass(status) {
      const statusClasses = {
        'Pending': 'pending',
        'Processing': 'processing',
        'Shipped': 'shipped',
        'Delivered': 'delivered',
        'Cancelled': 'cancelled'
      };
      return statusClasses[status] || 'default';
    }
  }
};
</script>

<style scoped>
.orders-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.continue-shopping {
  background: #4CAF50;
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.3s;
}

.continue-shopping:hover {
  background: #45a049;
}

.orders-grid {
  display: flex;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.order-card:hover {
  transform: translateY(-2px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 15px;
}

.order-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
}

.view-details-btn {
  width: 100%;
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  color: #0d6efd;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.view-details-btn:hover {
  background-color: #e9ecef;
  border-color: #0d6efd;
}

.status.paid {
  background: #D1E7DD;
  color: #0F5132;
}

.status.pending {
  background: #FFF3CD;
  color: #856404;
}

.status.processing {
  background: #D1E7DD;
  color: #0F5132;
}
.status.shipped {
  background: #CCE5FF;
  color: #004085;
}

.status.delivered {
  background: #D4EDDA;
  color: #155724;
}

.status.cancelled {
  background: #F8D7DA;
  color: #721C24;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.cancel-order-btn {
  width: 100%;
  padding: 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-order-btn:hover {
  background-color: #c82333;
}

.order-info {
  margin-bottom: 15px;
}

.order-info p {
  margin: 8px 0;
  color: #666;
}

.view-details {
  display: inline-block;
  color: #2196F3;
  text-decoration: none;
  font-weight: 500;
}

.loading, .empty-state {
  text-align: center;
  padding: 40px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .orders-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

@media (max-width: 480px) {
  .orders-grid {
    grid-template-columns: 1fr;
  }
  
  .header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
}
</style>