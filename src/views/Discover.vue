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
              <div class="action-buttons">
                <button @click="addToCart(item)" class="add-button">Add</button>
                
                <!-- Admin-only remove button -->
                <button 
                  v-if="isAdmin || (currentUser && item.userId === currentUser.uid)" 
                  @click="removeItem(item)" 
                  class="remove-button"
                >
                  Remove
                </button>

                <!-- User interaction buttons -->
                <div v-else class="interaction-buttons">
                  <button 
                    @click="toggleLike(item)" 
                    class="like-button"
                    :class="{ 'liked': isLiked(item.id) }"
                  >
                    <i class="fas fa-heart"></i>
                    {{ item.likes?.length || 0 }}
                  </button>

                  <button @click="showCommentModal(item)" class="comment-button">
                    <i class="fas fa-comment"></i>
                    {{ item.comments?.length || 0 }}
                  </button>

                </div>
              </div>
            </div>

            <!-- Comments section (collapsed by default) -->
            <div v-if="item.showComments" class="comments-section">
               <div class="comments-list">
                   <div v-for="comment in item.comments" :key="comment.id" class="comment">
                      <strong>{{ comment.username }}:</strong> {{ comment.text }}
                   
               </div>
            </div>
  <div class="comment-input">
    <input 
      v-model="newComments[item.id]" 
      placeholder="Add a comment..."
      @keyup.enter="addComment(item)"
    />
    <button @click="addComment(item)" class="submit-comment">
      <i class="fas fa-paper-plane"></i>
    </button>
  </div>
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { auth, signOut, signInWithEmailAndPassword } from '../firebaseConfig'; 
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import TopNav from '@/components/TopNav.vue'; 

