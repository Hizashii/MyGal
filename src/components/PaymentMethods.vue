<template>
    <div class="payment-methods">
      <h2>Choose Payment Method</h2>
      <div>
        <label>
          <input type="radio" value="credit" v-model="selectedPaymentMethod" />
          Credit Card
        </label>
        <label>
          <input type="radio" value="paypal" v-model="selectedPaymentMethod" />
          PayPal
        </label>
        <label>
          <input type="radio" value="bank" v-model="selectedPaymentMethod" />
          Bank Transfer
        </label>
      </div>
      <button @click="completePurchase">Complete Purchase</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedPaymentMethod: '',
      };
    },
    methods: {
      completePurchase() {
        if (this.selectedPaymentMethod) {
          alert(`Payment method selected: ${this.selectedPaymentMethod}`);
        } else {
          alert('Please select a payment method.');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .payment-methods {
    margin-top: 20px;
  }
  </style>
  