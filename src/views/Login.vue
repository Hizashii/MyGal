<template>
  <div class="auth-page">
    <img src="@/images/mygal-logo-whitish.png" alt="MyGal Logo" class="logo">
    <div class="intro-text"></div>
    
    <div class="auth-container">
      <h1>{{ isRegistering ? 'Register' : 'Sign In' }}</h1>
      <form @submit.prevent="handleSubmit">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password (at least 6 characters)" required minlength="6" />
        <div v-if="!isRegistering">
          <!-- <input type="checkbox" v-model="isAdminLogin"> Do you have admin rights? -->
        </div>
        <button type="submit">{{ isRegistering ? 'Register' : 'Log In' }}</button>
      </form>
      <button @click="toggleMode">
        {{ isRegistering ? 'Already have an account? Log In' : 'Need an account? Register' }}
      </button>
    </div>
  </div>
</template>

<script>
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../firebaseConfig';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const isRegistering = ref(false);
    const isAdminLogin = ref(false); 
    const router = useRouter();
    const db = getFirestore();

    const toggleMode = () => {
      isRegistering.value = !isRegistering.value;
    };

    const handleSubmit = async () => {
      try {
        if (isRegistering.value) {
          // Registration logic
          const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
          const user = userCredential.user;

          // New users always start with 'user' role
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            role: "user",
            createdAt: serverTimestamp()
          });
          
          router.push({ name: 'Discover' });
        } else {
          // Login logic
          const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
          const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Store role in localStorage for easy access
            localStorage.setItem('userRole', userData.role);

            // Check for admin rights using hardcoded credentials
            if (email.value === 'magebeast3@abv.bg' && password.value === '1234567') {
              // Assign admin role if the credentials match
              userData.role = 'admin';
              localStorage.setItem('userRole', 'admin');
              alert('Logged in as admin successfully!');
            }

            // Navigate to Discover page regardless of user role
            router.push({ name: 'Discover' });
          } else {
            alert('User not found.');
          }
        }
      } catch (error) {
        console.error('Error:', error);
        alert(error.message);
      }
    };

    return {
      email,
      password,
      isRegistering,
      isAdminLogin,
      toggleMode,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.intro-text {
  position: absolute;
  top: 15%; 
  right: 71.5%;  
  padding: 20px;
}

.Digi {
  text-align: left; 
  margin: 0;
  color: white;
  font-size: 16px;
}

.logo {
  position: absolute;
  top: 40px; 
  left: 65px; 
  width: 250px; 
  height: 105px; 
}

.auth-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: 
    linear-gradient(
      rgba(0, 0, 0, 0.5), 
      rgba(0, 0, 0, 0.5)
    ),
    url('@/images/Background_Login.jpg'); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0; 
}

.auth-container {
  background: rgba(255, 255, 255, 0.612);
  padding: 4.2rem;
  border-radius: 35px;
  box-shadow: 0 6px 9px rgba(0, 0, 0, 0.3);
  overflow: hidden; 
}

.auth-container h1 {
  color: black; 
  text-align: center;
  font-size: 30px;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  margin-bottom: 1rem;
  padding: 0.75rem; 
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: white;
  font-size: 16px; 
  box-sizing: border-box;
}

button {
  padding: 0.75rem; 
  border: none;
  background-color: #A982AA;
  color: white;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 10px; 
  font-size: 16px; 
  box-sizing: border-box; 
}

button:last-of-type {
  background-color: #A982AA;
  color: white;
  border: 1px solid #A982AA;
  font-weight: 530;
}

button:last-of-type:hover {
  background-color: transparent;
  color: #0000009b;
}
</style>
