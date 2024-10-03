
<template>
  <div class="discover-page">
    <!-- Top Navigation -->
    <div class="top-nav">
      <img src="@/images/mygal-logo-black.png" alt="MyGal Logo" class="logo">
      <div class="nav-buttons">
        <button @click="navigate('discover')">Discover</button>
        <button @click="navigate('profile')">My Profile</button>
        <button @click="logOut">Log Out</button>
        <!-- Cart Button -->
        <button @click="goToCart" class="cart-button">
          <img src="@/images/cart.png" alt="Cart Icon" class="cart-icon">
        </button>
      </div>
    </div>

    <!-- Hero Image Section -->
    <div class="hero-section">
      <video class="hero-video" autoplay muted loop>
        <source src="@/videos/Video.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <div class="hero-text">+60 000 PEOPLE CHOSE MYGAL</div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="title">
        <h1>Discover more art</h1>
      </div>

      <!-- Carousels -->
      <div class="carousel-section" v-for="(carousel, index) in carousels" :key="index">
        <h2 class="carousel-title">{{ carousel.title }}</h2>
        <div class="carousel">
          <div class="carousel-item" v-for="item in carousel.items" :key="item.id">
            <div class="artist-name">{{ item.artist }}</div>
            <img :src="item.image" :alt="item.artist" class="carousel-image">
            <div class="item-details">
              <div class="price">${{ item.price }}</div>
              <button @click="addToCart(item)" class="add-button">Add</button>
            </div>
          </div>
        </div>
      </div>


       <!-- Discover More Button -->
       <div class="discover-more-container">
        <button @click="discoverMore" class="discover-more-button">Discover More</button>
      </div>

    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter

import art1 from '@/images/more.jpg';
import art2 from '@/images/treva.jpg';
import art3 from '@/images/lodka.jpg';
import art4 from '@/images/lodki.jpg';
import art5 from '@/images/OceanWaves-SamuelEarp-OilPainting.jpg';
import art6 from '@/images/blue.jpeg';
import art7 from '@/images/blueblue.jpeg';
import art8 from '@/images/pink.jpg';
import art9 from '@/images/italia.jpg';

export default {
  setup() {
    const router = useRouter(); // Get the router instance

    const carousels = ref([
      {
        items: [
          { id: 1, image: art1, artist: '@kateandersen', price: 50 },
          { id: 2, image: art2, artist: '@miketheartist', price: 75 },
          { id: 3, image: art3, artist: '@nigelspictures', price: 100 },
        ],
      },
      {
        items: [
          { id: 4, image: art4, artist: '@callmeart', price: 60 },
          { id: 5, image: art5, artist: '@sealover', price: 80 },
          { id: 6, image: art6, artist: '@bluesoul', price: 90 },
        ],
      },
      {
        items: [
          { id: 7, image: art7, artist: '@mariaclarck', price: 70 },
          { id: 8, image: art8, artist: '@hotartonboard', price: 85 },
          { id: 9, image: art9, artist: '@mynameismark', price: 95 },
        ],
      },
    ]);

    const navigate = (page) => {
      if (page === 'profile') {
        router.push('/profile');
      } else if (page === 'discover') {
        router.push('/discover');
      }
    };

    const logOut = () => {
      localStorage.removeItem('authToken');
      router.push('/login');
    };

    const goToCart = () => {
      router.push('/cart');
    };

    const addToCart = (item) => {
      let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const foundItem = cartItems.find(i => i.id === item.id);
      if (foundItem) {
        foundItem.quantity += 1;
      } else {
        cartItems.push({ ...item, quantity: 1 });
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      router.push('/cart');
    };

  

    return {
      carousels,
      navigate,
      logOut,
      goToCart,
      addToCart,
    };
  },
};
</script>

<style scoped>

.discover-more-container {
  display: flex;
  justify-content: center;
 
}

.discover-more-button {
  background-color: #55434f;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 19px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.discover-more-button:hover {
  background-color: #271b28;
  transform: scale(1.05);
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

.title h1 {
  color: black;
  font-weight: 450;
}

.discover-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  overflow-y: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  width: 80px;
  height: 35px;
}

.hero-section {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
}

.hero-video {
  opacity: 70%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.hero-text {
  position: absolute;
  bottom: 230px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 24px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  z-index: 1;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #f4f4f4;
  overflow-y: auto;
  padding: 20px 0;
}

.carousel-section {
  width: 100%;
  padding: 20px;
}

.carousel-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.carousel {
  display: flex;
  justify-content: center;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 0;
}

.carousel-item {
  width: 320px;
  height: 320px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Align items to the top */
  font-size: 18px;
}

.carousel-image {
  width: 100%;
  height: 220px; /* Adjusted to fit the price under the image */
  object-fit: cover;
  border-radius: 10px;
}

.artist-name {
  margin-bottom: 5px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.item-details {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.price {
  margin-right: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #555;
}

.add-button {
  background-color: #A982AA;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.add-button:hover {
  background-color: #5e495f;
  transform: scale(1.05);
}
</style>
