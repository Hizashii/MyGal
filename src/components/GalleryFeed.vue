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
import { db, storage } from '../firebaseConfig'; 
import { doc, setDoc, collection, addDoc, getDoc, deleteDoc } from 'firebase/firestore'; 
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
    const galleryPhotoInput = ref(null); 

    watch(() => props.galleryPhotos, (newPhotos) => {
      galleryPhotos.value = newPhotos; 
    });

    const triggerGalleryPhotoUpload = async () => {
      await nextTick();
      galleryPhotoInput.value.click();
    };

    const preparePhotosForUpload = async (event) => {
      const files = Array.from(event.target.files);
      if (!files.length) return; 

      for (const file of files) {
        await uploadPhotoToGallery(file); 
      }
    };

    const uploadPhotoToGallery = async (file) => {
      const storageReference = storageRef(storage, `gallery_photos/${props.user.uid}/${file.name}`);

      try {
        await uploadBytes(storageReference, file);
        const url = await getDownloadURL(storageReference);

        const newPhoto = { url, fileName: file.name, price: 0, published: false };
        galleryPhotos.value.push(newPhoto);

        await saveUserProfile(props.user.uid, { galleryPhotos: galleryPhotos.value });
      } catch (error) {
        console.error('Error uploading gallery photo:', error.message);
      }
    };

    const publishPhoto = async (photo, index) => {
      const discoverCollection = collection(db, 'discoverItems');
      try {
        const docRef = await addDoc(discoverCollection, {
          image: photo.url,
          artist: props.user.email,
          price: photo.price || 0,
          userId: props.user.uid, // Store the userId for ownership reference
        });

        galleryPhotos.value[index].published = true; 
        galleryPhotos.value[index].id = docRef.id; // Save the ID for future reference
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

      // Remove from Firestore if it has been published
      if (photo.published && photo.id) {
        const docRef = doc(db, 'discoverItems', photo.id);
        await deleteDoc(docRef); // Delete from discoverItems
      }

      const userDocRef = doc(db, 'users', props.user.uid);
      const userDoc = await getDoc(userDocRef); 
      if (!userDoc.exists()) {
        console.error('User document does not exist.');
        return;
      }

      let fileName = photo.fileName;
      if (!fileName && photo.url) {
        const urlParts = photo.url.split('?')[0].split('/');
        fileName = urlParts[urlParts.length - 1];
      }

      const storagePath = `gallery_photos/${props.user.uid}/${fileName}`;
      const storageReference = storageRef(storage, storagePath);

      try {
        console.log('Deleting file from path:', storagePath);
        await deleteObject(storageReference); // Delete from Firebase Storage

        galleryPhotos.value.splice(index, 1); // Remove from the local gallery array

        await saveUserProfile(props.user.uid, { galleryPhotos: galleryPhotos.value }); // Update user profile
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
      galleryPhotoInput, 
    };
  },
};
</script>


<style scoped>
.gallery-feed {
  color: #A982AA; 
  margin-top: 20px;
}

h2 {
  text-align: center; 
  margin-bottom: 20px; 
}

.upload-button {
  background-color: #A982AA; 
  color: black; 
  border: none; 
  border-radius: 5px; 
  padding: 10px 15px;
  cursor: pointer; 
  transition: background 0.3s; 
  margin: 10px auto;
  display: block; 
}

.upload-button:hover {
  background-color: #A982AA;
}

.gallery {
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
  gap: 15px; 
}

.gallery-item {
  position: relative; 
  overflow: hidden; 
  border-radius: 10px; 
  transition: transform 0.3s ease; 
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); 
}

.gallery-item:hover {
  transform: scale(1.05); 
}

.gallery-item img {
  width: 100%; 
  height: auto; 
  border-radius: 10px; 
  transition: opacity 0.3s ease; 
}

.overlay {
  position: absolute; 
  top: 0;
  left: 0; 
  right: 0; 
  bottom: 0; 
  background: rgba(0, 0, 0, 0.6); 
  display: flex; 
  flex-direction: column; 
  justify-content: center; 
  align-items: center; 
  opacity: 0; 
  transition: opacity 0.3s ease; 
}

.gallery-item:hover .overlay {
  opacity: 1; 
}

.price-container {
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  margin-bottom: 10px; 
}

input[type="number"] {
  padding: 5px; 
  border: none; 
  border-radius: 5px; 
  margin-bottom: 10px; 
}

.remove-button {
  background-color: rgba(255, 0, 0, 0.8); 
  color: black; 
  border: none; 
  border-radius: 5px; 
  padding: 5px 10px; 
  cursor: pointer; 
  transition: background 0.3s; 
}

.remove-button:hover {
  background-color: rgba(255, 0, 0, 1); 
}

.publish-button {
  background-color:  #A982AA;
  color: black; 
  border: none; 
  border-radius: 5px; 
  padding: 5px 10px; 
  cursor: pointer; 
  transition: background 0.3s; 
}

.publish-button:hover {
  background-color: #A982AA;
}
</style>