<template>
  <div id="shop-page">
    <button class="switch-btn" @click="switchPage">
      <font-awesome-icon :icon="['fas', 'exchange-alt']" class="icon" />
      {{ pageName }}
    </button>
    <div v-if="internalPage">
      <div class="diamond-exchange">
        <p class="diamond-desc" style="margin: 0 0; margin-top: 5%;">10 Diamonds for 100 coins</p>
        <button class="buy-btn" @click="purchaseDiamonds">100 coins</button>
      </div>
      <div class="stuff">
        <div class="product" v-for="product in stuff" :key="product.id">
          <img class="product-img" :src="`product_img/${product.img}`" alt="Image" />
          <h2 class="product-name" style="font-size: large; margin: 0; margin-bottom: 2px;">{{ product.name }}</h2>
          <p style="font-size: small; margin: 1px; padding: 0%;">
            <font-awesome-icon :icon="['fas', 'coins']" class="icon" />
            {{ product.price }}
          </p>
          <button @click="purchase(product)" class="buy-btn">Buy</button>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="stuff external">
        <div class="product external-stuff" v-for="product in outStuff" :key="product.id">
          <img class="product-img" :src="`product_img/${product.img}`" alt="Image" />
          <h2 class="product-name" style="font-size: large; margin: 0; margin-bottom: 2px;">{{ product.name }}</h2>
          <p style="font-size: small; margin: 1px; padding: 0%;">
            <font-awesome-icon :icon="['fas', 'gem']" class="icon" />
            {{ product.price }}
          </p>
          <button @click="purchaseByDiamond(product)" class="buy-btn">Buy</button>
        </div>
      </div>
    </div>
    <AchievementPopup v-if="isPopupVisible" :title="stuffTitle" :description="stuffDescription" :image="stuffImage"
      @close="isPopupVisible = false" />
  </div>
</template>

<script>
import AchievementPopup from '../components/AchievementPopup.vue';

export default {
  components: {
    AchievementPopup,
  },
  data() {
    return {
      internalPage: true, // 預設為內部商城
      pageName: '內部商城',
      stuff: [
        { id: 1, img: 'egg1.png', name: '初級寵物蛋', price: 200 },
        { id: 2, img: 'egg2.png', name: '中級寵物蛋', price: 500 },
        { id: 3, img: 'egg3.png', name: '高級寵物蛋', price: 1000 },
        { id: 4, img: 'upgrade.png', name: '寵物突破', price: 1 },
      ],
      outStuff: [
        { id: 10, img: 'coupon1.png', name: '餐卷', price: 300, qrCode: 'qrcode.png' },
        { id: 11, img: 'coupon2.png', name: '餐卷', price: 500, qrCode: 'qrcode.png' },
      ],
      coins: 1000, // 模擬本地持有金幣
      diamonds: 50, // 模擬本地持有鑽石
      isPopupVisible: false,
      stuffTitle: '',
      stuffDescription: '',
      stuffImage: '',
    };
  },
  methods: {
    switchPage() {
      this.internalPage = !this.internalPage;
      this.pageName = this.internalPage ? '內部商城' : '外部商城';
    },
    purchase(product) {
      if (this.coins >= product.price) {
        this.coins -= product.price;
        this.showPopup(product, 'coins');
      } else {
        alert("金幣不足！");
      }
    },
    purchaseByDiamond(product) {
      if (this.diamonds >= product.price) {
        this.diamonds -= product.price;
        this.showPopup(product, 'diamonds');
      } else {
        alert("鑽石不足！");
      }
    },
    purchaseDiamonds() {
      if (this.coins >= 100) {
        this.coins -= 100;
        this.diamonds += 10;
        this.showPopup({ name: '鑽石', img: 'diamond.png' }, 'coins');
      } else {
        alert("金幣不足！");
      }
    },
    showPopup(product, currency) {
      this.isPopupVisible = true;
      this.stuffTitle = `${currency === 'coins' ? '購買成功' : '兌換成功'}：${product.name}`;
      this.stuffDescription = `你成功購買了 ${product.name}！`;
      this.stuffImage = `./product_img/${product.img}`;
    },
  },
};
</script>

<style scoped>
#shop-page {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  /*justify-content: center;*/
  margin-top: 20px;
  padding: 10px;
  box-sizing: border-box;
  background-color: #d3dadb;
  height: 80%;
  width: 90%;
  align-items: center;
  border-radius: 30px;
}

.switch-btn {
  display: flex;
  flex-direction: raw;
  align-items: center;
  justify-content: center;
  height: 55px;
  width: 80%;
  background-color: #ecf0f1;
  border-radius: 10px;
  margin-bottom: 1%;
}

.switch-btn,
.switch-btn:focus {
  position: relative;
  min-width: 200px;
  height: 50px;
  background-color: #e28b6c;
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
  background-color: #e28b6c;
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
  box-shadow: 0 0 10px 40px #df4e19;
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

.stuff {
  margin-top: 5%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  gap: 10px;
  align-items: stretch;
  ;
}

.product {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 10px;
  background-color: #2c3e50;
  color: white;
  box-sizing: border-box;
  padding: 5px;
  text-align: center;
  object-fit: cover;
  height: 100%;
  align-items: center;
}

.product-img {
  width: 40%;
  height: auto;
  object-fit: cover;
  border-radius: 5px;
  align-self: center;
  margin-top: 10px;
}

.buy-btn {
  width: 40%;
  border-radius: 10px;
  background-color: #1e587e;
  color: white;
  border: 1px solid #3498db;
  padding: 5px 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 5%;
  margin-bottom: 5%;
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
  height: 23%;
  background: linear-gradient(135deg, #3498db, #8e44ad);
  border-radius: 15px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  align-items: center;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  margin-top: 5%;
}

.diamond-exchange::before {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(45deg);
  transition: all 0.5s ease;
}

.diamond-exchange:hover::before {
  top: -20%;
  left: -20%;
}

.diamond-exchange:hover {
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.3);

}

.icon {
  margin-right: 15px;
}
</style>