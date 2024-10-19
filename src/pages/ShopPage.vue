<template>
  <div id="shop-page">
    <div v-for="product in stuff" :key="product.id" class="stuff">
      <div class="product">
        <img class="product-img" :src="`product_img/${product.img}`" alt="Image" />
        <h2 class="product-name" style="font-size: large; margin: 5% 5%;">{{ product.name }}</h2>
        <p style="font-size: small; margin: 5%; padding: 0%;">Price: ${{ product.price }}</p>
        <button @click="purchase(product)" class="buy-btn">Buy</button>
      </div>
    </div>
  </div>
</template>

<script>
import { onValue, ref, update } from "firebase/database";
import { database } from "../firebase"; // 引入 Firebase Realtime Database
export default {
  data() {
    return {
      stuff: [
        { id: 1, img: 'bottle.png', name: 'bottle', price: 10 },
        { id: 2, img: 'path', name: 'Product 2', price: 20 },
        { id: 3, img: 'path', name: 'Product 3', price: 30 }
      ],
      coins: 0,
    };
  },
  mounted() {
    this.loadCoins();
  },
  methods: {
    purchase(product) {
      const userId = JSON.parse(localStorage.getItem("user")).uid;
      const userRef = ref(database, `users/${userId}`);
      if(this.checkCoins(product)) {

        // update user's virtualCoins
        const newCoins = this.coins - product.price;
        update(userRef, {virtualCoins: newCoins})
          .then(() => {
            console.log("Coins updated successfully!");
          })
          .catch((error) => {
            console.error("Error updating coins:", error);
            alert("Error updating coins. Please try again later.");
          });
        alert(`You bought ${product.name} for $${product.price}`);
      }
    },
    loadCoins() {
      const userId = JSON.parse(localStorage.getItem("user")).uid;
      const userRef = ref(database, `users/${userId}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        this.coins = data.virtualCoins;
      });
    },
    checkCoins(product) {
      if (this.coins >= product.price) {
        return true;
      } else {
        alert("You don't have enough coins!\n You have " + this.coins + " coins.");
        return false;
      }
    },
  }
};
</script>

<style scoped>
#shop-page {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: normal;
    margin-top: 40px;
    padding: 20px;
    box-sizing: border-box;
    background-color: #ecf0f1;
    height: 80%;
}
.stuff {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    width: 50%;
}
.product {
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    height: 80%;
    max-width: 300px;
    background-color: #2c3e50;
    color: white;
    box-sizing: border-box;
    padding: 10px;
    text-align: center;
}
.product-img {
    width: 80%;
    height: 50%;
    object-fit: cover;
    border-radius: 5px;
}
.buy-btn {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 5px;
}
.buy-btn:hover {
    background-color: #2980b9;
}
</style>