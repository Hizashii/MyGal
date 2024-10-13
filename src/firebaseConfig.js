import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { getFirestore, deleteDoc, doc } from 'firebase/firestore'; // Firestore imports
import { getStorage, ref, deleteObject } from 'firebase/storage'; // Storage imports

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app); // Firestore instance
const storage = getStorage(app); // Storage instance
const googleProvider = new GoogleAuthProvider();

// Function to delete a photo
export const deletePhoto = async (photoId, imagePath) => {
  try {
    // Delete the document from Firestore
    const photoDocRef = doc(db, 'photos', photoId); // Specify your collection and document ID
    await deleteDoc(photoDocRef);

    // Delete the photo from Firebase Storage
    const imageRef = ref(storage, imagePath); // The path to the image in Storage
    await deleteObject(imageRef);

    console.log('Photo successfully deleted!');
  } catch (error) {
    console.error('Error deleting photo: ', error);
  }
};

// Export the necessary services
export { 
  auth, 
  googleProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  db, // Export Firestore instance
  storage // Export Storage instance
};
