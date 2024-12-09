<template>
    <div class="profile-header">
      <div class="avatar">
        <img :src="profilePhotoUrl" alt="User Avatar" v-if="profilePhotoUrl" />
        <input
          ref="profilePhotoInput"
          type="file"
          accept="image/*"
          @change="uploadProfilePhoto"
          style="display: none"
        />
      </div>
      <div class="user-info">
        <h1>{{ user?.email || 'Guest' }}</h1>
        <p>Artist | Creator | Dreamer</p>
        <div class="follow-info">
          <span><strong>{{ followingCount }}</strong> Following</span>
          <span><strong>{{ followersCount }}</strong> Followers</span>
        </div>
      </div>
  
      <div class="hamburger" @click="toggleMenu">
        <div :class="{ open: isMenuOpen }"></div>
        <div :class="{ open: isMenuOpen }"></div>
        <div :class="{ open: isMenuOpen }"></div>
      </div>
  
      <transition name="fade">
        <div class="menu" v-if="isMenuOpen">
          <button @click="triggerProfilePhotoUpload">Upload Profile Photo</button>
        </div>
      </transition>

      <input
        ref="galleryPhotoInput"
        type="file"
        accept="image/*"
        multiple
        @change="preparePhotosForUpload"
        style="display: none;"
      />
    </div>
  </template>
  
  <script>
  import { ref, nextTick } from 'vue';
  import { storage } from '../firebaseConfig'; 
  import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
  
  export default {
    props: {
      user: {
        type: Object,
        required: true,
      },
      profilePhotoUrl: {
        type: String,
        required: true,
      },
      followingCount: {
        type: Number,
        required: true,
      },
      followersCount: {
        type: Number,
        required: true,
      },
    },
    setup(props, { emit }) {
      const isMenuOpen = ref(false);
      const profilePhotoInput = ref(null);
      const galleryPhotoInput = ref(null);
  
      const toggleMenu = () => {
        isMenuOpen.value = !isMenuOpen.value;
      };
  
      const triggerProfilePhotoUpload = async () => {
        await nextTick(); 
        profilePhotoInput.value?.click(); 
      };
  
      const uploadProfilePhoto = async (event) => {
        const file = event.target.files[0];
        if (!file || !props.user) return;
  
        const storageReference = storageRef(
          storage,
          `profile_photos/${props.user.uid}/${file.name}`
        );
  
        try {
          await uploadBytes(storageReference, file);
          const url = await getDownloadURL(storageReference);
          emit('updateProfilePhoto', url); 
        } catch (error) {
          console.error('Error uploading profile photo:', error.message);
        }
      };
  
      const triggerGalleryPhotoUpload = async () => {
        await nextTick();
        galleryPhotoInput.value?.click(); 
      };
  
      const preparePhotosForUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (!files.length) return; 
        for (const file of files) {
          await uploadPhotoToGallery(file);
        }
      };
  
      const uploadPhotoToGallery = async (file) => {
        const storageReference = storageRef(
          storage,
          `gallery_photos/${props.user.uid}/${file.name}`
        );
  
        try {
          await uploadBytes(storageReference, file);
          const url = await getDownloadURL(storageReference);
          emit('addPhotoToGallery', { url, price: 0, published: false }); 
        } catch (error) {
          console.error('Error uploading gallery photo:', error.message);
        }
      };
  
      return {
        isMenuOpen,
        toggleMenu,
        triggerProfilePhotoUpload,
        uploadProfilePhoto,
        triggerGalleryPhotoUpload,
        preparePhotosForUpload,
        profilePhotoInput, 
        galleryPhotoInput, 
      };
    },
  };
  </script>
  <style scoped>
  .profile-header {
    background-color: white;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    position: relative;
    transition: all 0.3s ease;
    flex-wrap: wrap; 
  }
  
  .profile-header:hover {
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
  }
  
  .avatar {
    cursor: pointer; 
  }
  
  .avatar img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 3px solid #A982AA;
    transition: transform 0.3s ease;
  }
  
  .avatar img:hover {
    transform: scale(1.05);
  }
  
  .user-info {
    color: black;
    margin-left: 20px;
    flex: 1; 
  }
  
  .user-info h1 {
    font-size: 24px;
    margin-bottom: 8px;
    color: #A982AA; 
  }
  
  .user-info p {
    font-size: 14px;
    color: black;
  }
  
  .follow-info {
    display: flex;
    flex-wrap: wrap; 
  }
  
  .follow-info span {
    display: inline-block;
    margin-right: 15px;
    color: black;
  }
  
  .hamburger {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 20px;
    margin-left: auto;
  }
  
  .hamburger div {
    height: 3px;
    background: #A982AA;
    transition: all 0.3s ease;
  }
  
  .hamburger div.open:first-child {
    transform: rotate(45deg) translate(5px, 5px);
  }
  
  .hamburger div.open:nth-child(2) {
    opacity: 0;
  }
  
  .hamburger div.open:last-child {
    transform: rotate(-45deg) translate(5px, -5px);
  }
  

  .menu {
    position: absolute;
    top: 70px;
    right: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    padding: 10px;
    transition: opacity 0.3s ease;
  }
  
  .menu button {
    background: none;
    border: none;
    color: black;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .menu button:hover {
    background: #A982AA; 
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

@media (max-width: 480px) {
  .profile-header {
    flex-direction: column; 
    align-items: center; 
    padding: 15px; 
  }

  .avatar img {
    width: 80px;
    height: 80px;
  }

  .user-info {
    text-align: center; 
    margin-left: 0; 
    margin-top: 10px; 
  }

  .user-info h1 {
    font-size: 20px; 
  }

  .user-info p {
    font-size: 12px; 
  }

  .follow-info {
    display: flex;
    flex-direction: column; 
    align-items: center; 
    margin-top: 10px; 
  }

  .hamburger {
    margin-left: auto; 
  }

  .menu {
    top: 60px; 
  }

  .menu button {
    padding: 6px 10px; 
  }
}

  </style>