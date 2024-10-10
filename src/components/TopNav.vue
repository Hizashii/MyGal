<template>
    <div class="top-nav">
      <router-link to="/discover">
        <img src="@/images/mygal-logo-black.png" alt="MyGal Logo" class="logo" />
      </router-link>
      <div class="nav-buttons">
        <button @click="navigate('discover')">Discover</button>
        <button @click="navigate('profile')">My Profile</button>
        <button @click="logOut">Log Out</button>
        <button @click="goToCart" class="cart-button">
          <img src="@/images/cart.png" alt="Cart Icon" class="cart-icon" />
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { useRouter } from 'vue-router';
  import { auth, signOut } from '../firebaseConfig';
  
  export default {
    setup() {
      const router = useRouter();
  
      const navigate = (page) => {
        router.push(`/${page}`);
      };
  
      const goToCart = () => {
        router.push('/cart');
      };
  
      const logOut = async () => {
        try {
          await signOut(auth);
          router.push('/login');
        } catch (error) {
          console.error('Error during sign out:', error.message);
        }
      };
  
      return {
        navigate,
        goToCart,
        logOut,
      };
    },
  };
  </script>
  
  <style scoped>
.top-nav {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
    align-items: center;
}
  
.logo {
    width: 80px;
    height: 35px;
    cursor: pointer; 
}
  
.nav-buttons button {
  background: none;
  border: none;
  font-size: 16px;
  margin-left: 15px;
  cursor: pointer;
  color: #0e0d0d;
  transition: color 0.3s ease;
}

.nav-buttons button:hover {
  color: #A982AA;
}
  
.cart-button img {
    width: 24px;
    height: 24px;
}

.cart-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
}

.cart-icon {
  width: 24px;
  height: 24px;
}
  </style>