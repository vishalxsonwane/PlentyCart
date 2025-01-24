<template>
  <div class="admin-view">
    <div class="admin-container py-4">
      <!-- Admin Header -->
      <div class="header-section mb-4">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <div class="action-buttons">
          <router-link v-if="!isAddProduct && $route.path === '/admin'" to="/admin/add" class="btn btn-success action-btn">
            <i class="fas fa-plus me-2"></i>
            <span class="btn-text">Add New Product</span>
          </router-link>
        </div>
      </div>

      <!-- Admin Content -->
      <div class="admin-content">
        <!-- Add/Edit Product Forms -->
        <template v-if="isAddProduct || isEditProduct">
          <product-form :product-id="isEditProduct ? $route.params.id : null" @submit="handleProductSubmit"
            @cancel="cancelForm" />
        </template>

        <!-- Product Management -->
        <template v-else>
          <!-- Search and Filter -->
          <div class="search-section card mb-4">
            <div class="card-body">
              <div class="filter-grid">
                <div class="search-box">
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-search"></i>
                    </span>
                    <input v-model="searchQuery" type="text" class="form-control" placeholder="Search products..."
                      @input="debounceSearch">
                  </div>
                </div>
                <div class="category-filter">
                  <select v-model="selectedCategory" class="form-select" @change="handleSearch">
                    <option value="">All Categories</option>
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="personalcare">Personal Care</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-success" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading products...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="products.length === 0" class="text-center py-5">
            <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
            <h3>No products found</h3>
            <p class="text-muted">Try adjusting your search or add new products</p>
            <router-link to="/admin/add" class="btn btn-success mt-3">
              <i class="fas fa-plus me-2"></i>
              Add New Product
            </router-link>
          </div>

          <!-- Products Table -->
          <div v-else class="table-container">
            <div class="card">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th class="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in products" :key="product._id">
                      <td class="image-cell">
                        <img :src="'/' + product.image_path" :alt="product.title" class="product-thumbnail">
                      </td>
                      <td class="title-cell">{{ product.title }}</td>
                      <td class="category-cell">
                        <span class="badge bg-secondary">{{ product.category }}</span>
                      </td>
                      <td class="price-cell">₹{{ formatPrice(product.price) }}</td>
                      <td class="status-cell">
                        <span class="badge" :class="product.is_deleted ? 'bg-danger' : 'bg-success'">
                          {{ product.is_deleted ? 'Inactive' : 'Active' }}
                        </span>
                      </td>
                      <td class="actions-cell">
                        <div class="action-buttons-container">
                          <button class="btn btn-sm edit-button action-button" @click="editProduct(product._id)">
                            <i class="fas fa-pencil-alt"></i>
                            Edit
                          </button>
                          <button class="btn btn-sm toggle-button action-button" :class="{ 'active': !product.is_deleted }"
                            @click="toggleProductActive(product)">
                            <i class="fas" :class="product.is_deleted ? 'fa-toggle-on' : 'fa-toggle-off'"></i>
                            {{ product.is_deleted ? 'Activate' : 'Deactivate' }}
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="pagination-wrapper">
              <div class="pagination-info">
                Showing {{ paginationStart }} - {{ paginationEnd }} of {{ total }} products
              </div>
              <pagination-controls
                :current-page="currentPage"
                :total-pages="totalPages"
                @page-change="changePage"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ProductForm from '@/components/admin/ProductForm.vue';
import { formatPrice } from '@/utils/formatters';
import _ from 'lodash';
import PaginationControls from '@/components/shared/PaginationControls.vue'

