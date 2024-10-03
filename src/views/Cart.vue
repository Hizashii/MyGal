<template>
<div class="top-nav">
      <img src="@/images/mygal-logo-black.png" alt="MyGal Logo" class="logo">
      <div class="nav-buttons">
        <button @click="navigate('discover')">Discover</button>
        <button @click="navigate('profile')">My Profile</button>
        <button @click="logOut">Log Out</button>
        <button @click="goToCart" class="cart-button">
          <img src="@/images/cart.png" alt="Cart Icon" class="cart-icon">
        </button>
      </div>
    </div>

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
    
    <!-- Payment Methods -->
    <PaymentMethods />
  </div>
</template>

<script>
import PaymentMethods from '@/components/PaymentMethods.vue';

export default {
  components: {
    PaymentMethods,
  },
  data() {
    return {
      selectedItems: JSON.parse(localStorage.getItem('cartItems')) || [],
    };
  },
  computed: {
    total() {
      return this.selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
  },
  methods: {
    updateQuantity(item) {
      const index = this.selectedItems.findIndex(i => i.id === item.id);
      if (index !== -1) {
        this.selectedItems[index].quantity = item.quantity;
        this.saveCart();
      }
    },
    removeItem(id) {
      this.selectedItems = this.selectedItems.filter(item => item.id !== id);
      this.saveCart();
    },
    saveCart() {
      localStorage.setItem('cartItems', JSON.stringify(this.selectedItems));
    }
  },
  created() {
    this.selectedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  }
};
</script>

<style scoped>
.nav-buttons button {
  background: none;
  border: none;
  font-size: 16px;
  margin-left: 15px;
  cursor: pointer;
  color: #0e0d0d;
  transition: color 0.3s ease;
}

.nav-buttons button:hover {
  color: #A982AA;
}

.cart-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
}

.cart-icon {
  width: 24px;
  height: 24px;
}

.title h1 {
  color: black;
  font-weight: 450;
}

.discover-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  overflow-y: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  width: 80px;
  height: 35px;
}

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
