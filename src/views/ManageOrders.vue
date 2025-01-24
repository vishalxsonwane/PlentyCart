<template>
  <div class="manage-orders">
    <div class="header">
      <h1>Manage Orders</h1>
      <div class="search-filter">
        <div class="search-box">
          <input type="text" placeholder="Search by order ID, customer name, or email" v-model="searchQuery" />
          <button class="search-btn" @click="fetchAllOrders">
            <i class="fas fa-search"></i>
          </button>
        </div>
        <div class="filters">
          <select v-model="selectedStatus" @change="fetchAllOrders">
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select v-model="selectedDate" @change="fetchAllOrders">
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>Loading orders...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>Error fetching orders: {{ error }}</p>
    </div>

    <div v-else class="orders-table">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order._id">
            <td>{{ order.order_id }}</td>
            <td>{{ order.user_name }} ({{ order.user_email }})</td>
            <td>₹{{ order.total_price.toFixed(2) }}</td>
            <td>
              <select v-model="order.order_status" @change="updateOrderStatus(order)">
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </td>
            <td>{{ formatDate(order.date) }}</td>
            <td>
              <button class="btn btn-primary" @click="viewOrderDetails(order.order_id)">
                View Details
              </button>
              <button class="btn btn-danger" @click="refundOrder(order)">
                Refund
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <OrderDetails v-if="showOrderDetails" :order_id="selectedOrderId" @close="showOrderDetails = false" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { formatDate } from '@/utils/formatters'
import OrderDetails from '@/components/order/OrderDetails.vue'

export default {
  name: 'ManageOrders',
  components: {
    OrderDetails
  },
  data() {
    return {
      searchQuery: '',
      selectedStatus: '',
      selectedDate: '',
      filteredOrders: [],
      showOrderDetails: false,
      selectedOrder: null,
      orderNote: '',
      selectedOrderId: null
    };
  },
  computed: {
    ...mapState('orders', {
      orders: state => state.orders,
      loading: state => state.loading,
      error: state => state.error,
    }),
  },
  mounted() {
    this.fetchAllOrders();
  },
  watch: {
    orders: {
      handler() {
        this.filterOrders();
      },
      deep: true,
    },
    searchQuery() {
      this.filterOrders();
    },
    selectedStatus() {
      this.filterOrders();
    },
    selectedDate() {
      this.filterOrders();
    },
  },
  methods: {
    ...mapActions('orders', {
      fetchAllOrders: 'fetchAllOrders',
      updateOrderStatus: 'updateOrderStatus',
      refundOrder: 'refundOrder',
    }),
    viewOrderDetails(order_id) {
      this.selectedOrderId = order_id;
      this.showOrderDetails = true;
    },
    filterOrders() {
      this.filteredOrders = this.orders.filter(order => {
        const statusMatch =
          this.selectedStatus === '' || order.order_status === this.selectedStatus;
        const dateMatch = this.filterByDate(order.date);
        const searchMatch =
          order.order_id.includes(this.searchQuery) ||
          order.user_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          order.user_email.toLowerCase().includes(this.searchQuery.toLowerCase());
        return statusMatch && dateMatch && searchMatch;
      });
    },
    filterByDate(date) {
      const today = new Date();
      const oneWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const oneYear = new Date(today.getFullYear(), 0, 1);

      switch (this.selectedDate) {
        case 'today':
          return new Date(date).toDateString() === today.toDateString();
        case 'week':
          return new Date(date) >= oneWeek && new Date(date) <= today;
        case 'month':
          return new Date(date) >= oneMonth && new Date(date) <= today;
        case 'year':
          return new Date(date) >= oneYear && new Date(date) <= today;
        default:
          return true;
      }
    },
    formatDate,
    viewOrder(order) {
      this.selectedOrder = order;
      this.showOrderDetails = true;
    },
    addOrderNote() {
      // Implement logic to save the order note
      console.log('Order note:', this.orderNote);
      this.orderNote = '';
    },
  },
};
</script>

<style scoped>
.manage-orders {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-filter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-box {
  display: flex;
  align-items: center;
}

.search-box input {
  width: 300px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-box button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.filters select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.loading,
.error {
  text-align: center;
  padding: 40px 0;
}

.orders-table {
  overflow-x: auto;
}

.orders-table table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th,
.orders-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.orders-table td select {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.orders-table td button {
  margin-right: 5px;
}

.order-details {
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

.order-details-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
}

.order-notes textarea {
  width: 100%;
  height: 100px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}

.orders-table td select {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-transform: capitalize;
}
</style>