export default {
  name: 'AdminView',

  components: {
    ProductForm,
    PaginationControls
  },

  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      currentPage: 1,
      itemsPerPage: 10,
      showConfirmModal: false,
      confirmModalConfig: {
        title: '',
        message: '',
        confirmText: '',
        confirmVariant: 'danger',
        action: null,
        product: null
      }
    };
  },

  computed: {
    ...mapState('products', {
      products: state => state.items,
      loading: state => state.loading,
      total: state => state.total
    }),

    activeProducts() {
      return this.products.filter(p => !p.is_deleted).length
    },

    inactiveProducts() {
      return this.products.filter(p => p.is_deleted).length
    },

    totalPages() {
      return Math.ceil(this.total / this.itemsPerPage)
    },

    pageTitle() {
      if (this.isAddProduct) return 'Add New Product'
      if (this.isEditProduct) return 'Edit Product'
      return 'Manage Products'
    },

    isAddProduct() {
      return this.$route.path === '/admin/add'
    },

    isEditProduct() {
      return this.$route.name === 'edit-product'
    },

    isManageProducts() {
      return this.$route.path === '/admin/manage'
    },

    paginationRange() {
      const range = []
      const maxVisiblePages = 5
      let start = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2))
      let end = Math.min(this.totalPages, start + maxVisiblePages - 1)

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1)
      }

      for (let i = start; i <= end; i++) {
        range.push(i)
      }
      return range
    },

    paginationStart() {
      return ((this.currentPage - 1) * this.itemsPerPage) + 1;
    },

    paginationEnd() {
      return Math.min(this.paginationStart + this.itemsPerPage - 1, this.total);
    }
  },

  watch: {
    '$route'() {
      this.loadProducts()
    },

    // selectedCategory() {
    //   this.currentPage = 1
    //   this.loadProducts()
    // }
  },

  created() {
    // Load products immediately when component is created
    if (this.$route.path === '/admin/manage') {
      this.loadProducts()
    }
  },

  methods: {
    ...mapActions('products', [
      'fetchProducts',
      'createProduct',
      'updateProduct',
      'toggleProductStatus',
      'deleteProduct',
      'fetchAdminProducts'
    ]),

    formatPrice,

    async loadProducts() {
      try {
        await this.fetchAdminProducts({
          page: this.currentPage,
          limit: this.itemsPerPage,
          category: this.selectedCategory,
          search: this.searchQuery
        })
      } catch (error) {
        console.error('Failed to load products:', error)
        this.$toast.error('Failed to load products')
      }
    },

    debounceSearch: _.debounce(function () {
      this.handleSearch()
    }, 300),

    async handleSearch() {
      this.currentPage = 1
      await this.loadProducts()
    },

    async changePage(page) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.currentPage = page
        await this.loadProducts()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },

    editProduct(productId) {
      this.$router.push(`/admin/products/${productId}/edit`)
    },

    async toggleProductActive(product) {
      try {
        await this.toggleProductStatus(product._id)
        this.$toast.success(`Product ${product.is_deleted ? 'activated' : 'deactivated'} successfully`)
        await this.loadProducts()
      } catch (error) {
        this.$toast.error('Failed to update product status')
      }
    },

    confirmDelete(product) {
      this.productToDelete = product
      this.showDeleteModal = true
    },

    async handleDelete() {
      if (!this.productToDelete) return

      try {
        await this.deleteProduct(this.productToDelete._id)
        this.$toast.success('Product deleted successfully')
        this.showDeleteModal = false
        this.productToDelete = null
        await this.loadProducts()
      } catch (error) {
        this.$toast.error('Failed to delete product')
      }
    },

    async handleProductSubmit(productData) {
      try {
        if (this.isEditProduct) {
          await this.updateProduct({
            id: this.$route.params.id,
            data: productData
          })
          this.$toast.success('Product updated successfully')
        } else {
          await this.createProduct(productData)
          this.$toast.success('Product created successfully')
        }
        this.$router.push('/admin/manage')
      } catch (error) {
        this.$toast.error('Failed to save product')
      }
    },

    cancelForm() {
      if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
        this.$router.push('/admin/manage')
      }
    }
  }
}
</script>

<style scoped>
.admin-view {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 1rem;
}

.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header Styles */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.75rem;
  color: #2c3e50;
  margin: 0;
}

/* Search Section */
.search-section {
  margin-bottom: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem;
}

@media (min-width: 768px) {
  .filter-grid {
    grid-template-columns: 2fr 1fr;
  }
}

