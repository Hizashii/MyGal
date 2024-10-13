<template>
    <div class="gallery-feed">
      <h2>Your Gallery</h2>
  
      <input
        ref="galleryPhotoInput"
        type="file"
        accept="image/*"
        multiple
        @change="preparePhotosForUpload"
        style="display: none;"
      />
      <button @click="triggerGalleryPhotoUpload" class="upload-button">Upload Photos</button>
  
      <div class="gallery">
        <div class="gallery-item" v-for="(photo, index) in galleryPhotos" :key="index">
          <img :src="photo.url" alt="Artwork" />
          <div class="overlay">
            <div class="price-container">
              <input
                type="number"
                v-model="photo.price"
                placeholder="Enter Price"
                @change="updatePhotoPrice(photo, index)"
              />
              <button @click="removePhoto(index)" class="remove-button">Remove</button>
            </div>
            <button v-if="!photo.published" @click="publishPhoto(photo, index)" class="publish-button">Publish</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch, nextTick } from 'vue';
  import { db, storage } from '../firebaseConfig'; // Import your Firebase setup
  import { doc, setDoc, collection, addDoc, getDoc } from 'firebase/firestore'; // Import getDoc
  import { deleteObject, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
  
  export default {
    props: {
      user: {
        type: Object,
        required: true,
      },
      galleryPhotos: {
        type: Array,
        required: true,
      },
    },
    setup(props) {
      const galleryPhotos = ref(props.galleryPhotos);
      const galleryPhotoInput = ref(null); // Create a ref for the file input
  
      watch(() => props.galleryPhotos, (newPhotos) => {
        galleryPhotos.value = newPhotos; // Keep local galleryPhotos in sync with props
      });
  
      const triggerGalleryPhotoUpload = async () => {
        await nextTick(); // Ensure DOM is updated
        galleryPhotoInput.value.click(); // Open the file input
      };
  
      const preparePhotosForUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (!files.length) return; // If no files, do nothing
  
        for (const file of files) {
          await uploadPhotoToGallery(file); // Handle each file
        }
      };
  
      const uploadPhotoToGallery = async (file) => {
        const storageReference = storageRef(storage, `gallery_photos/${props.user.uid}/${file.name}`);
  
        try {
          // Upload to Firebase Storage
          await uploadBytes(storageReference, file);
          const url = await getDownloadURL(storageReference);
  
          // Add the new photo to the galleryPhotos array
          const newPhoto = { url, fileName: file.name, price: 0, published: false };
          galleryPhotos.value.push(newPhoto);
  
          // Save to Firestore
          await saveUserProfile(props.user.uid, { galleryPhotos: galleryPhotos.value });
        } catch (error) {
          console.error('Error uploading gallery photo:', error.message);
        }
      };
  
      const publishPhoto = async (photo, index) => {
        const discoverCollection = collection(db, 'discoverItems');
        try {
          await addDoc(discoverCollection, {
            image: photo.url,
            artist: props.user.email,
            price: photo.price || 0,
          });
  
          galleryPhotos.value[index].published = true; // Mark photo as published
          await saveUserProfile(props.user.uid, { galleryPhotos: galleryPhotos.value });
        } catch (error) {
          console.error('Error publishing photo:', error.message);
        }
      };
  
      const updatePhotoPrice = (photo, index) => {
        galleryPhotos.value[index].price = photo.price;
        saveUserProfile(props.user.uid, { galleryPhotos: galleryPhotos.value });
      };
  
      const removePhoto = async (index) => {
        const photo = galleryPhotos.value[index];
  
        // Ensure user document exists
        const userDocRef = doc(db, 'users', props.user.uid);
        const userDoc = await getDoc(userDocRef); // Get the user document
        if (!userDoc.exists()) {
          console.error('User document does not exist.');
          return;
        }
  
        // Proceed with photo removal
        let fileName = photo.fileName;
        if (!fileName && photo.url) {
          // Extract the file name from the URL
          const urlParts = photo.url.split('?')[0].split('/');
          fileName = urlParts[urlParts.length - 1];
        }
  
        const storagePath = `gallery_photos/${props.user.uid}/${fileName}`;
        const storageReference = storageRef(storage, storagePath);
  
        try {
          console.log('Deleting file from path:', storagePath);
          await deleteObject(storageReference);
  
          // Remove from local gallery
          galleryPhotos.value.splice(index, 1);
  
          // Update user's gallery in Firestore
          await saveUserProfile(props.user.uid, { galleryPhotos: galleryPhotos.value });
        } catch (error) {
          console.error('Error removing photo:', error.message);
        }
      };
  
      const saveUserProfile = async (uid, data) => {
        const docRef = doc(db, 'users', uid);
        await setDoc(docRef, data, { merge: true });
      };
  
      return {
        galleryPhotos,
        publishPhoto,
        updatePhotoPrice,
        removePhoto,
        triggerGalleryPhotoUpload,
        preparePhotosForUpload,
        galleryPhotoInput, // Return the reference for the file input
      };
    },
  };
  </script>
  
  <style scoped>
  .gallery-feed {
    color: #ffffff; /* White text for contrast */
    margin-top: 20px; /* Margin from the top */
  }
  
  h2 {
    text-align: center; /* Centered title */
    margin-bottom: 20px; /* Space below title */
  }
  
  .upload-button {
    background-color: #007bff; /* Bootstrap primary color */
    color: white; /* White text */
    border: none; /* Remove border */
    border-radius: 5px; /* Rounded button */
    padding: 10px 15px; /* Padding inside button */
    cursor: pointer; /* Pointer cursor */
    transition: background 0.3s; /* Transition for hover effect */
    margin: 10px auto; /* Center button */
    display: block; /* Block display to center */
  }
  
  .upload-button:hover {
    background-color: #0056b3; /* Darker blue on hover */
  }
  
  .gallery {
    display: grid; /* Use grid layout */
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Responsive columns */
    gap: 15px; /* Space between items */
  }
  
  .gallery-item {
    position: relative; /* Position for the overlay */
    overflow: hidden; /* Hide overflow for nice cropping */
    border-radius: 10px; /* Rounded corners */
    transition: transform 0.3s ease; /* Animation for hover effect */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); /* Shadow effect */
  }
  
  .gallery-item:hover {
    transform: scale(1.05); /* Scale up on hover */
  }
  
  .gallery-item img {
    width: 100%; /* Full width */
    height: auto; /* Maintain aspect ratio */
    border-radius: 10px; /* Rounded corners */
    transition: opacity 0.3s ease; /* Smooth transition */
  }
  
  .overlay {
    position: absolute; /* Positioning overlay */
    top: 0; /* Align to the top */
    left: 0; /* Align to the left */
    right: 0; /* Align to the right */
    bottom: 0; /* Align to the bottom */
    background: rgba(0, 0, 0, 0.6); /* Dark overlay for contrast */
    display: flex; /* Use flexbox for centering */
    flex-direction: column; /* Column layout */
    justify-content: center; /* Center content vertically */
    align-items: center; /* Center content horizontally */
    opacity: 0; /* Initially hidden */
    transition: opacity 0.3s ease; /* Fade effect */
  }
  
  .gallery-item:hover .overlay {
    opacity: 1; /* Show overlay on hover */
  }
  
  .price-container {
    display: flex; /* Use flexbox for button and input */
    flex-direction: column; /* Stack vertically */
    align-items: center; /* Center items */
    margin-bottom: 10px; /* Space below */
  }
  
  input[type="number"] {
    padding: 5px; /* Padding inside input */
    border: none; /* Remove border */
    border-radius: 5px; /* Rounded input */
    margin-bottom: 10px; /* Space below input */
  }
  
  .remove-button {
    background-color: rgba(255, 0, 0, 0.8); /* Semi-transparent red */
    color: white; /* White text */
    border: none; /* Remove border */
    border-radius: 5px; /* Rounded button */
    padding: 5px 10px; /* Padding inside button */
    cursor: pointer; /* Pointer cursor */
    transition: background 0.3s; /* Transition for hover effect */
  }
  
  .remove-button:hover {
    background-color: rgba(255, 0, 0, 1); /* Solid red on hover */
  }
  
  .publish-button {
    background-color: rgba(0, 128, 0, 0.8); /* Semi-transparent green */
    color: white; /* White text */
    border: none; /* Remove border */
    border-radius: 5px; /* Rounded button */
    padding: 5px 10px; /* Padding inside button */
    cursor: pointer; /* Pointer cursor */
    transition: background 0.3s; /* Transition for hover effect */
  }
  
  .publish-button:hover {
    background-color: rgba(0, 128, 0, 1); /* Solid green on hover */
  }
  </style>
  