export default {
  components: {
    TopNav,
  },
  setup() {
    const router = useRouter();
    const db = getFirestore();
    const carousels = ref([{
      title: "Your Artworks",
      items: [],
    }]);
    const selectedSort = ref('priceAsc'); 
    const loading = ref(true); 
    const error = ref(null); 
    const newComments = ref({});

    const currentUser = computed(() => auth.currentUser);
    const isAdmin = computed(() => localStorage.getItem('userRole') === 'admin');

    onMounted(() => {
  const discoverRef = collection(db, 'discoverItems');
  onSnapshot(discoverRef, (snapshot) => {
    carousels.value[0].items = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
  });
});

   

    const fetchDiscoverItems = async () => {
      const discoverCollection = collection(db, 'discoverItems');
      // Use onSnapshot for real-time updates
      onSnapshot(discoverCollection, (snapshot) => {
        carousels.value[0].items = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          carousels.value[0].items.push({
            id: doc.id,
            ...data,
            showComments: false
          });
        });
        sortItems();
      });
      loading.value = false;
    };

    const toggleLike = async (item) => {
      if (!currentUser.value) {
        alert('Please log in to like artworks');
        return;
      }

      const itemRef = doc(db, 'discoverItems', item.id);
      const userId = currentUser.value.uid;

      try {
        if (isLiked(item.id)) {
          await updateDoc(itemRef, {
            likes: arrayRemove(userId)
          });
        } else {
          await updateDoc(itemRef, {
            likes: arrayUnion(userId)
          });
        }
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    };

    const isLiked = (itemId) => {
      const item = carousels.value[0].items.find(i => i.id === itemId);
      return item?.likes?.includes(currentUser.value?.uid);
    };

    const showCommentModal = (item) => {
      item.showComments = !item.showComments;
    };

    const addComment = async (item) => {
      if (!currentUser.value) {
        alert('Please log in to comment');
        return;
      }

      const comment = newComments.value[item.id];
      if (!comment?.trim()) return;

      const itemRef = doc(db, 'discoverItems', item.id);
      try {
        await updateDoc(itemRef, {
          comments: arrayUnion({
            id: Date.now().toString(),
            text: comment,
            userId: currentUser.value.uid,
            username: currentUser.value.email,
            timestamp: new Date().toISOString()
          })
        });
        newComments.value[item.id] = '';
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    };

    const removeItem = async (item) => {
      const userRole = localStorage.getItem('userRole');

      // Check if the user is admin or the owner of the item
      if (userRole === 'admin' || (currentUser.value && item.userId === currentUser.value.uid)) {
        try {
          // Delete the item from Firestore
          await deleteDoc(doc(db, 'discoverItems', item.id));

          const index = carousels.value[0].items.findIndex(i => i.id === item.id);
          if (index !== -1) {
            carousels.value[0].items.splice(index, 1); 
          }
        } catch (error) {
          console.error('Error deleting item:', error);
          alert('Failed to delete the artwork.');
        }
      } else {
        alert('You do not have permission to delete this artwork.');
      }
    };

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
        localStorage.removeItem('userRole'); 
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

    onMounted(() => {
      fetchDiscoverItems(); 
    });

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
      toggleLike,
      isLiked,
      showCommentModal,
      addComment,
      newComments,
      isAdmin,
      currentUser,
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
  opacity: 0.7;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: auto; 
  transform: translate(-50%, -50%); 
  min-height: 100%; 
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
  text-align: center;
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
  justify-content: flex-start;
}

.carousel-item {
  flex: 1 0 calc(25% - 10px); 
  max-width: calc(25% - 10px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin: 5px;
  transition: flex 0.2s ease;
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

.like-button,
.comment-button,
.add-button,
.remove-button {
  margin-left: 10px;
  background-color: #55434f; 
  color: white; 
  border: none; 
  border-radius: 5px; 
  padding: 8px 12px; 
  cursor: pointer; 
  transition: background-color 0.3s ease; 
}

.like-button:hover,
.comment-button:hover,
.add-button:hover,
.remove-button:hover {
  background-color: #55434f; 
}

.comments-section {
  margin-top: 10px;
}

.comment-input {
  display: flex;
  margin-top: 5px;
}

.comment-input input {
  flex: 1;
  margin-right: 5px;
  padding: 8px; 
  border: 1px solid #ccc; 
  border-radius: 5px; 
}

.submit-comment {
  background-color: #007bff; 
  color: white; 
  border: none; 
  padding: 5px 10px; 
  cursor: pointer; 
  border-radius: 5px; 
  transition: background-color 0.3s ease; 
}

.submit-comment:hover {
  background-color: #0056b3; 
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

.add-button,
.remove-button {
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
  margin-left: 10px; 
}

.remove-button:hover {
  background-color: #c9302c; 
  transform: scale(1.05); 
}

.comment {
  color: black; 
}

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

.delete-comment-button {
  background: none;
  border: none;
  color: red; /* Change to your preferred color */
  cursor: pointer;
  margin-left: 10px; /* Add some spacing */
}

.delete-comment-button:hover {
  opacity: 0.7; /* Add a hover effect */
}

/* Responsive Styles */
@media (max-width: 1200px) {
  .hero-text{
    display: none;
  }
  .carousel-item {
    flex: 1 0 calc(33.33% - 10px);
    max-width: calc(33.33% - 10px);
  }
}

@media (max-width: 800px) {
  .carousel-item {
    flex: 1 0 calc(50% - 10px); 
    max-width: calc(50% - 10px);
  }

  .hero-text {
    display: none;
  }
  .hero-section {
    height: 300px; 
  }

  .hero-video {
    object-fit: cover; 
    width: 100%; 
    height: auto; 
  }

}

@media (max-width: 500px) {
  .carousel-item {
    flex: 1 0 100%;
    max-width: 100%;
  }

  .hero-text {
    display: none;
  }

  .hero-section {
    height: 200px; 
  }

  .hero-video {
    object-fit: cover; 
    width: 100%; 
    height: auto; 
  }


  .top-nav {
    flex-direction: column; 
    padding: 10px; 
  }

  .sorting-section {
    flex-direction: column; 
    align-items: flex-start;
  }

  .sorting-section label,
  .sorting-section select {
    margin-bottom: 5px;
  }
}
</style>
