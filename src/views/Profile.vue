<template>
  <div class="profile-page">
    <!-- Top Navigation -->
    <TopNav />

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
      <input type="file" accept="image/*" multiple @change="preparePhotosForUpload" />
      <div v-for="(photo, index) in pendingPhotos" :key="index">
        <img :src="photo.url" alt="Artwork" style="width: 100px; height: 100px;" />
        <input type="number" v-model="photo.price" placeholder="Enter Price" />
      </div>
      <button @click="uploadGalleryPhotos">Upload All</button>
      <button @click="uploadAllToDiscover" class="upload-all-button">Upload All to Discover</button>

      <!-- Display already uploaded images -->
      <div class="gallery">
        <div class="gallery-item" v-for="(photo, index) in galleryPhotos" :key="index">
          <img :src="photo.url" alt="Artwork" />
          <p v-if="photo.price">Price: ${{ photo.price }}</p>
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
import { getFirestore, doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore'; // Firestore methods
import TopNav from '@/components/TopNav.vue'; // Import TopNav component

export default {
  components: {
    TopNav, // Register TopNav component
  },
  setup() {
    const router = useRouter();
    const user = ref(null);
    const profilePhotoUrl = ref('');
    const galleryPhotos = ref([]);
    const pendingPhotos = ref([]);
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

    const preparePhotosForUpload = (event) => {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = URL.createObjectURL(file);
        pendingPhotos.value.push({ file, url, price: null }); // Save image data locally for user to enter price
      }
    };

    const uploadGalleryPhotos = async () => {
      for (let i = 0; i < pendingPhotos.value.length; i++) {
        const { file, price } = pendingPhotos.value[i];
        const storage = getStorage();
        const storageReference = storageRef(storage, `gallery_photos/${user.value.uid}/${file.name}`);

        try {
          await uploadBytes(storageReference, file);
          const url = await getDownloadURL(storageReference);
          galleryPhotos.value.push({ url, price }); // Add URL and price to gallery photos
          await saveUserProfile(user.value.uid, { galleryPhotos: galleryPhotos.value }); // Save URLs and prices to Firestore
        } catch (error) {
          console.error('Error uploading gallery photo:', error.message);
        }
      }
      pendingPhotos.value = []; // Clear pending photos after upload
    };

    const uploadAllToDiscover = async () => {
      const discoverCollection = collection(db, 'discoverItems'); // Reference to discoverItems collection
      for (const photo of galleryPhotos.value) {
        try {
          await addDoc(discoverCollection, {
            image: photo.url,
            artist: user.value.email, // Assuming artist name is the email
            price: photo.price || 0, // Default price to 0 if not set
          });
        } catch (error) {
          console.error('Error uploading item to Discover:', error.message);
        }
      }
      console.log('All gallery photos uploaded to Discover.');
    };

    const saveUserProfile = async (uid, data) => {
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, data, { merge: true }); // Use merge to update specific fields
    };

    return {
      user,
      profilePhotoUrl,
      galleryPhotos,
      pendingPhotos,
      logOut,
      goToCart,
      uploadProfilePhoto,
      preparePhotosForUpload,
      uploadGalleryPhotos,
      uploadAllToDiscover, // Expose the function
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

.upload-all-button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #A982AA;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.upload-all-button:hover {
  background-color: #8a6c7c;
}
</style>
