// src/router/vueRouter.js
import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

// Import components directly
import HomeView from '../views/HomeView.vue'
import SignInView from '../views/SignInView.vue'
import SignUpView from '../views/SignUpView.vue'
import CartView from '../views/CartView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import OrderView from '../views/OrderView.vue'
import OrderDetails from '../components/order/OrderDetails.vue'
import AdminView from '../views/AdminView.vue'
import ProductForm from '../components/admin/ProductForm.vue';
import ManageOrders from '../views/ManageOrders.vue'
import ManageUsers from '../views/ManageUsers.vue'
import ProfileView from '../views/ProfileView.vue'
import AboutUs from '../views/AboutUs.vue'
import ContactUs from '../views/ContactUs.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutUs
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactUs
  },
  {
    path: '/admin/add',
    name: 'add-product',
    component: ProductForm,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/orders',
    name: 'manage-orders',
    component: ManageOrders,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/users',
    name: 'manage-users',
    component: ManageUsers,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/products/:id/edit',
    name: 'edit-product',
    component: ProductForm,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/manage',
    name: 'manage-products',
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/login',
    name: 'login',
    component: SignInView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUpView
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutView,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'orders',
    component: OrderView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/orders/:orderId',
    name: 'order-details',
    component: OrderDetails,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  // If page is loading for the first time, check auth state
  if (store.state.auth.isLoading) {
    await store.dispatch('auth/checkAuthState');
  }

  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const isAdmin = store.getters['auth/isAdmin'];

  // Check if route requires auth
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  // Handle auth required routes
  if (requiresAuth && !isAuthenticated) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  // Handle admin required routes
  if (requiresAdmin && !isAdmin) {
    next({ path: '/' });
    return;
  }

  // Handle authenticated user trying to access login
  if (isAuthenticated && to.name === 'login') {
    const redirectPath = to.query.redirect || '/';
    next(redirectPath);
    return;
  }

  // If none of the above, proceed normally
  next();
});

export default router