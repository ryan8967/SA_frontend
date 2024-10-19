<template>
  <div id="shop-page">
    <nav class="switch-bar">
      <button class="switch-btn" 
              @click="switchPage">{{ pageName }}</button>
      <!-- Sliding indicator bar -->
      <!--div class="indicator" :style="indicatorStyle"></div-->
    </nav>
    <div v-if="internalPage" style="width: 100%;">
       <div class="stuff" v-for="product in stuff" :key="product.id">
        <div class="product">
          <img class="product-img" :src="`product_img/${product.img}`" alt="Image" />
          <h2 class="product-name" style="font-size: large; margin: 0; margin-bottom: 2px;">{{ product.name }}</h2>
          <p style="font-size: small; margin: 1px; padding: 0%;">Price: ${{ product.price }}</p>
          <button @click="purchase(product)" class="buy-btn">Buy</button>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="external-stuff">
        <div class="diamonds">
          <h2>Buy Diamonds</h2>
          <button @click="purchaseDiamonds" class="buy-btn">Buy</button>
        </div>
        <div class="external-product">
          <img class="product-img" src="product_img/bottle.png" alt="Image" />
          <h2 class="product-name">Product 1</h2>
          <p>Price: $10</p>
        </div> 
       </div>
    </div>
  </div>
</template>

<script>
import { onValue, ref, update } from "firebase/database";
import { database } from "../firebase"; // 引入 Firebase Realtime Database
import { useUserStore } from "@/stores/userStore";
export default {
  data() {
    return {
      internalPage : true, // default page
      pageName: '內部商城',
      stuff: [
        { id: 1, img: 'bottle.png', name: 'bottle', price: 10 },
        { id: 2, img: 'path', name: 'Product 2', price: 20 },
        { id: 3, img: 'path', name: 'Product 3', price: 30 }
      ],
      coins: useUserStore().virtualCoins,
      Diamonds: useUserStore().diamonds,
      userRef: ref(database, `users/${JSON.parse(localStorage.getItem("user")).uid}`)
    };
  },
  mounted() {
    this.loadCoins();
    this.loadDiamonds();
  },
  methods: {
    switchPage() {
      this.internalPage = !this.internalPage;
      this.pageName = this.internalPage ? '內部商城' : '外部商城';
    },
    purchase(product) {
      if(this.checkCoins(product.price)) {

        // update user's virtualCoins
        const newCoins = this.coins - product.price;
        
        update(this.userRef, {virtualCoins: newCoins})
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
      onValue(this.userRef, (snapshot) => {
        const data = snapshot.val();
        this.coins = data.virtualCoins;
      });
    },
    loadDiamonds() {
      onValue(this.userRef, (snapshot) => {
        const data = snapshot.val();
        this.diamonds = data.diamonds;
      });
    },
    checkCoins(price) {
      if (this.coins >= price) {
        return true;
      } else {
        alert("You don't have enough coins!\n You have " + this.coins + " coins.");
        return false;
      }
    },
    purchaseDiamonds() {
      // check if user has enough coins
      if (!this.checkCoins(100)) {
        alert("You don't have enough coins to buy diamonds!");
        return;
      }
      // update user's diamonds
      const newDiamonds = this.diamonds + 10;
      update(this.userRef, {diamonds: newDiamonds})
        .then(() => {
          console.log("Diamonds updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating diamonds:", error);
          alert("Error updating diamonds. Please try again later.");
        });
      alert("You bought 10 diamonds");
    }
  }
};
</script>

<style scoped>
#shop-page {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: normal;
    margin-top: 20px;
    padding: 10px;
    box-sizing: border-box;
    background-color: #ecf0f1;
    height: 80%;
    width: 90%;
}
.switch-bar {
    display: flex;
    justify-content: center;
    height: 40px;
    width: 80%;
    background-color: ecf0f1;
    border-radius: 10px;
}

.switch-btn,
.switch-btn:focus {
    position: relative;
    min-width: 200px;
    background-color: #2c3e50;
    border-radius: 4em;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
    transition-duration: 0.4s;
    padding: 10px 20px;
}
.switch-btn:hover {
    background-color: #2c3e50;
    color: white;
    transition-duration: 0.1s;
}
.switch-btn:after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top:0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: all 0.5s;
    box-shadow: 0 0 10px 40px white;
    border-radius: 4em;
}
.switch-btn:active:after {
    opacity: 1;
    transition: 0s;
    box-shadow: 0 0 0 0 white;
}
.switch-btn:active {
    top: 1px;
}

.stuff, .external-stuff {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    width: 100%;
    justify-content: flex-start;
    gap: 10px;
}
.product {
    flex: 1 1 calc(50% - 10px); /* 讓每個商品佔 50% 的寬度，減去 gap 的大小 */
    max-width: calc(50% - 10px); /* 確保每個商品的最大寬度是 50% 減去 gap */
    border-radius: 10px;
    width: 50%;
    max-width: 50%;
    height: 30%;
    background-color: #2c3e50;
    color: white;
    box-sizing: border-box;
    padding: 5px;
    text-align: center;  
}
.product-img {
    width: 50%;
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