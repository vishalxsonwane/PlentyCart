<template>
  <div class="footer-divider"></div>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h4>About PlentyCart</h4>
          <p>{{ aboutText }}</p>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/cart">Cart</router-link></li>
            <li><router-link to="/login" v-if="!isAuthenticated">Sign In</router-link></li>
            <li><router-link to="/about">About</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Contact Us</h4>
          <p>Email: {{ email }}</p>
          <p>Phone: {{ phone }}</p>
        </div>
        <div class="footer-section">
          <h4>Follow Us</h4>
          <div class="social-links">
            <a :href="socialLinks.facebook" target="_blank">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a :href="socialLinks.twitter" target="_blank">
              <i class="fab fa-twitter"></i>
            </a>
            <a :href="socialLinks.instagram" target="_blank">
              <i class="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
      <div class="footer-divider"></div>
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} PlentyCart. All rights reserved.</p>
        <ul>
          <li><router-link to="/privacy">Privacy Policy</router-link></li>
          <li><router-link to="/terms">Terms of Service</router-link></li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'TheFooter',
  data() {
    return {
      aboutText: 'Your one-stop shop for fresh groceries and daily essentials.',
      email: 'support@plentycart.com',
      phone: '(555) 123-4567',
      socialLinks: {
        facebook: 'https://www.facebook.com/PlentyCart',
        twitter: 'https://twitter.com/PlentyCart',
        instagram: 'https://www.instagram.com/PlentyCart'
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.footer {
  background-color: #f8f9fa;
  padding: 40px 0;
  margin-top: 40px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-section h4 {
  margin-bottom: 1rem;
}

.footer-section ul {
  list-style-type: none;
  padding: 0;
}

.footer-section li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: #333;
  text-decoration: none;
}

.footer-section a:hover {
  color: #007bff;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  color: #007bff;
  font-size: 1.2rem;
}

.footer-divider {
  border-top: 1px solid #dee2e6;
  margin-top: 20px;
  padding-top: 20px;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-bottom ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  gap: 1rem;
}

.footer-bottom a {
  color: #333;
  text-decoration: none;
}

.footer-bottom a:hover {
  color: #007bff;
}
</style>