<template>
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
