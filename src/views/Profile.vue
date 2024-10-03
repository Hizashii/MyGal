<template>
  <div class="profile-page">
    <!-- Top Navigation -->
    <div class="top-nav">
      <img src="@/images/mygal-logo-whitish.png" alt="MyGal Logo" class="logo">
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

    <!-- Profile Header -->
    <div class="profile-header">
      <div class="avatar">
        <img src="@/images/artist2.jpg" alt="User Avatar">
      </div>
      <div class="user-info">
        <h1>@kallythedreamer</h1>
        <p>Artist | Creator | Dreamer</p>
        <div class="follow-info">
          <span><strong>120</strong> Following</span>
          <span><strong>300</strong> Followers</span>
        </div>
      </div>
    </div>

    <!-- Gallery Section -->
    <div class="gallery-section">
      <h2>Your Gallery</h2>
      <div class="gallery">
        <div class="gallery-item" v-for="index in 8" :key="index">
          <img :src="'https://source.unsplash.com/random/200x200?art&' + index" alt="Artwork">+
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
      this.$router.push('/cart');
    }
  }
};
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: white;
  color: #e0e0e0;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #1f1f1f;
  border-bottom: 1px solid #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.logo {
  width: 80px;
  height: 35px;
}

.nav-buttons button {
  background: none;
  border: none;
  font-size: 16px;
  margin-left: 15px;
  cursor: pointer;
  color: #f5f2f2;
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

/* Profile Header Styles */
.profile-header {
  display: flex;
  align-items: center;
  padding: 40px 20px;
  background-color: #1e1e1e;
  border-bottom: 1px solid #333;
  flex-shrink: 0;
}

.avatar img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid #333;
}

.user-info {
  margin-left: 20px;
}

.user-info h1 {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
}

.user-info p {
  margin: 5px 0;
  color: #b0b0b0;
}

.follow-info {
  margin-top: 10px;
  display: flex;
  gap: 20px;
}

.follow-info span {
  font-size: 16px;
  color: #e0e0e0;
}

/* Gallery Section */
.gallery-section {
  flex: 1;
  padding: 20px;
  background-color: #121212;
}

.gallery-section h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-around;
}

.gallery-item {
  width: calc(25% - 10px);
  background-color: #1e1e1e;
  border-radius: 10px;
  overflow: hidden;
}

.gallery-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>
