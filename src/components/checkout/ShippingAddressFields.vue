<!-- ShippingAddressFields.vue -->
<template>
  <div class="shipping-fields">
    <div class="form-row">
      <div class="form-group">
        <label for="firstName">First Name</label>
        <input 
          v-model="address.firstName"
          type="text"
          id="firstName"
          class="form-input"
          required
          placeholder="Enter your first name"
        />
      </div>
      
      <div class="form-group">
        <label for="lastName">Last Name</label>
        <input 
          v-model="address.lastName"
          type="text"
          id="lastName"
          class="form-input"
          required
          placeholder="Enter your last name"
        />
      </div>
    </div>

    <div class="form-group">
      <label for="street">Street Address</label>
      <input 
        v-model="address.street"
        type="text"
        id="street"
        class="form-input"
        required
        placeholder="Enter your street address"
      />
    </div>

    <div class="form-row three-cols">
      <div class="form-group">
        <label for="city">City</label>
        <input 
          v-model="address.city"
          type="text"
          id="city"
          class="form-input"
          required
          placeholder="City"
        />
      </div>

      <div class="form-group">
        <label for="state">State</label>
        <select 
          v-model="address.state"
          id="state"
          class="form-input"
          required
        >
          <option value="">Select State</option>
          <option v-for="state in states" :key="state" :value="state">
            {{ state }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="zipCode">ZIP Code</label>
        <input 
          v-model="address.zipCode"
          type="text"
          id="zipCode"
          class="form-input"
          required
          placeholder="ZIP Code"
          pattern="[0-9]{5}"
        />
      </div>
    </div>

    <div class="form-group">
      <label for="phone">Phone Number</label>
      <input 
        v-model="address.phone"
        type="tel"
        id="phone"
        class="form-input"
        required
        placeholder="(XXX) XXX-XXXX"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShippingAddressFields',
  
  data() {
    return {
      address: {
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        phone: ''
      },
      states: [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
      ]
    }
  },

  watch: {
    address: {
      deep: true,
      handler(newAddress) {
        this.$emit('address-updated', newAddress)
      }
    }
  }
}
</script>

<style scoped>
.shipping-fields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-row.three-cols {
  grid-template-columns: 2fr 1fr 1fr;
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

select.form-input {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

@media (max-width: 768px) {
  .form-row, .form-row.three-cols {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .shipping-fields {
    gap: 1rem;
  }
}
</style>