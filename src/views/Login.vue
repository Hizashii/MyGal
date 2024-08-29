<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1>{{ isRegistering ? 'Register' : 'Sign In' }}</h1>
      <form @submit.prevent="handleSubmit">
        <input v-model="username" type="text" placeholder="Username" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">{{ isRegistering ? 'Register' : 'Log In' }}</button>
      </form>
      <button @click="toggleMode">
        {{ isRegistering ? 'Already have an account? Log In' : 'Need an account? Register' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      isRegistering: false,
    };
  },
  methods: {
    toggleMode() {
      this.isRegistering = !this.isRegistering;
    },
    handleSubmit() {
      if (this.isRegistering) {
        // Handle registration logic here (e.g., send a request to your API)
        localStorage.setItem('authToken', 'dummyToken'); // Example token
      } else {
        // Handle login logic here (e.g., send a request to your API)
        localStorage.setItem('authToken', 'dummyToken'); // Example token
      }
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
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
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 6px 9px rgba(0, 0, 0, 0.3);
}

.auth-container h1 {
  color: black; 
  text-align: center;
  font-size: 28.5px;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: white;
}

button {
  padding: 0.5rem;
  border: none;
  background-color: #A982AA;
  color: white;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 7px;
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
