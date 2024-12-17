<template>
  <div id="shop-page">
    <!-- 切換按鈕 -->
    <button class="switch-btn" @click="switchPage">
      <font-awesome-icon :icon="['fas', 'exchange-alt']" class="icon" />
      {{ pageName }}
    </button>

    <!-- 內部商城 -->
    <div v-if="internalPage" class="shop-container">
      <!-- 鑽石兌換 -->
      <div class="card diamond-exchange" @click="purchaseDiamonds">
        <p class="diamond-desc">10 Diamonds for 100 coins</p>
        <button class="buy-btn">100 coins</button>
      </div>

      <!-- 產品區塊 -->
      <div class="product-container">
        <div class="card product" v-for="product in stuff" :key="product.id">
          <img class="product-img" :src="`product_img/${product.img}`" alt="Image" />
          <h2 class="product-name">{{ product.name }}</h2>
          <p class="product-price">
            <font-awesome-icon :icon="['fas', 'coins']" class="icon" />
            {{ product.price }}
          </p>
          <button @click="purchase(product)" class="buy-btn">Buy</button>
        </div>
      </div>
    </div>

    <!-- 外部商城 -->
    <div v-else class="shop-container">
      <div class="product-container">
        <div class="card product" v-for="product in outStuff" :key="product.id">
          <img class="product-img" :src="`product_img/${product.img}`" alt="Image" />
          <h2 class="product-name">{{ product.name }}</h2>
          <p class="product-price">
            <font-awesome-icon :icon="['fas', 'gem']" class="icon" />
            {{ product.price }}
          </p>
          <button @click="purchaseByDiamond(product)" class="buy-btn">Buy</button>
        </div>
      </div>
    </div>

    <!-- 成就彈窗 -->
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
/* 整體頁面設計 */
#shop-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f4f6f9;
  min-height: 100vh;
}

/* 切換按鈕設計 */
.switch-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 30px;
  font-size: 18px;
  font-weight: bold;
  background-color: #e28b6c;
  color: white;
  border: none;
  border-radius: 50px;
  margin-bottom: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.switch-btn:hover {
  background-color: #d6755a;
  transform: scale(1.05);
}

/* 商城容器 */
.shop-container {
  width: 100%;
  max-width: 1200px;
}

/* 產品卡片區 */
.product-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* 3列網格 */
  gap: 20px;
}

.card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
  padding: 20px;
  color: #333;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.product-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-bottom: 15px;
}

.product-name {
  font-size: 20px;
  margin-bottom: 10px;
}

.product-price {
  font-size: 16px;
  margin-bottom: 15px;
}

.buy-btn {
  padding: 10px 20px;
  background-color: #1e587e;
  color: white;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.buy-btn:hover {
  background-color: #2980b9;
  transform: scale(1.05);
}

/* 鑽石兌換卡片 */
.diamond-exchange {
  background: linear-gradient(135deg, #3498db, #8e44ad);
  color: white;
  text-align: center;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;
  transition: all 0.3s ease;
}

.diamond-exchange:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}
</style>