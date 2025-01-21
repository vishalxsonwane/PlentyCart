<!-- ProductFilters.vue -->
<template>
  <div class="filters-container">
    <!-- Categories Section -->
    <div class="filter-section">
      <h3 class="filter-title">
        <i class="fas fa-tags"></i>
        Categories
      </h3>
      <div class="categories-list">
        <label class="category-item" v-if="categories.length > 1">
          <input
            type="radio"
            v-model="selectedCategory"
            value="all"
            class="category-radio"
            @change="applyFilters"
          >
          <span class="radio-label">All Products</span>
        </label>
        
        <label 
          v-for="category in categories.filter(cat => cat.id !== 'all')"
          :key="category.id"
          class="category-item"
        >
          <input
            type="radio"
            v-model="selectedCategory"
            :value="category.id"
            class="category-radio"
            @change="applyFilters"
          >
          <span class="radio-label">{{ category.name }}</span>
        </label>
      </div>
    </div>

    <!-- Price Range Section -->
    <div class="filter-section">
      <h3 class="filter-title">
        <i class="fas fa-dollar-sign"></i>
        Price Range
      </h3>
      
      <!-- Price Range Inputs -->
      <div class="price-inputs">
        <div class="price-input-group">
          <label for="minPrice">Min (₹)</label>
          <input
            v-model.number="localPriceRange.min"
            type="number"
            id="minPrice"
            min="0"
            :max="localPriceRange.max"
            class="price-input"
            @input="handlePriceInput"
          >
        </div>
        
        <span class="price-separator">to</span>
        
        <div class="price-input-group">
          <label for="maxPrice">Max (₹)</label>
          <input
            v-model.number="localPriceRange.max"
            type="number"
            id="maxPrice"
            :min="localPriceRange.min"
            class="price-input"
            @input="handlePriceInput"
          >
        </div>
      </div>

      <!-- Range Slider -->
      <div class="slider-container">
        <input
          type="range"
          v-model.number="localPriceRange.min"
          :min="0"
          :max="500"
          step="10"
          class="slider"
          @input="handlePriceInput"
        >
      </div>
    </div>

    <!-- Sort Section -->
    <div class="filter-section">
      <h3 class="filter-title">
        <i class="fas fa-sort"></i>
        Sort By
      </h3>
      <select 
        v-model="sortOption" 
        class="sort-select"
        @change="applySorting"
      >
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="name_asc">Name: A to Z</option>
        <option value="name_desc">Name: Z to A</option>
      </select>
    </div>

    <!-- Reset Filters -->
    <button 
      class="reset-filters-btn"
      @click="resetFilters"
    >
      <i class="fas fa-redo-alt"></i>
      Reset Filters
    </button>
  </div>
</template>

<script>
export default {
  name: 'ProductFilters',
  
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  
  data() {
    return {
      selectedCategory: 'all',
      localPriceRange: {
        min: 0,
        max: 500
      },
      sortOption: 'price_asc'
    }
  },
  
  methods: {
    handlePriceInput() {
      // Ensure min doesn't exceed max
      if (this.localPriceRange.min > this.localPriceRange.max) {
        this.localPriceRange.min = this.localPriceRange.max
      }
      this.applyFilters()
    },
    
    applyFilters() {
      this.$emit('filter-change', {
        category: this.selectedCategory,
        priceRange: this.localPriceRange,
        sort: this.sortOption
      })
    },
    
    applySorting() {
      this.applyFilters()
    },
    
    resetFilters() {
      this.selectedCategory = 'all'
      this.localPriceRange = {
        min: 0,
        max: 500
      }
      this.sortOption = 'price_asc'
      this.applyFilters()
    }
  }
}
</script>

<style scoped>
.filters-container {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.filter-section:last-of-type {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.filter-title i {
  color: #4CAF50;
  font-size: 1rem;
}

/* Categories Styling */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.category-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.category-radio {
  display: none;
}

.radio-label {
  position: relative;
  padding-left: 28px;
  color: #4a5568;
  font-size: 0.95rem;
  cursor: pointer;
}

.radio-label::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e0;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.radio-label::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #4CAF50;
  opacity: 0;
  transition: all 0.2s ease;
}

.category-radio:checked + .radio-label::before {
  border-color: #4CAF50;
}

.category-radio:checked + .radio-label::after {
  opacity: 1;
}

/* Price Range Styling */
.price-inputs {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.price-input-group {
  flex: 1;
}

.price-separator {
  margin-bottom: 0.5rem;
  color: #6c757d;
}

.price-input-group label {
  display: block;
  font-size: 0.9rem;
  color: #4a5568;
  margin-bottom: 0.25rem;
}

.price-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.95rem;
  color: #2d3748;
  transition: all 0.2s ease;
}

.price-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 1px #4CAF50;
}

/* Slider Styling */
.slider-container {
  padding: 0 0.5rem;
}

.slider {
  width: 100%;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4CAF50;
  border: 2px solid white;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4CAF50;
  border: 2px solid white;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.1);
}

/* Sort Select Styling */
.sort-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  color: #2d3748;
  background-color: white;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-select:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 1px #4CAF50;
}

/* Reset Button Styling */
.reset-filters-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #f8f9fa;
  color: #2c3e50;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.reset-filters-btn i {
  font-size: 0.9rem;
}

.reset-filters-btn:hover {
  background-color: #e9ecef;
  border-color: #cbd5e0;
}

@media (max-width: 768px) {
  .filters-container {
    padding: 1rem;
  }

  .filter-section {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
  }

  .price-inputs {
    flex-direction: column;
    gap: 1rem;
  }

  .price-separator {
    display: none;
  }
}
</style>