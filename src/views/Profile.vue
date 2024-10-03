<template>
  <div class="profile-page">
    <!-- Top Navigation -->
    <div class="top-nav">
      <img src="@/images/mygal-logo-whitish.png" alt="MyGal Logo" class="logo">
      <div class="nav-buttons">
        <button @click="navigate('discover')">Discover</button>
        <button @click="navigate('profile')">My Profile</button>
        <button @click="logOut">Log Out</button>
        <button @click="goToCart" class="cart-button">
          <img src="@/images/cart.png" alt="Cart Icon" class="cart-icon">
        </button>
      </div>
    </div>

    <!-- Profile Header -->
    <div class="profile-header">
      <div class="avatar">
        <img :src="profilePhotoUrl" alt="User Avatar" v-if="profilePhotoUrl" />
        <input type="file" accept="image/*" @change="uploadProfilePhoto" v-else />
      </div>
      <div class="user-info">
        <h1>{{ user?.email || 'Guest' }}</h1>
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
      <input type="file" accept="image/*" multiple @change="uploadGalleryPhotos" />
      <div class="gallery">
        <div class="gallery-item" v-for="(photo, index) in galleryPhotos" :key="index">
          <img :src="photo" alt="Artwork" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, signOut } from '../firebaseConfig';
import { ref, onMounted } from 'vue';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firestore methods

export default {
  setup() {
    const router = useRouter();
    const user = ref(null);
    const profilePhotoUrl = ref('');
    const galleryPhotos = ref([]);

    const db = getFirestore(); // Initialize Firestore

    // Listen to authentication state changes
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        user.value = currentUser;
        await fetchUserProfile(currentUser.uid); // Fetch user profile on login
      } else {
        router.push('/login');
      }
    });

    const fetchUserProfile = async (uid) => {
      const docRef = doc(db, 'users', uid); // Path to user document in Firestore
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        profilePhotoUrl.value = data.profilePhotoUrl || ''; // Load profile photo URL
        galleryPhotos.value = data.galleryPhotos || []; // Load gallery photo URLs
      } else {
        console.log('No such document!');
      }
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

    const uploadProfilePhoto = async (event) => {
      const file = event.target.files[0];
      if (!file || !user.value) return;

      const storage = getStorage();
      const storageReference = storageRef(storage, `profile_photos/${user.value.uid}/${file.name}`);

      try {
        await uploadBytes(storageReference, file);
        const url = await getDownloadURL(storageReference);
        profilePhotoUrl.value = url; // Update profile photo URL
        await saveUserProfile(user.value.uid, { profilePhotoUrl: url }); // Save URL to Firestore
      } catch (error) {
        console.error('Error uploading profile photo:', error.message);
      }
    };

    const uploadGalleryPhotos = async (event) => {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storage = getStorage();
        const storageReference = storageRef(storage, `gallery_photos/${user.value.uid}/${file.name}`);

        try {
          await uploadBytes(storageReference, file);
          const url = await getDownloadURL(storageReference);
          galleryPhotos.value.push(url); // Add URL to gallery photos
          await saveUserProfile(user.value.uid, { galleryPhotos: galleryPhotos.value }); // Save URLs to Firestore
        } catch (error) {
          console.error('Error uploading gallery photo:', error.message);
        }
      }
    };

    const saveUserProfile = async (uid, data) => {
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, data, { merge: true }); // Use merge to update specific fields
    };

    return {
      user,
      profilePhotoUrl,
      galleryPhotos,
      navigate,
      logOut,
      goToCart,
      uploadProfilePhoto,
      uploadGalleryPhotos,
    };
  },
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
