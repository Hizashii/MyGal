<template>
    <div class="cart-page">
      <h1>Your Shopping Cart</h1>
      
      <!-- Art Pieces Section -->
      <div class="art-pieces">
        <ArtPiece 
          v-for="item in artItems" 
          :key="item.id" 
          :item="item" 
          @add-to-cart="addToCart"
        />
      </div>
      
      <!-- Selected Items Section -->
      <div class="selected-items">
        <h2>Selected Items</h2>
        <ul>
          <li v-for="(item, index) in selectedItems" :key="index">
            {{ item.name }} - ${{ item.price }} x {{ item.quantity }}
          </li>
        </ul>
        <p>Total: ${{ total }}</p>
      </div>
      
      <!-- Payment Methods -->
      <PaymentMethods />
    </div>
  </template>
  
  <script>
  import ArtPiece from '@/components/ArtPiece.vue';
  import PaymentMethods from '@/components/PaymentMethods.vue';
  
  export default {
    components: {
      ArtPiece,
      PaymentMethods,
    },
    data() {
      return {
        artItems: [
          { id: 1, name: 'Art Piece 1', price: 50 },
          { id: 2, name: 'Art Piece 2', price: 75 },
          { id: 3, name: 'Art Piece 3', price: 100 },
        ],
        selectedItems: [],
      };
    },
    computed: {
      total() {
        return this.selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
    },
    methods: {
      addToCart(item) {
        const foundItem = this.selectedItems.find(i => i.id === item.id);
        if (foundItem) {
          foundItem.quantity += 1;
        } else {
          this.selectedItems.push({ ...item, quantity: 1 });
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .cart-page {
    padding: 20px;
  }
  
  .art-pieces, .selected-items {
    margin-bottom: 20px;
  }
  
  .selected-items ul {
    list-style-type: none;
    padding: 0;
  }
  
  .selected-items li {
    margin-bottom: 10px;
  }
  </style>
  