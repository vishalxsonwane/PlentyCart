<template>
  <nav class="nav-container">
    <div class="nav-content">
      <!-- Logo/Brand -->
      <div class="brand-group">
          <img src="../../../store-logo.webp" alt="logo" class="brand-logo">
          <router-link :to="{ name: 'home' }" class="brand">
            PlentyCart
          </router-link>
        </div>

      <!-- Navigation Links -->
      <div class="nav-links" :class="{ 'show': isMenuOpen }">
        <router-link :to="{ name: 'home' }" class="nav-link">
          Home
        </router-link>

        <!-- Admin Dropdown -->
        <div v-if="isAdmin" class="admin-dropdown">
          <button 
            class="nav-link admin-btn"
            @click="toggleAdminMenu"
            :class="{ 'active': isAdminMenuOpen }"
          >
            <i class="fas fa-shield-alt me-1"></i>
            Admin
            <i class="fas fa-chevron-down ms-1"></i>
          </button>
          
          <div class="admin-menu" :class="{ 'show': isAdminMenuOpen }">
            <!-- <router-link 
              to="/admin"
              class="admin-link"
              @click="closeMenus"
            >
              <i class="fas fa-tachometer-alt me-2"></i>
              Dashboard
            </router-link> -->
            
            <router-link 
              to="/admin/add"
              class="admin-link"
              @click="closeMenus"
            >
              <i class="fas fa-plus me-2"></i>
              Add Product
            </router-link>
            
            <router-link 
              to="/admin/manage"
              class="admin-link"
              @click="closeMenus"
            >
              <i class="fas fa-box me-2"></i>
              Manage Products
            </router-link>
            
            <router-link 
              to="/admin/orders"
              class="admin-link"
              @click="closeMenus"
            >
              <i class="fas fa-shopping-bag me-2"></i>
              Manage Orders
            </router-link>
            
            <router-link 
              to="/admin/users"
              class="admin-link"
              @click="closeMenus"
            >
              <i class="fas fa-users me-2"></i>
              Manage Users
            </router-link>
          </div>
        </div>

        <router-link v-if="isAuthenticated && !isAdmin" :to="{ name: 'orders' }" class="nav-link">
          <i class="fas fa-history"></i>
          My Orders
        </router-link>
        
        <router-link v-if="!isAdmin" :to="{ name: 'cart' }" class="nav-link cart-link">
          <i class="fas fa-shopping-cart"></i>
          Shopping Cart
          <span v-if="cartItemCount > 0" class="cart-badge">
            {{ cartItemCount }}
          </span>
        </router-link>

        <router-link v-if="isAuthenticated && !isAdmin" :to="{ name: 'profile' }" class="nav-link">
          <i class="fas fa-user"></i>
          My Profile
        </router-link>

        <a 
          v-if="isAuthenticated"
          href="#" 
          class="nav-link"
          @click.prevent="handleLogout"
        >
          <i class="fas fa-sign-out-alt"></i>
          Logout
        </a>

        <template v-else>
          <router-link :to="{ name: 'login' }" class="nav-link">
            Sign In
          </router-link>
          <router-link :to="{ name: 'signup' }" class="nav-link signup">
            Sign Up
          </router-link>
        </template>
      </div>

      <!-- Mobile Menu Button -->
      <button 
        class="menu-btn"
        @click="toggleMenu"
      >
        <i class="fas fa-bars"></i>
      </button>
    </div>
  </nav>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'TheNavigation',
  
  data() {
    return {
      isMenuOpen: false,
      isAdminMenuOpen: false
    }
  },
  
  computed: {
    ...mapState({
      cartItemCount: state => state.cart.itemCount
    }),
    ...mapGetters('auth', [
      'isAuthenticated',
      'isAdmin'
    ])
  },
  
  methods: {
    ...mapActions('auth', ['logout']),
    
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
      if (!this.isMenuOpen) {
        this.isAdminMenuOpen = false
      }
    },
    
    toggleAdminMenu() {
      this.isAdminMenuOpen = !this.isAdminMenuOpen
    },
    
    closeMenus() {
      this.isMenuOpen = false
      this.isAdminMenuOpen = false
    },
    
    async handleLogout() {
      try {
        await this.logout()
        this.closeMenus()
        this.$router.push({ name: 'login' })
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }
  },

  watch: {
    '$route'() {
      this.closeMenus()
    }
  }
}
</script>

<style scoped>
.nav-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.brand-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 5px;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;  /* Controls spacing between logo and text */
}

.brand {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #4CAF50;
}

/* Admin Dropdown Styles */
.admin-dropdown {
  position: relative;
}

/* Admin Dropdown Styles - Updated */
.admin-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: #2c3e50; /* Matches the default color of .nav-link */
  font-weight: 500;
  font-size: 1rem; /* Adjust this value to increase text size */
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease; /* Smooth transition effect */
}

.admin-btn:hover {
  color: #4CAF50; /* Matches the hover color of .nav-link */
}

.admin-btn.active {
  background-color: #f8f9fa; /* Light gray background when active */
  color: #4CAF50; /* Matches the hover color of .nav-link */
}

.admin-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 220px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
}

.admin-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.admin-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #2c3e50;
  text-decoration: none;
  transition: all 0.2s ease;
}

.admin-link:hover {
  background-color: #f8f9fa;
  color: #4CAF50;
}

.cart-badge {
  background: #4CAF50;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
}

.signup {
  padding: 0.5rem 1rem;
  background: #4CAF50;
  color: white;
  border-radius: 4px;
}

.signup:hover {
  background: #45a049;
  color: white;
}

.menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #2c3e50;
  cursor: pointer;
  padding: 0.5rem;
}

@media (max-width: 768px) {
  .menu-btn {
    display: block;
  }

  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: white;
    padding: 1rem;
    gap: 1rem;
    display: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .nav-links.show {
    display: flex;
  }

  .admin-menu {
    position: static;
    box-shadow: none;
    min-width: 100%;
    margin-top: 0.5rem;
    display: none;
  }

  .admin-menu.show {
    display: block;
  }

  .admin-link {
    padding-left: 2.5rem;
  }
}
</style>