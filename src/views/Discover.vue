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
    <div class="hero-image">
      <div class="hero-text">+60 000 PEOPLE CHOSE MYGAL</div>
    </div>
    
    <!-- Main Content -->
    <div class="main-content">
      <div class="title"><h1>Discover more art</h1></div>
      
      <!-- Carousels -->
      <div class="carousel-section" v-for="(carousel, index) in carousels" :key="index">
        <h2 class="carousel-title">{{ carousel.title }}</h2>
        <div class="carousel">
          <div class="carousel-item" v-for="item in carousel.items" :key="item.id">
            <img :src="item.image" :alt="item.name" class="carousel-image">
            <div class="artist-name">@{{ item.artist }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      carousels: [
        {
          title: 'Featured Artworks',
          items: [
            { id: 1, image: 'https://source.unsplash.com/random/200x200?art', artist: 'ArtistName1' },
            { id: 2, image: 'https://source.unsplash.com/random/200x200?art', artist: 'ArtistName2' },
            { id: 3, image: 'https://source.unsplash.com/random/200x200?art', artist: 'ArtistName3' },
          ],
        },
        {
          title: 'New Arrivals',
          items: [
            { id: 4, image: 'https://source.unsplash.com/random/200x200?art', artist: 'ArtistName4' },
            { id: 5, image: 'https://source.unsplash.com/random/200x200?art', artist: 'ArtistName5' },
            { id: 6, image: 'https://source.unsplash.com/random/200x200?art', artist: 'ArtistName6' },
          ],
        },
        {
          title: 'Popular Artists',
          items: [
            { id: 7, image: 'https://source.unsplash.com/random/200x200?art', artist: 'ArtistName7' },
            { id: 8, image: 'https://source.unsplash.com/random/200x200?art', artist: 'ArtistName8' },
            { id: 9, image: 'https://source.unsplash.com/random/200x200?art', artist: 'ArtistName9' },
          ],
        },
      ],
    };
  },
  methods: {
    navigate(page) {
      if (page === 'profile') {
        this.$router.push('/profile');
      } else if (page === 'discover') {
        this.$router.push('/discover');
      }
    },
    logOut() {
      localStorage.removeItem('authToken');
      this.$router.push('/login');
    },
    goToCart() {
      this.$router.push('/cart'); // Navigate to the Cart page
    },
  },
};
</script>

<style scoped>
/* Existing Styles */

.cart-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 10px; /* Adjust spacing as needed */
}

.cart-icon {
  width: 24px; /* Size of the cart icon */
  height: 24px;
}

.title h1 {
  color: black;
  font-weight: 450;
}

.discover-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensure page takes at least full viewport height */
  width: 100vw;
  margin: 0;
  overflow-y: auto; /* Allow vertical scrolling */
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

.hero-image {
  width: 100%;
  height: 500px;
  background-image: 
    linear-gradient(
      rgba(0, 0, 0, 0.7), 
      rgba(0, 0, 0, 0.7)
    ),
    url('@/images/sims.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-text {
  color: white;
  font-size: 24px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
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
  overflow-x: auto;
  gap: 10px;
}

.carousel-item {
  min-width: 200px;
  height: 200px;
  background-color: #ddd;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.carousel-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
}

.artist-name {
  margin-top: 5px;
  font-size: 14px;
  color: #333;
}
</style>
