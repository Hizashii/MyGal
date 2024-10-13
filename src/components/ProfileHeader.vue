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
  
      <!-- Hamburger Menu Button -->
      <div class="hamburger" @click="toggleMenu">
        <div :class="{ open: isMenuOpen }"></div>
        <div :class="{ open: isMenuOpen }"></div>
        <div :class="{ open: isMenuOpen }"></div>
      </div>
  
      <!-- Menu Items -->
      <transition name="fade">
        <div class="menu" v-if="isMenuOpen">
          <button @click="triggerProfilePhotoUpload">Upload Profile Photo</button>
        </div>
      </transition>
  
      <!-- Hidden Inputs for Gallery Upload -->
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
  import { storage } from '../firebaseConfig'; // Ensure the storage is imported
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
        await nextTick(); // Ensure the DOM is updated
        profilePhotoInput.value?.click(); // Use optional chaining
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
          emit('updateProfilePhoto', url); // Emit event to parent component
        } catch (error) {
          console.error('Error uploading profile photo:', error.message);
        }
      };
  
      const triggerGalleryPhotoUpload = async () => {
        await nextTick(); // Ensure the DOM is updated
        galleryPhotoInput.value?.click(); // Use optional chaining
      };
  
      const preparePhotosForUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (!files.length) return; // If no files, do nothing
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
          emit('addPhotoToGallery', { url, price: 0, published: false }); // Emit event to parent component
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
        profilePhotoInput, // Expose the ref for the profile photo input
        galleryPhotoInput, // Expose the ref for the gallery photo input
      };
    },
  };
  </script>
  
  <style scoped>
  .profile-header {
    background: linear-gradient(135deg, #1e1e2f, #2a2a3c); /* Futuristic gradient background */
    border-radius: 15px; /* Rounded corners */
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); /* Soft shadow for depth */
    display: flex;
    align-items: center;
    position: relative; /* Needed for the dropdown menu */
    transition: all 0.3s ease; /* Smooth transitions for hover effects */
  }
  
  .profile-header:hover {
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5); /* Enhanced shadow on hover */
  }
  
  .avatar img {
    width: 100px; /* Example size */
    height: 100px; /* Example size */
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.5); /* Semi-transparent border */
    transition: transform 0.3s ease; /* Smooth scale effect */
  }
  
  .avatar img:hover {
    transform: scale(1.05); /* Scale up on hover */
  }
  
  .user-info {
    color: #ffffff; /* Text color */
    margin-left: 20px; /* Spacing between avatar and user info */
  }
  
  .follow-info span {
    display: inline-block;
    margin-right: 15px; /* Spacing between following/followers */
    color: rgba(255, 255, 255, 0.7); /* Slightly transparent white */
  }
  
  .hamburger {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30px; /* Hamburger width */
    height: 20px; /* Hamburger height */
    margin-left: auto; /* Push to the right */
  }
  
  .hamburger div {
    height: 3px;
    background: #ffffff; /* Hamburger lines color */
    transition: all 0.3s ease; /* Smooth transitions for animations */
  }
  
  .hamburger div.open:first-child {
    transform: rotate(45deg) translate(5px, 5px); /* Top line */
  }
  
  .hamburger div.open:nth-child(2) {
    opacity: 0; /* Hide middle line */
  }
  
  .hamburger div.open:last-child {
    transform: rotate(-45deg) translate(5px, -5px); /* Bottom line */
  }
  
  .menu {
    position: absolute; /* Dropdown menu positioning */
    top: 70px; /* Distance from the header */
    right: 20px; /* Distance from the right */
    background: rgba(255, 255, 255, 0.1); /* Transparent background */
    border-radius: 10px; /* Rounded corners */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* Soft shadow */
    backdrop-filter: blur(10px); /* Frosted glass effect */
    padding: 10px; /* Padding inside menu */
    transition: opacity 0.3s ease; /* Smooth fade effect */
  }
  
  .menu button {
    background: none; /* No background */
    border: none; /* No border */
    color: white; /* Text color */
    padding: 8px 15px; /* Button padding */
    border-radius: 5px; /* Rounded button */
    cursor: pointer; /* Pointer cursor */
    transition: background 0.3s; /* Transition for hover */
  }
  
  .menu button:hover {
    background: rgba(255, 255, 255, 0.2); /* Light hover effect */
  }
  
  /* Transition effects */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter,
  .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
  }
  </style>
  