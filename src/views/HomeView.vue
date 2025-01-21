<!-- HomeView.vue -->
<template>
  <div class="home-view">
    <the-navigation />

    <main class="main-content">
      <div class="container">
        <div class="home-header">
          <h1 class="page-title">Fresh Groceriesss</h1>
          <p class="subtitle">Shop our selection of fresh, high-quality products</p>
        </div>

        <div class="products-layout">
          <!-- Filters Sidebar -->
          <aside class="filters-sidebar">
            <product-filters :categories="categories" :selected-category="selectedCategory" :price-range="priceRange"
              @filter-change="handleFilterChange" />
          </aside>

          <!-- Products Section -->
          <section class="products-section">
            <div class="products-header">
              <p class="results-count">
                Showing {{ filteredProducts.length }} products
              </p>
              <div class="sort-controls">
                <label for="sort" class="sort-label">Sort by:</label>
                <select v-model="sortOption" id="sort" class="sort-select" @change="handleSortChange">
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>
            </div>

            <!-- Products Grid -->
            <div class="products-grid">
              <product-card v-for="product in sortedProducts" :key="product._id" :product="product" />
            </div>

            <!-- Empty State -->
            <div v-if="!filteredProducts.length" class="empty-state">
              <i class="fas fa-box-open fa-3x"></i>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button class="reset-btn" @click="resetFilters">
                Reset Filters
              </button>
            </div>

            <!-- Pagination -->
            <pagination-controls v-if="totalPages > 1" :current-page="currentPage" :total-pages="totalPages"
              @page-change="handlePageChange" />
          </section>
        </div>
      </div>
    </main>

    <the-footer />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductFilters from '@/components/product/ProductFilters.vue'
import PaginationControls from '@/components/shared/PaginationControls.vue'
import TheFooter from '@/components/layout/TheFooter.vue'

export default {
  name: 'HomeView',

  components: {
    ProductCard,
    ProductFilters,
    PaginationControls,
    TheFooter
  },

  data() {
    return {
      selectedCategory: 'all',
      priceRange: { min: 0, max: 500 },
      currentPage: 1,
      itemsPerPage: 9,
      sortOption: 'price_asc'
    }
  },

  computed: {
    ...mapState('products', {
      products: state => state.items,
      categories: state => state.categories,
      totalProducts: state => state.total
    }),

    filteredProducts() {
      let filtered = [...this.products];
      if (this.selectedCategory !== 'all') {
        filtered = filtered.filter(p => p.category === this.selectedCategory);
      }

      filtered = filtered.filter(p =>
        p.price >= this.priceRange.min &&
        p.price <= this.priceRange.max
      );

      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return filtered.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage);
    },

    sortedProducts() {
      let sorted = [...this.filteredProducts];
      switch (this.sortOption) {
        case 'price_asc':
          return sorted.sort((a, b) => a.price - b.price);
        case 'price_desc':
          return sorted.sort((a, b) => b.price - a.price);
        case 'name_asc':
          return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'name_desc':
          return sorted.sort((a, b) => b.title.localeCompare(a.title));
        default:
          return sorted;
      }
    },
  },

  methods: {
    ...mapActions('products', ['fetchProducts', 'fetchCategories']),

    async initialize() {
      try {
        await Promise.all([
          this.fetchProducts({}),
          this.fetchCategories()
        ])
      } catch (error) {
        console.error('Error initializing:', error)
      }
    },

    async handleFilterChange({ category, priceRange }) {
      this.selectedCategory = category;
      this.priceRange = priceRange;
      this.currentPage = 1;

      try {
        await this.fetchProducts({
          category: this.selectedCategory,
          search: '',
          page: this.currentPage,
          // limit: this.itemsPerPage
        });
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },


    handlePageChange(page) {
      this.currentPage = page;
      // const productParams = {
      //   category: this.selectedCategory,
      //   page: this.currentPage,
      //   limit: this.itemsPerPage
      // }
      // this.fetchProducts(productParams);
    }
  },

  created() {
    this.initialize()
  }
}
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  padding-top: 6rem;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.home-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6c757d;
  font-size: 1.1rem;
}

.products-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.filters-sidebar {
  position: sticky;
  top: 7rem;
  height: fit-content;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.results-count {
  color: #6c757d;
  font-size: 0.95rem;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-label {
  color: #2c3e50;
  font-size: 0.95rem;
}

.sort-select {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  color: #2c3e50;
  background-color: white;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.empty-state i {
  color: #6c757d;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.reset-btn {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reset-btn:hover {
  background-color: #45a049;
}

@media (max-width: 1024px) {
  .products-layout {
    grid-template-columns: 250px 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .products-layout {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: static;
    margin-bottom: 2rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .products-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>