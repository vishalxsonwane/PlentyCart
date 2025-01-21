<template>
  <div class="pagination-container">
    <div class="pagination-controls">
      <!-- Previous Button -->
      <button
        @click="goToPreviousPage"
        :disabled="currentPage === 1"
        class="pagination-btn prev-btn"
      >
        <i class="fas fa-angle-left"></i> Prev
      </button>

      <!-- Page Numbers -->
      <div class="pagination-pages">
        <button
          v-for="pageNumber in visiblePages"
          :key="pageNumber"
          @click="changePage(pageNumber)"
          :class="[
            'pagination-page',
            { 'active': currentPage === pageNumber }
          ]"
        >
          {{ pageNumber }}
        </button>
      </div>

      <!-- Next Button -->
      <button
        @click="goToNextPage"
        :disabled="currentPage === totalPages"
        class="pagination-btn next-btn"
      >
        Next <i class="fas fa-angle-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaginationControls',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    maxVisiblePages: {
      type: Number,
      default: 5
    }
  },
  computed: {
    visiblePages() {
      // Calculate visible page numbers
      const range = Math.min(this.maxVisiblePages, this.totalPages);
      const start = Math.max(
        1,
        Math.min(
          this.currentPage - Math.floor(range / 2),
          this.totalPages - range + 1
        )
      );

      return Array.from({ length: range }, (_, i) => start + i);
    }
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.$emit('page-change', page);
      }
    },
    goToPreviousPage() {
      if (this.currentPage > 1) {
        this.$emit('page-change', this.currentPage - 1);
      }
    },
    goToNextPage() {
      if (this.currentPage < this.totalPages) {
        this.$emit('page-change', this.currentPage + 1);
      }
    }
  }
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.pagination-btn:hover {
  background-color: #e5e7eb;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.pagination-page.active {
  background-color: #4b5563;
  color: #f3f4f6;
}

.pagination-page:hover {
  background-color: #e5e7eb;
}

@media (max-width: 768px) {
  .pagination-btn {
    padding: 0.5rem;
  }

  .pagination-page {
    width: 1.75rem;
    height: 1.75rem;
  }
}
</style>