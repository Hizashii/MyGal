import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/Login.vue';
import Discover from '@/views/Discover.vue';
import Cart from '@/views/Cart.vue'; // Import the Cart component

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/discover',
    name: 'Discover',
    component: Discover,
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart, // Add the Cart route
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});



// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Check if the user is authenticated
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // Redirect to login if trying to access a protected route without authentication
    next('/login');
  } else {
    // Proceed to the route
    next();
  }
});

export default router;
