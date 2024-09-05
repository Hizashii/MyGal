import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/Login.vue';
import Discover from '@/views/Discover.vue';
import Cart from '@/views/Cart.vue'; // Import the Cart component
import Profile from '@/views/Profile.vue'; // Import the Profile component
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
    component: Cart,
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    redirect: '/login', // Redirect root path to /login
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/login', // Redirect any unmatched paths to /login
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile, // Add the Profile route
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
