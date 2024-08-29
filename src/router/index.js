import { createRouter, createWebHistory } from 'vue-router';

// Import components from the correct path
import LoginPage from '../views/Login.vue';


// Define your routes
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    // No authentication required for the login page
  }
];

// Create the router instance
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