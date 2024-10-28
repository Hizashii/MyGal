<template>
  <div class="top-nav">
    <router-link to="/discover">
      <img src="@/images/mygal-logo-black.png" alt="MyGal Logo" class="logo" />
    </router-link>
    
    <div class="hamburger" @click="toggleMenu">
      <div :class="['line', { 'active': isMenuOpen }]"></div>
      <div :class="['line', { 'active': isMenuOpen }]"></div>
      <div :class="['line', { 'active': isMenuOpen }]"></div>
    </div>

    <div class="nav-buttons" :class="{ 'active': isMenuOpen }">
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, signOut } from '../firebaseConfig';

export default {
  setup() {
    const router = useRouter();
    const isMenuOpen = ref(false); 

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value; 
    };

    const navigate = (page) => {
      router.push(`/${page}`);
      isMenuOpen.value = false; 
    };

    const goToCart = () => {
      router.push('/cart');
      isMenuOpen.value = false;
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
      isMenuOpen,
      toggleMenu,
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

.hamburger {
    display: none; 
    flex-direction: column;
    cursor: pointer;
}

.line {
    width: 25px;
    height: 3px;
    background-color: #0e0d0d;
    margin: 4px 0;
    transition: 0.4s;
}

.nav-buttons {
    display: flex;
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

@media (max-width: 768px) {
    .hamburger {
        display: flex; 
    }

    .nav-buttons {
        display: none; 
        flex-direction: column; 
        position: absolute; 
        right: 20px; 
        top: 60px; 
        background-color: white; 
        border: 1px solid #ddd; 
        width: 150px; 
        z-index: 5; 
    }

    .nav-buttons.active {
        display: flex;
    }

    .nav-buttons button {
        margin: 10px 0; 
    }
}
</style>
