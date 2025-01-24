<template>
  <div class="product-form-container">
    <div class="page-header">
      <h1 class="page-title">{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h1>
    </div>
    
    <div class="form-card">
      <div class="form-body">
        <form @submit.prevent="handleSubmit" class="product-form">
          <!-- Image Upload -->
          <div class="form-section">
            <label class="form-label">Product Image</label>
            <div class="image-upload-container">
              <div 
                class="image-preview"
                :class="{ 'has-image': previewImage }"
                @click="() => fileInput.click()"
              >
                <img 
                  v-if="previewImage"
                  :src="previewImage"
                  alt="Preview"
                  class="preview-img"
                />
                <div v-else class="upload-placeholder">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <span>Click or drag image here</span>
                </div>
              </div>
              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                class="file-input"
                @change="handleImageUpload"
              >
            </div>
          </div>

          <div class="form-grid">
            <!-- Title -->
            <div class="form-group">
              <label for="title" class="form-label">Product Title<span class="required">*</span></label>
              <input
                v-model="form.title"
                type="text"
                id="title"
                class="form-input"
                required
                placeholder="Enter product title"
              >
            </div>

            <!-- Category -->
            <div class="form-group">
              <label for="category" class="form-label">Category<span class="required">*</span></label>
              <select
                v-model="form.category"
                id="category"
                class="form-select"
                required
              >
                <option value="">Select Category</option>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="personalcare">Personal Care</option>
              </select>
            </div>

            <!-- Price -->
            <div class="form-group">
              <label for="price" class="form-label">Price<span class="required">*</span></label>
              <div class="price-input-group">
                <span class="currency-symbol">₹</span>
                <input
                  v-model.number="form.price"
                  type="number"
                  id="price"
                  class="form-input"
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                >
              </div>
            </div>

            <!-- Price Description -->
            <div class="form-group">
              <label for="priceDescription" class="form-label">Price Description</label>
              <input
                v-model="form.price_description"
                type="text"
                id="priceDescription"
                class="form-input"
                placeholder="e.g., per lb, each, etc."
              >
            </div>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="description" class="form-label">Product Description<span class="required">*</span></label>
            <textarea
              v-model="form.product_description"
              id="product_description"
              class="form-textarea"
              rows="4"
              required
              placeholder="Enter product description"
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="form-actions">
            <button 
              type="button"
              class="btn-cancel"
              @click="handleCancel"
            >
              <i class="fas fa-times"></i>
              <span>Cancel</span>
            </button>
            <button 
              type="submit"
              class="btn-submit"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner"></span>
              <span>{{ isEditing ? 'Update Product' : 'Create Product' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toast-notification';

export default {
  name: 'ProductForm',

  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const $toast = useToast();
    const fileInput = ref(null);
    const loading = ref(false);
    const previewImage = ref(null);

    const form = reactive({
      title: '',
      category: '',
      price: '',
      price_description: '',
      product_description: '',
      image: null,
      is_deleted : false
    });

    const isEditing = computed(() => route.name === 'edit-product');

    onMounted(async () => {
      if (isEditing.value) {
        loading.value = true;
        try {
          const product = await store.dispatch('products/fetchProduct', route.params.id);
          Object.assign(form, product);
          if (product.image_path) {
            previewImage.value = '/' + product.image_path;
          }
        } catch (error) {
          console.error('Failed to load product:', error);
        } finally {
          loading.value = false;
        }
      }
    });

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        form.image = file;
        previewImage.value = URL.createObjectURL(file);
      }
    };

    const handleSubmit = async () => {
      loading.value = true;
      try {
        const formData = new FormData();
        
        // Add the image if it exists
        if (form.image) {
          formData.append('image', form.image);
        }

        // Add category separately
        formData.append('category', form.category);
        
        // Add other data
        const productData = { ...form };
        delete productData.image;
        formData.append('data', JSON.stringify(productData));

        if (isEditing.value) {
          await store.dispatch('products/updateProduct', {
            id: route.params.id,
            data: formData
          });
          $toast.success('Product updated successfully');
        } else {
          await store.dispatch('products/createProduct', formData);
          $toast.success('Product created successfully');
        }

        router.push('/admin/manage');
      } catch (error) {
        $toast.error(error.response?.data?.message || 'Failed to save product');
        console.error('Failed to save product:', error);
      } finally {
        loading.value = false;
      }
    };

    const handleCancel = () => {
      if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
        router.push('/admin/manage');
      }
    };

    return {
      form,
      loading,
      previewImage,
      fileInput,
      isEditing,
      handleImageUpload,
      handleSubmit,
      handleCancel
    };
  }
};
</script>

<style scoped>
.product-form-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

/* Updated page header styles */
.page-header {
  max-width: 900px;
  margin: 0 auto 1.5rem;
  padding: 0 1.5rem;
}

.page-title {
  font-size: 1.75rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
}

.form-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.form-body {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.required {
  color: #dc3545;
  margin-left: 0.25rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: #fff;
  color: #2c3e50;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.price-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 0.75rem;
  color: #6c757d;
}

.price-input-group .form-input {
  padding-left: 2rem;
}

.image-upload-container {
  max-width: 100%;
}

.image-preview {
  width: 100%;
  height: 250px;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.image-preview:hover {
  border-color: #4CAF50;
  background: #f1f8f1;
}

.image-preview.has-image {
  border-style: solid;
  border-color: #4CAF50;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.upload-placeholder {
  text-align: center;
  color: #6c757d;
}

.upload-placeholder i {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  color: #4CAF50;
}

.upload-placeholder span {
  display: block;
  font-size: 0.9rem;
}

.file-input {
  display: none;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-submit {
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background: #43a047;
}

.btn-submit:disabled {
  background: #a5d6a7;
  cursor: not-allowed;
}

.btn-cancel {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: white;
  color: #6c757d;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #f8f9fa;
  border-color: #6c757d;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .product-form-container {
    margin: 1rem auto;
    padding: 0 1rem;
  }

  .page-title {
    text-align: center;
    font-size: 1.75rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .image-preview {
    height: 200px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-submit,
  .btn-cancel {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .form-body {
    padding: 1.25rem;
  }

  .image-preview {
    height: 180px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
}
</style>