.search-box .input-group {
  width: 100%;
}

.search-box input {
  height: 42px;
  border-radius: 4px;
}

.category-filter select {
  width: 100%;
  height: 42px;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  background-color: white;
}

/* Table Styles */
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table {
  width: 100%;
  min-width: 750px; /* Minimum width to prevent cramping */
  margin-bottom: 0;
}

.table th {
  white-space: nowrap;
  padding: 1rem;
  background-color: #f8f9fa;
  font-weight: 600;
}

.table td {
  padding: 1rem;
  vertical-align: middle;
}

/* Responsive table columns */
.image-cell {
  width: 60px;
}

.product-thumbnail {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
}

.title-cell {
  max-width: 200px;
}

.category-cell .badge {
  font-size: 0.875rem;
  padding: 0.4em 0.8em;
}

.price-cell {
  white-space: nowrap;
}

.status-cell .badge {
  font-size: 0.875rem;
  padding: 0.4em 0.8em;
}

.actions-cell {
  width: 120px;
  text-align: center;
}

.action-buttons-container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.action-button {
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

/* Pagination Styles */
.pagination-section {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .pagination-section {
    flex-direction: row;
    justify-content: space-between;
  }
}

.pagination {
  margin: 0;
  gap: 0.25rem;
}

.page-link {
  padding: 0.5rem 0.75rem;
  min-width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px !important;
  margin: 0 !important;
  font-weight: 500;
}

.pagination-info {
  text-align: center;
  color: #6c757d;
}

/* Mobile optimizations */
@media (max-width: 767px) {
  .admin-container {
    padding: 0 0.5rem;
  }

  .page-title {
    font-size: 1.5rem;
    width: 100%;
    text-align: center;
  }

  .action-buttons {
    width: 100%;
    justify-content: center;
  }

  /* Hide less important columns on mobile */
  .category-cell,
  .price-cell {
    display: none;
  }

  .table td {
    padding: 0.75rem;
  }

  .product-thumbnail {
    width: 40px;
    height: 40px;
  }

  .title-cell {
    max-width: 150px;
  }

  .status-cell {
    width: 80px;
  }

  .actions-cell {
    width: 100px;
  }

  .action-button {
    padding: 0.25rem 0.5rem;
  }

  .pagination .page-link {
    padding: 0.375rem 0.625rem;
    min-width: 34px;
    height: 34px;
  }
}

/* Loading and Empty States */
.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-state i {
  font-size: 3rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.empty-state p {
  color: #6c757d;
  margin-bottom: 1.5rem;
}

/* Improved transitions */
.action-button,
.page-link,
.category-filter select {
  transition: all 0.2s ease-in-out;
}

.action-button:hover,
.page-link:hover {
  transform: translateY(-1px);
}


/* Pagination Styles */
.pagination-wrapper {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .pagination-wrapper {
    flex-direction: row;
    justify-content: space-between;
  }
}

.pagination-info {
  text-align: center;
  color: #6c757d;
  font-size: 0.875rem;
}

.pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem;
  margin: 0;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.page-link {
  padding: 0.5rem 0.75rem;
  min-width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px !important;
  margin: 0 !important;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.page-link:hover {
  transform: translateY(-1px);
}

@media (max-width: 767px) {
  .pagination-wrapper {
    padding: 1rem 0.5rem;
  }

  .pagination-info {
    font-size: 0.75rem;
  }

  .page-link {
    padding: 0.375rem 0.625rem;
    min-width: 34px;
    height: 34px;
  }
}

.action-buttons-container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.action-button {
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.edit-button {
  background-color:#606b76;
  color: #fff;
}

.edit-button:hover {
  background-color: #0056b3;
}

.toggle-button {
  color: #6c757d;
  border: 1px solid #6c757d;
}

.toggle-button:hover {
  color: #495057;
  border-color: #495057;
}

.toggle-button.active {
  background-color: #28a745;
  color: #fff;
  border-color: #28a745;
}

.toggle-button.active:hover {
  background-color: #218838;
  border-color: #1e7e34;
}
</style>