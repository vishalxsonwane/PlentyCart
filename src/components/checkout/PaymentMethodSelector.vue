<!-- PaymentMethodSelector.vue -->
<template>
  <div class="payment-methods">
    <div class="methods-grid">
      <div 
        v-for="method in paymentMethods" 
        :key="method.type"
        class="payment-method-card"
        :class="{ 'selected': selectedMethod === method.type }"
        @click="selectPaymentMethod(method.type)"
      >
        <div class="method-header">
          <input 
            type="radio" 
            :id="method.type" 
            :value="method.type" 
            v-model="selectedMethod"
            class="method-radio"
          />
          <label :for="method.type" class="method-label">
            <i :class="getMethodIcon(method.type)"></i>
            {{ method.label }}
          </label>
        </div>
        <p class="method-description">{{ method.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentMethodSelector',
  data() {
    return {
      selectedMethod: 'cod', // Set COD as default
      paymentMethods: [
        {
          type: 'cod',
          label: 'Cash on Delivery',
          description: 'Pay with cash when your order arrives'
        },
        {
          type: 'credit-card',
          label: 'Credit Card',
          description: 'Pay with Visa, Mastercard, or American Express'
        },
        {
          type: 'paypal',
          label: 'PayPal',
          description: 'Quick and secure payment via PayPal'
        }
      ]
    }
  },
  
  methods: {
    selectPaymentMethod(method) {
      this.selectedMethod = method
      this.$emit('payment-method-changed', method)
    },

    getMethodIcon(type) {
      switch (type) {
        case 'cod':
          return 'fas fa-money-bill-wave'
        case 'credit-card':
          return 'fas fa-credit-card'
        case 'paypal':
          return 'fab fa-paypal'
        default:
          return 'fas fa-money-bill'
      }
    }
  }
}
</script>

<style scoped>
.payment-methods {
  margin-bottom: 1.5rem;
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.payment-method-card {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-method-card:hover {
  border-color: #4CAF50;
  background-color: #f0f9f0;
}

.payment-method-card.selected {
  border-color: #4CAF50;
  background-color: #f0f9f0;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.1);
}

.method-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.method-radio {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #4CAF50;
  appearance: none;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
}

.method-radio:checked {
  background-color: #4CAF50;
  border-color: #4CAF50;
}

.method-radio:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
}

.method-label {
  font-size: 1.1rem;
  font-weight: 500;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.method-label i {
  font-size: 1.25rem;
  color: #4CAF50;
}

.method-description {
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .methods-grid {
    grid-template-columns: 1fr;
  }

  .payment-method-card {
    padding: 1rem;
  }
}
</style>