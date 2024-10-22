<template>
  <TopNav :logoSrc="logoSrc" />

  <div class="cart-page-container">
    <div class="cart-page">
      <h1>Shopping Cart</h1>
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
        await signOut(auth); 
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

.cart-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; 
  background-color: #e0e0e0; 
}

.cart-page {
  padding: 40px;
  max-width: 800px;
  width: 100%; 
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.cart-page h1 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
  font-weight: bold;
}

/* Responsive styles */
@media (max-width: 600px) {
  .cart-page {
    padding: 20px;
  }
}

.selected-items {
  margin-bottom: 30px;
}

.selected-items h2 {
  font-size: 1.5rem;
  color: #555;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.selected-items ul {
  list-style: none;
  padding: 0;
  color: #333;
}

.selected-items li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 15px 20px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}

.selected-items li:hover {
  background-color: #f1f1f1;
}

.selected-items li input[type="number"] {
  width: 60px;
  padding: 5px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #333;
}

.remove-button {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.remove-button:hover {
  background-color: #c82333;
}



p {
  font-size: 1.25rem;
  color: #333;
  font-weight: bold;
  text-align: right;
  margin-top: 10px;
  border-top: 2px solid #ddd;
  padding-top: 15px;
}

@media (max-width: 600px) {
  .cart-page {
    padding: 20px;
  }

  .selected-items li {
    flex-direction: column;
    align-items: flex-start;
  }

  .selected-items li input[type="number"] {
    margin: 10px 0;
  }

  p {
    text-align: left;
  }
}


</style>