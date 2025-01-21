<template>
    <div class="contact-us-container">
      <h1 class="page-title">Get in Touch</h1>
      <div class="contact-us-content">
        <div class="contact-section">
          <h2>Send Us a Message</h2>
          <form @submit.prevent="submitForm" class="contact-form">
            <div class="form-group">
              <label for="name" class="form-label">Your Name</label>
              <input type="text" id="name" v-model="name" required class="form-input" />
            </div>
            <div class="form-group">
              <label for="email" class="form-label">Your Email</label>
              <input type="email" id="email" v-model="email" required class="form-input" />
            </div>
            <div class="form-group">
              <label for="message" class="form-label">Your Message</label>
              <textarea id="message" v-model="message" required class="form-input"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Send Message</button>
          </form>
        </div>
        <div class="contact-section">
          <h2>Our Details</h2>
          <div class="contact-info">
            <div class="info-item">
              <i class="fas fa-envelope"></i>
              <p><strong>Email:</strong> {{ email }}</p>
            </div>
            <div class="info-item">
              <i class="fas fa-phone"></i>
              <p><strong>Phone:</strong> {{ phone }}</p>
            </div>
            <div class="info-item">
              <i class="fas fa-map-marker-alt"></i>
              <p><strong>Address:</strong> 123 Main Street, Anytown USA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ContactUs',
    data() {
      return {
        name: '',
        email: '',
        message: '',
      };
    },
    computed: {
      email() {
        return 'support@plentycart.com';
      },
      phone() {
        return '(555) 123-4567';
      },
    },
    methods: {
      submitForm() {
        // Implement form submission logic here
        console.log('Form submitted:', {
          name: this.name,
          email: this.email,
          message: this.message,
        });
        // Reset the form
        this.name = '';
        this.email = '';
        this.message = '';
      },
    },
  };
  </script>
  
  <style scoped>
  .contact-us-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    display: contents;
  }
  
  .page-title {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 40px;
    color: #2c3e50;
  }
  
  .contact-us-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 40px;
  }
  
  .contact-section {
    background-color: #f8f9fa;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .contact-section h2 {
    font-size: 1.8rem;
    margin-bottom: 20px;
    color: #2c3e50;
  }
  
  .contact-form .form-group {
    margin-bottom: 20px;
  }
  
  .contact-form .form-label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #2c3e50;
  }
  
  .contact-form .form-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: border-color 0.3s ease;
  }
  
  .contact-form .form-input:focus {
    outline: none;
    border-color: #4CAF50;
  }
  
  .contact-form textarea.form-input {
    height: 150px;
    resize: vertical;
  }
  
  .btn {
    display: inline-block;
    padding: 10px 20px;
    border-radius: 4px;
    border: none;
    font-weight: 500;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-primary {
    background-color: #4CAF50;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #45a049;
  }
  
  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .info-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #555;
  }
  
  .info-item i {
    font-size: 1.2rem;
    color: #2c3e50;
  }
  </style>