<template>
  <div class="discover-page">
    <!-- Top Navigation -->
    <TopNav @navigate="navigate" @logOut="logOut" @goToCart="goToCart" />

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

      <!-- Sorting Dropdown -->
      <div class="sorting-section">
        <label for="sort-by">Sort By: </label>
        <select id="sort-by" v-model="selectedSort" @change="sortItems">
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="nameAsc">Artist Name: A-Z</option>
          <option value="nameDesc">Artist Name: Z-A</option>
        </select>
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


      <!-- Loading and Error Handling -->
      <div v-if="loading" class="loading">Loading artworks...</div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth, signOut } from '../firebaseConfig'; // Import Firebase authentication and signOut
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import TopNav from '@/components/TopNav.vue'; // Import TopNav component

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
  components: {
    TopNav, 
  },
  setup() {
    const router = useRouter(); 

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

    const selectedSort = ref('priceAsc'); // Default sorting option
    const loading = ref(true); // Loading state
    const error = ref(null); // Error state
    const db = getFirestore(); // Initialize Firestore

    // Fetching artworks from Firestore
    const fetchDiscoverItems = async () => {
      const discoverCollection = collection(db, 'discoverItems'); // Reference to discoverItems collection
      try {
        const snapshot = await getDocs(discoverCollection);
        snapshot.forEach(doc => {
          const data = doc.data();
          carousels.value[0].items.push({
            id: doc.id,
            image: data.image,
            artist: data.artist,
            price: data.price,
          });
        });
      } catch (err) {
        console.error('Error fetching discover items:', err.message);
        error.value = 'Failed to load artworks.';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchDiscoverItems(); // Fetch artworks on component mount
    });

    // Sorting logic
    const sortItems = () => {
      carousels.value.forEach(carousel => {
        carousel.items.sort((a, b) => {
          switch (selectedSort.value) {
            case 'priceAsc':
              return a.price - b.price; // Sort by price ascending
            case 'priceDesc':
              return b.price - a.price; // Sort by price descending
            case 'nameAsc':
              return a.artist.localeCompare(b.artist); // Sort by name A-Z
            case 'nameDesc':
              return b.artist.localeCompare(a.artist); // Sort by name Z-A
            default:
              return 0;
          }
        });
      });
    };

    const navigate = (page) => {
      if (page === 'profile') {
        router.push('/profile');
      } else if (page === 'discover') {
        router.push('/discover');
      }
    };

    const logOut = async () => {
      try {
        await signOut(auth); // Use Firebase's signOut method to log out
        router.push('/login');
      } catch (error) {
        console.error('Error during sign out:', error.message);
      }
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
      selectedSort,
      sortItems,
      navigate,
      logOut,
      goToCart,
      addToCart,
      loading,
      error,
    };
  },
};
</script>

<style scoped>



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

/* Set main-content background to white */
.main-content {
  background-color: #fff;
  padding: 20px;
  flex: 1;
  width: 100%;
}

.carousel-section {
  margin-bottom: 40px;
}

.carousel-title {
  font-size: 22px;
  font-weight: 450;
  margin-bottom: 20px;
  text-align: center;
}

.carousel {
  display: flex;
  flex-wrap: wrap; /* Allow items to wrap onto the next line */
  margin: -5px; /* Adjust margins for consistent spacing */
}

.carousel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  flex: 1 0 calc(33.33% - 10px); /* Adjust width to take 1/3 of the container */
  margin: 5px; /* Margin around each item */
}


.artist-name {
  font-size: 18px;
  margin-bottom: 10px;
  color: black;
}

.carousel-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 10px;
}

.item-details {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 18px;
}

.price {
  font-weight: bold;
  color: black;
}

.add-button {
  background-color: #55434f;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.add-button:hover {
  background-color: #271b28;
  transform: scale(1.05);
}

/* Sorting Section */
.sorting-section {
  color: black;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.sorting-section label {
  margin-right: 10px;
  font-size: 16px;
}

.sorting-section select {
  padding: 5px 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
}

</style>
