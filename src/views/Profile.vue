<!-- src/views/Profile.vue -->
<template>
  <div>
    <TopNav />
    <div class="profile-page">
      <ProfileHeader
        :user="user"
        :profilePhotoUrl="profilePhotoUrl"
        :followingCount="followingCount"
        :followersCount="followersCount"
        @updateProfilePhoto="updateProfilePhoto"
      />
      <GalleryFeed
        :user="user"
        :galleryPhotos="galleryPhotos"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'; // Ensure you're using the right imports
import { onAuthStateChanged } from 'firebase/auth'; // Correctly import onAuthStateChanged
import { auth, db } from '../firebaseConfig'; // Import your Firebase setup
import { doc, getDoc, setDoc } from 'firebase/firestore';
import ProfileHeader from '@/components/ProfileHeader.vue';
import GalleryFeed from '@/components/GalleryFeed.vue';
import TopNav from '@/components/TopNav.vue';

export default {
  components: {
    ProfileHeader,
    GalleryFeed,
    TopNav, // Make sure TopNav is registered
  },
  setup() {
    const user = ref(null);
    const profilePhotoUrl = ref('');
    const followingCount = ref(0);
    const followersCount = ref(0);
    const galleryPhotos = ref([]);

    const updateProfilePhoto = (url) => {
      profilePhotoUrl.value = url;
      // Save the updated URL to Firestore
      saveUserProfile(user.value.uid, { profilePhotoUrl: url });
    };

    const saveUserProfile = async (uid, data) => {
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, data, { merge: true });
    };

    // Auth State Change Listener
    onMounted(() => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          user.value = currentUser;
          await fetchUserProfile(currentUser.uid);
        } else {
          console.log('User not logged in.');
        }
      });
    });

    const fetchUserProfile = async (uid) => {
      const docRef = doc(db, 'users', uid);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        profilePhotoUrl.value = data.profilePhotoUrl || '';
        followingCount.value = data.followingCount || 0;
        followersCount.value = data.followersCount || 0;
        galleryPhotos.value = data.galleryPhotos || [];
      }
    };

    return {
      user,
      profilePhotoUrl,
      followingCount,
      followersCount,
      galleryPhotos,
      updateProfilePhoto,
    };
  },
};
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  padding: 20px; /* Add some padding to the profile page */
}
</style>
