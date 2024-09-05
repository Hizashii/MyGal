<template>
  <div class="auth-page">
    <!-- Logo -->
    <img src="@/images/mygal-logo-whitish.png" alt="MyGal Logo" class="logo">
    <div class="intro-text">
      <p class="Digi">
        Create your own digital art gallery and reveal your talent<br>
        to the world. Join or create an art community and help<br>
        others grow. Welcome to MyGal's family!
      </p>
    </div>
    
    <!-- Sign-in/Register Container -->
    <div class="auth-container">
      <h1>{{ isRegistering ? 'Register' : 'Sign In' }}</h1>
      <form @submit.prevent="handleSubmit">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">{{ isRegistering ? 'Register' : 'Log In' }}</button>
      </form>
      <button @click="toggleMode">
        {{ isRegistering ? 'Already have an account? Log In' : 'Need an account? Register' }}
      </button>
    </div>
  </div>
</template>
<!-- 
write requirements for password (at least 6 symbols) -->


<script>
import { auth, googleProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../firebaseConfig'; // Correct imports

export default {
  data() {
    return {
      email: '',
      password: '',
      isRegistering: false,
    };
  },
  methods: {
    toggleMode() {
      this.isRegistering = !this.isRegistering;
    },
    async handleSubmit() {
      try {
        if (this.isRegistering) {
          // Register a new user
          await createUserWithEmailAndPassword(auth, this.email, this.password);
          console.log('User registered successfully');
        } else {
          // Sign in an existing user
          await signInWithEmailAndPassword(auth, this.email, this.password);
          console.log('User signed in successfully');
        }
        
        // Redirect to Discover.vue
        this.$router.push('/discover'); // Use path not filename
      } catch (error) {
        console.error('Authentication Error:', error.message);
        // Handle authentication errors, e.g., display error messages
      }
    },
  },
};
</script>


<style scoped>

.intro-text {
  position: absolute;
  top: 19.3%; /* Adjust to place under the logo */
  right: 66%;  
  padding: 20px;
}

.Digi {
  text-align: left; /* Align text to the left */
  margin: 0;
  color: white;
  font-size: 16px;
}
.logo {
  position: absolute;
  top: 40px; /* Position the logo 20px from the top */
  left: 65px; /* Position the logo 20px from the left */
  width: 250px; /* Width of the logo */
  height: 105px; /* Height of the logo */
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
    /* Gradient overlay with transparency */
    linear-gradient(
      rgba(0, 0, 0, 0.5), 
      rgba(0, 0, 0, 0.5)
    ),
    url('@/images/Background_Login.jpg'); /* Your image path */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0; /* Ensure there’s no margin */
}

.auth-container {
  background: rgba(255, 255, 255, 0.612);
  padding: 4.2rem;
  border-radius: 35px;
  box-shadow: 0 6px 9px rgba(0, 0, 0, 0.3);
  overflow: hidden; /* Prevents overflow of content */

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
  padding: 0.75rem; /* Increase padding to make the input box larger */
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: white;
  font-size: 16px; /* Increase font size for better visibility */
  box-sizing: border-box; /* Include padding and border in total width and height */
}

button {
  padding: 0.75rem; /* Increase padding to make the button larger */
  border: none;
  background-color: #A982AA;
  color: white;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 10px; /* Increase margin for spacing */
  font-size: 16px; /* Increase font size for better visibility */
  box-sizing: border-box; /* Include padding and border in total width and height */
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
