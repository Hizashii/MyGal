<template>
  <div class="payment-methods">
    <h2>Choose Payment Method</h2>
    <div class="payment-options">
      <label class="payment-option">
        <i class="fas fa-credit-card"></i> 
        <input type="radio" value="credit" v-model="selectedPaymentMethod" />
        Credit Card
      </label>

      <label class="payment-option">
        <i class="fab fa-paypal"></i> 
        <input type="radio" value="paypal" v-model="selectedPaymentMethod" />
        PayPal
      </label>

      <label class="payment-option">
        <i class="fab fa-apple-pay"></i> 
        <input type="radio" value="apple" v-model="selectedPaymentMethod" />
        Apple Pay
      </label>
    </div>

    <button class="complete-button" @click="completePurchase">Complete Purchase</button>
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.payment-methods h2 {
  margin-bottom: 20px;
}

.payment-options {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.payment-option {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 1.1rem;
  cursor: pointer;
}

.payment-option i {
  margin-right: 10px;
  font-size: 1.5rem;
  color: #555;
  min-width: 30px; 
  text-align: center;
}

input[type="radio"] {
  margin-left: 10px;
  margin-right: 10px; 
}


.complete-button {
  background-color: #A982AA;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.complete-button:hover {
  background-color: #6a506b;
}

.complete-button:active {
  background-color: #A982AA;
}

.payment-methods {
  color: #333;
}

</style>
  