<template>
  <div id="shop-page">
    <nav class="switch-bar">
      <button class="switch-btn" @click="switchPage">{{ pageName }}</button>
    </nav>
    <div v-if="internalPage" style="width: 100%; height: auto; object-fit: cover; display: flex;">
      <div class="stuff">
        <div class="product" v-for="product in stuff" :key="product.id">
          <img class="product-img" :src="`product_img/${product.img}`" alt="Image" />
          <h2 class="product-name" style="font-size: large; margin: 0; margin-bottom: 2px;">{{ product.name }}</h2>
          <p style="font-size: small; margin: 1px; padding: 0%;">Price: ${{ product.price }}</p>
          <button @click="purchase(product)" class="buy-btn">Buy</button>
        </div>
      </div>
    </div>
    <div v-else class="external-stuff">
      <div class="diamond-exchange">
        <h2 class="exchange-title">Buy Diamonds</h2>
        <p class="diamond-desc">10 Diamonds for 100 coins</p>
        <button @click="purchaseDiamonds" class="buy-btn">Buy Now</button>
      </div>
    </div>
  </div>
</template>

<script>
import { onValue, ref, update, set } from "firebase/database";
import { database } from "../firebase"; // 引入 Firebase Realtime Database
// import { useUserStore } from "@/stores/userStore";
export default {
  data() {
    return {
      internalPage: true, // default page
      pageName: '內部商城',
      stuff: [
        { id: 1, img: 'egg1.png', name: '初級寵物蛋', price: 200 },
        { id: 2, img: 'egg2.png', name: '中級寵物蛋', price: 500 },
        { id: 3, img: 'egg3.png', name: '高級寵物蛋', price: 1000 },
        { id: 4, img: 'bottle.png', name: 'bottle', price: 100 },
      ],
      coins: 0,
      diamonds: 0,
      lastExchangeDate: '',
    };
  },
  mounted() {
    this.loadUserData();
  },
  methods: {
    loadUserData() {
      const userId = JSON.parse(localStorage.getItem("user")).uid;
      const userRef = ref(database, `users/${userId}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        this.coins = data.virtualCoins;
        this.diamonds = data.diamonds;
        this.lastExchangeDate = data.lastExchangeDate;
      });
    },
    switchPage() {
      this.internalPage = !this.internalPage;
      this.pageName = this.internalPage ? '內部商城' : '外部商城';
    },
    purchase(product) {
      console.log(product);
      if (this.checkCoins(product.price)) {

        // update user's virtualCoins
        const newCoins = this.coins - product.price;
        const userRef = ref(database, `users/${JSON.parse(localStorage.getItem("user")).uid}`);
        update(userRef, { virtualCoins: newCoins })
          .then(() => {
            console.log("Coins updated successfully!");
          })
          .catch((error) => {
            console.error("Error updating coins:", error);
            alert("Error updating coins. Please try again later.");
          });
        console.log("You bought " + product.name + " for $" + product.price);
        alert(`You bought ${product.name} for $${product.price}`);

      }
    },
    checkCoins(price) {
      if (this.coins >= price) {
        return true;
      } else {
        // alert("You don't have enough coins!\n You have " + this.coins + " coins.");
        return false;
      }
    },
    purchaseDiamonds() {
      // check last time user bought diamonds
      const today = new Date().toISOString().split('T')[0];
      if (this.lastExchangeDate === today) {
        alert("You can only buy diamonds once a day!");
        return;
      }

      // check if user has enough coins
      if (!this.checkCoins(100)) {
        //alert("You don't have enough coins to buy diamonds!");
        return;
      }
      // update user's diamonds
      const newDiamonds = this.diamonds + 10;
      const newVirtualCoins = this.coins - 100;
      if (this.lastExchangeDate === undefined) {
        const dateRef = ref(database, `users/${JSON.parse(localStorage.getItem("user")).uid}/lastExchangeDate`);
        set(dateRef, today)
          .then(() => {
            console.log("update lastExchangeDate successfully!");
          })
          .catch((error) => {
            console.error("Error updating diamonds:", error);
            alert("Error updating diamonds. Please try again later.");
          });
        update(this.userRef, { virtualCoins: newVirtualCoins, diamonds: newDiamonds })
          .then(() => {
            console.log("Diamonds updated successfully!");
          })
          .catch((error) => {
            console.error("Error updating diamonds:", error);
            alert("Error updating diamonds. Please try again later.");
          });
      } else {
        const newDiamonds = this.diamonds + 10;
        const newVirtualCoins = this.coins - 100;
        const userRef = ref(database, `users/${JSON.parse(localStorage.getItem("user")).uid}`);
        update(userRef, {
          virtualCoins: newVirtualCoins, diamonds: newDiamonds,
          lastExchangeDate: today
        })
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
  }
};
</script>

<style scoped>
#shop-page {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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
  height: 55px;
  width: 80%;
  background-color: ecf0f1;
  border-radius: 10px;
  margin-bottom: 1%;
}

.switch-btn,
.switch-btn:focus {
  position: relative;
  min-width: 200px;
  height: 50px;
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
  top: 0;
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

.stuff,
.external-stuff {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  gap: 10px;
  align-items: stretch;
}

.product {
  width: 100%;
  border-radius: 10px;
  background-color: #2c3e50;
  color: white;
  box-sizing: border-box;
  padding: 5px;
  text-align: center;
  object-fit: cover;
  height: 90%;
}

.product-img {
  width: 40%;
  height: 40%;
  object-fit: cover;
  border-radius: 5px;
  align-self: stretch;
  margin-top: 5px;
}

.buy-btn {
  width: 40%;
  border-radius: 10px;
  background-color: #3498db;
  color: white;
  border: 1px solid #3498db;
  padding: 5px 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 5px;
}

.buy-btn:hover {
  background-color: #2980b9;
}

.external-stuff {
  display: flex;
  align-items: center;
}

.diamond-exchange {
  width: 100%;
  border-radius: 10px;
  background-color: #2c3e50;
  color: white;
  box-sizing: border-box;
  padding: 5px;
  text-align: center;
  object-fit: cover;
  height: 100%;
}
</style>