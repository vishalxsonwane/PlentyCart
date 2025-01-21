<template>
  <div class="manage-users">
    <!-- Header section remains the same -->
    <div class="header">
      <h1>Manage Users</h1>
      <div class="search-filter">
        <div class="search-box">
          <input type="text" placeholder="Search by name or email" v-model="searchQuery" />
          <button class="search-btn" @click="fetchUsers">
            <i class="fas fa-search"></i>
          </button>
        </div>
        <div class="filters">
          <select v-model="selectedDate" @change="fetchUsers">
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>Loading users...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>Error fetching users: {{ error }}</p>
    </div>

    <div v-else class="users-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Registered At</th>
            <th>Last Updated At</th>
            <th>Last Password Change</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user._id">
            <td>{{ user.full_name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ formatDateTime(user.created_at) }}</td>
            <td>{{ formatDateTime(user.updated_at) }}</td>
            <td>
              {{ user.password_changed_at ? formatDateTime(user.password_changed_at) : 'Never Changed' }}
            </td>
            <td>
              <span :class="{'status-active': user.active, 'status-inactive': !user.active}">
                {{ user.active ? 'Active' : 'Suspended' }}
              </span>
            </td>
            <td>
              <button 
                class="btn" 
                :class="user.active ? 'btn-danger' : 'btn-success'"
                @click="toggleUserStatuss(user)" 
                :disabled="isLoading"
              >
                {{ user.active ? 'Suspend' : 'Activate' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showUserDetails" class="user-details">
      <h2>User Details</h2>
      <p>Name: {{ selectedUser.full_name }}</p>
      <p>Email: {{ selectedUser.email }}</p>
      <p>Registered: {{ formatDateTime(selectedUser.created_at) }}</p>
      <p>Active: {{ selectedUser.active ? 'Yes' : 'No' }}</p>
      <div class="user-notes">
        <h3>User Notes</h3>
        <textarea v-model="userNote" placeholder="Add a note..."></textarea>
        <button class="btn btn-primary" @click="addUserNote">Save Note</button>
      </div>
      <button class="btn btn-danger" @click="showUserDetails = false">
        Close
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ManageUsers',
  data() {
    return {
      searchQuery: '',
      selectedDate: '',
      filteredUsers: [],
      showUserDetails: false,
      selectedUser: null,
      userNote: '',
      isLoading: false,
    };
  },
  computed: {
    ...mapState('users', {
      users: state => state.users,
      loading: state => state.loading,
      error: state => state.error,
    }),
  },
  mounted() {
    this.fetchUsers();
  },
  watch: {
    users: {
      handler() {
        this.filterUsers();
      },
      deep: true,
    },
    searchQuery() {
      this.filterUsers();
    },
    selectedDate() {
      this.filterUsers();
    },
  },
  methods: {
    ...mapActions('users', {
      fetchUsers: 'fetchAllUsers',
      resetPassword: 'resetUserPassword',
      toggleUserStatus: 'toggleUserStatus',
    }),
    filterUsers() {
      this.filteredUsers = this.users.filter(user => {
        const dateMatch = this.filterByDate(user.created_at);
        const searchMatch =
          user.full_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchQuery.toLowerCase());
        return dateMatch && searchMatch;
      });
    },
    async toggleUserStatuss(user) {
      try {
        this.isLoading = true;
        await this.toggleUserStatus(user.id);
        this.filterUsers();
      } catch (error) {
        console.error('Error suspending/activating user:', error);
      } finally {
        this.isLoading = false;
      }
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
    formatDateTime(dateTime) {
      const date = new Date(dateTime);
      return date.toLocaleString();
    },
    viewUserDetails(user) {
      this.selectedUser = user;
      this.showUserDetails = true;
    },
    addUserNote() {
      // Implement logic to save the user note
      console.log('User note:', this.userNote);
      this.userNote = '';
    },
  },
};
</script>

<style scoped>
.manage-users {
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
.status-active {
  background-color: #d4edda;
  color: #155724;
  padding: 4px 8px;
  border-radius: 4px;
}

.status-suspended {
  background-color: #f8d7da;
  color: #721c24;
  padding: 4px 8px;
  border-radius: 4px;
}

.btn-danger {
  background-color: #dc3545;
  color: #fff;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-success {
  background-color: #28a745;
  color: #fff;
}

.btn-success:hover {
  background-color: #218838;
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

.users-table {
  overflow-x: auto;
}

.users-table table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.users-table td select {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.users-table td button {
  margin-right: 5px;
}

.user-details {
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

.user-details-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
}

.user-notes textarea {
  width: 100%;
  height: 100px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}
</style>