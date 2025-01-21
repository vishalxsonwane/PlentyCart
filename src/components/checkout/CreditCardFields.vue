<!-- CreditCardFields.vue -->
<template>
  <div class="credit-card-fields">
    <div class="form-group">
      <label for="cardNumber">
        <i class="fas fa-credit-card"></i>
        Card Number
      </label>
      <input 
        v-model="cardDetails.number"
        type="text"
        id="cardNumber"
        class="form-input"
        placeholder="1234 5678 9012 3456"
        maxlength="19"
        @input="formatCardNumber"
        required
      />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="expiryDate">
          <i class="fas fa-calendar-alt"></i>
          Expiry Date
        </label>
        <input 
          v-model="cardDetails.expiry"
          type="text"
          id="expiryDate"
          class="form-input"
          placeholder="MM/YY"
          maxlength="5"
          @input="formatExpiryDate"
          required
        />
      </div>

      <div class="form-group">
        <label for="cvv">
          <i class="fas fa-lock"></i>
          CVV
        </label>
        <input 
          v-model="cardDetails.cvv"
          type="text"
          id="cvv"
          class="form-input"
          placeholder="123"
          maxlength="4"
          @input="formatCVV"
          required
        />
      </div>
    </div>

    <div class="form-group">
      <label for="cardName">
        <i class="fas fa-user"></i>
        Cardholder Name
      </label>
      <input 
        v-model="cardDetails.name"
        type="text"
        id="cardName"
        class="form-input"
        placeholder="Name as shown on card"
        required
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreditCardFields',
  
  data() {
    return {
      cardDetails: {
        number: '',
        expiry: '',
        cvv: '',
        name: ''
      }
    }
  },

  watch: {
    cardDetails: {
      deep: true,
      handler(newDetails) {
        this.$emit('card-details-updated', newDetails)
      }
    }
  },

  methods: {
    formatCardNumber(event) {
      let value = event.target.value.replace(/\D/g, '');
      value = value.replace(/(.{4})/g, '$1 ').trim();
      this.cardDetails.number = value;
    },

    formatExpiryDate(event) {
      let value = event.target.value.replace(/\D/g, '');
      if (value.length > 2) {
        value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
      }
      this.cardDetails.expiry = value;
    },

    formatCVV(event) {
      this.cardDetails.cvv = event.target.value.replace(/\D/g, '');
    }
  }
}
</script>

<style scoped>
.credit-card-fields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

label i {
  color: #4CAF50;
  font-size: 1rem;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  color: #2c3e50;
  transition: all 0.3s ease;
  width: 100%;
}

.form-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.form-input::placeholder {
  color: #a0aec0;
}

.form-input:hover {
  border-color: #cbd5e0;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .credit-card-fields {
    gap: 1rem;
  }
}

/* Card brand logos could be added here */
.card-brands {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.card-brand {
  width: 40px;
  height: 25px;
  object-fit: contain;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.card-brand.active {
  opacity: 1;
}
</style>