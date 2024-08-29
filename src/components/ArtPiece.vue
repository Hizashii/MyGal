<template>
    <div class="art-piece">
      <h3>{{ item.name }}</h3>
      <p>Price: ${{ item.price }}</p>
      <button @click="addToCart">Add to Cart</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      item: Object
    },
    methods: {
      addToCart() {
        this.$emit('add-to-cart', this.item);
      }
    }
  };
  </script>
  
  <style scoped>
  .art-piece {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
  }
  </style>
  