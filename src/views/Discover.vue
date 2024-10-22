<template>
  <div class="discover-page">
    <TopNav @navigate="navigate" @logOut="logOut" @goToCart="goToCart" />

    <div class="hero-section">
      <video class="hero-video" autoplay muted loop>
        <source src="@/videos/Video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div class="hero-text">+60 000 PEOPLE CHOSE MYGAL</div>
    </div>

    <div class="main-content">
      <div class="title">
        <h1>Discover more art</h1>
      </div>

      <div class="sorting-section">
        <label for="sort-by">Sort By: </label>
        <select id="sort-by" v-model="selectedSort" @change="sortItems">
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="nameAsc">Artist Name: A-Z</option>
          <option value="nameDesc">Artist Name: Z-A</option>
        </select>
      </div>

      <div class="carousel-section" v-for="(carousel, index) in carousels" :key="index">
        <h2 class="carousel-title">{{ carousel.title }}</h2>
        <div class="carousel">
          <div class="carousel-item" v-for="item in carousel.items" :key="item.id">
            <div class="artist-name">{{ item.artist }}</div>
            <img :src="item.image" :alt="item.artist" class="carousel-image" />
            <div class="item-details">
              <div class="price">${{ item.price }}</div>
              <button @click="addToCart(item)" class="add-button">Add</button>
              <button @click="removeItem(item.id)" class="remove-button">Remove</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="loading">Loading artworks...</div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth, signOut } from '../firebaseConfig'; 
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import TopNav from '@/components/TopNav.vue'; 

export default {
  components: {
    TopNav,
  },
  setup() {
    const router = useRouter();

    const carousels = ref([
      {
        title: "Your Artworks",
        items: [], 
      },
    ]);

    const selectedSort = ref('priceAsc'); 
    const loading = ref(true); 
    const error = ref(null); 
    const db = getFirestore(); 

    const fetchDiscoverItems = async () => {
      const discoverCollection = collection(db, 'discoverItems'); 
      try {
        const snapshot = await getDocs(discoverCollection);
        const removedIds = JSON.parse(localStorage.getItem('removedIds')) || []; 
        
        snapshot.forEach(doc => {
          const data = doc.data();
          const id = doc.id;
          if (!removedIds.includes(id)) {
            carousels.value[0].items.push({
              id,
              image: data.image,
              artist: data.artist,
              price: data.price,
            });
          }
        });
      } catch (err) {
        console.error('Error fetching discover items:', err.message);
        error.value = 'Failed to load artworks.';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchDiscoverItems(); 
    });

    const sortItems = () => {
      carousels.value.forEach(carousel => {
        carousel.items.sort((a, b) => {
          switch (selectedSort.value) {
            case 'priceAsc':
              return a.price - b.price; 
            case 'priceDesc':
              return b.price - a.price; 
            case 'nameAsc':
              return a.artist.localeCompare(b.artist); 
            case 'nameDesc':
              return b.artist.localeCompare(a.artist); 
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
        await signOut(auth); 
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

    const removeItem = (itemId) => {
   
      let removedIds = JSON.parse(localStorage.getItem('removedIds')) || [];
      removedIds.push(itemId);
      localStorage.setItem('removedIds', JSON.stringify(removedIds));

      const index = carousels.value[0].items.findIndex(item => item.id === itemId);
      if (index !== -1) {
        carousels.value[0].items.splice(index, 1); 
      }
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
      removeItem, 
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
  background-color: #fff;
  padding: 20px;
}

.carousel-section {
  margin-bottom: 40px;
}

.carousel-title {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

.carousel {
  display: flex;
  flex-wrap: wrap;
}

.carousel-item {
  flex: 1 0 21%; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); 
  padding: 10px; 
  background-color: #f9f9f9; 
  border-radius: 8px; 
  margin: 5px; 
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

.remove-button {
  background-color: #d9534f; 
  color: white;
  border: none;
  border-radius: 25px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px; 
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.remove-button:hover {
  background-color: #c9302c;
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
  background-color: #fff;
  padding: 20px;
}

.carousel-section {
  margin-bottom: 40px;
}

.carousel-title {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

.carousel {
  display: flex;
  flex-wrap: wrap;
}

.carousel-item {
  flex: 1 0 21%; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); 
  padding: 10px; 
  background-color: #f9f9f9; 
  border-radius: 8px; 
  margin: 5px; 
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

.remove-button {
  background-color: #d9534f; 
  color: white;
  border: none;
  border-radius: 25px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px; 
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.remove-button:hover {
  background-color: #c9302c;
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
