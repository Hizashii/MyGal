<template>
  <TopNav :logoSrc="logoSrc" />

  <div class="cart-page">
    <h1>Your Shopping Cart</h1>

    <!-- Selected Items Section -->
    <div class="selected-items">
      <h2>Selected Items</h2>
      <ul>
        <li v-for="(item, index) in selectedItems" :key="item.id">
          {{ item.artist }} - ${{ item.price }} x 
          <input 
            type="number" 
            v-model.number="item.quantity" 
            @change="updateQuantity(item)"
            min="1"
          />
          <button @click="removeItem(item.id)" class="remove-button">Remove</button>
        </li>
      </ul>
      <p>Total: ${{ total }}</p>
    </div>

    <PaymentMethods />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth, signOut } from '../firebaseConfig'; 
import TopNav from '@/components/TopNav.vue';
import PaymentMethods from '@/components/PaymentMethods.vue';

export default {
  components: {
    TopNav,
    PaymentMethods,
  },
  setup() {
    const selectedItems = ref(JSON.parse(localStorage.getItem('cartItems')) || []);
    const router = useRouter();

    const total = computed(() => {
      return selectedItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    });

    const updateQuantity = (item) => {
      const index = selectedItems.value.findIndex(i => i.id === item.id);
      if (index !== -1) {
        selectedItems.value[index].quantity = item.quantity;
        saveCart();
      }
    };

    const removeItem = (id) => {
      selectedItems.value = selectedItems.value.filter(item => item.id !== id);
      saveCart();
    };

    const saveCart = () => {
      localStorage.setItem('cartItems', JSON.stringify(selectedItems.value));
    };

    const goToCart = () => {
      router.push('/cart');
    };

    const navigate = (page) => {
      if (page === 'profile') {
        router.push('/profile');
      } else if (page === 'discover') {
        router.push('/discover');
      }
    };

    const logOut = async () => {
      try {
        await signOut(auth); // Firebase sign out
        router.push('/login');
      } catch (error) {
        console.error('Error during sign out:', error.message);
      }
    };

    onMounted(() => {
      selectedItems.value = JSON.parse(localStorage.getItem('cartItems')) || [];
    });

    return {
      selectedItems,
      total,
      updateQuantity,
      removeItem,
      goToCart,
      navigate,
      logOut
    };
  },
};
</script>

<style scoped>

.cart-page {
  padding: 20px;
}

.selected-items {
  margin-bottom: 20px;
}

.selected-items ul {
  list-style-type: none;
  padding: 0;
}

.selected-items li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.remove-button {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  margin-left: 10px;
}

.remove-button:hover {
  background-color: #c82333;
}

input[type="number"] {
  width: 60px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>