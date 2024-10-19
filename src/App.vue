<template>
  <div id="app"  @click="createParticles">
    <NavBar v-if="!isWelcomePage" />
    <router-view></router-view> <!-- 渲染當前路由的頁面 -->
    <BottomBar v-if="!isWelcomePage" />
    <div class="particles" id="particles-js"></div> <!-- 添加粒子容器 -->
  </div>
</template>

<script>
import BottomBar from '@/components/BottomBar.vue';
import NavBar from '@/components/NavBar.vue';
import { useUserStore } from '@/stores/userStore';
import { usePetStore } from './stores/petStore';
import { ref, onValue, update } from 'firebase/database'; // 引入 Firebase 相關 API
import { database } from '@/firebase'; // 引入初始化的 Firebase 服務
import gsap from 'gsap'; // 引入 gsap
export default {
  name: 'App',
  components: {
    BottomBar,
    NavBar,
  },
  computed: {
    isWelcomePage() {
      return this.$route && this.$route.name === 'Welcome';
    }
  },
  mounted() {
    this.initializeUserData();
    this.setupPassiveIncome(); // 被動產生虛擬幣和鑽石
  },
  methods: {
    initializeUserData() {
      const userStore = useUserStore();
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        const user = JSON.parse(storedUser);
        userStore.setUser(user);
        this.setupFirebaseSync(user.uid);

      }
    },
    setupFirebaseSync(userId) {
      const userStore = useUserStore();

      const userRef = ref(database, `users/${userId}`);
      const petStore = usePetStore();
      // 監聽 Firebase 的數據變化
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          userStore.setVirtualCoins(data.virtualCoins);
          userStore.setDiamonds(data.diamonds || 0); // 同步鑽石
          userStore.setPetLevel(data.petLevel || 1);

          petStore.selectPet(data.selectedPetIndex.selectedPetIndex);
          console.log('selectedPetIndex:', data.selectedPetIndex.selectedPetIndex);
          console.log('Data updated from Firebase:', data.virtualCoins, data.diamonds);
        }
      });

      // 定時從 Firebase 抓取數據
      setInterval(() => {
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            userStore.setVirtualCoins(data.virtualCoins);
            userStore.setDiamonds(data.diamonds || 0); // 定時同步鑽石
            userStore.setPetLevel(data.petLevel || 1);
            console.log('Data updated from Firebase:', data.virtualCoins, data.diamonds);
          }
        });

      }, 10000); // 每10秒抓取一次資料
    },
    setupPassiveIncome() {
      const userStore = useUserStore();
      const userId = userStore.user ? userStore.user.uid : null;

      if (userId) {
        const userRef = ref(database, `users/${userId}`);

        // 每隔 10 秒自動增加虛擬幣和鑽石
        setInterval(() => {
          const newCoins = userStore.virtualCoins + 1;
          const newDiamonds = userStore.diamonds + 1; // 增加鑽石
          userStore.setVirtualCoins(newCoins);
          userStore.setDiamonds(newDiamonds); // 更新鑽石

          // 同步到 Firebase
          update(userRef, {
            virtualCoins: newCoins,
            diamonds: newDiamonds, // 同步鑽石
          });
        }, 10000); // 每10秒增加1個虛擬幣和1個鑽石
      }
    },
    // 創建粒子效果
    createParticles(event) {
      console.log('createParticles');
      const particlesCount = 30; // 粒子數量
      const particlesContainer = document.getElementById('particles-js'); // 粒子容器
      if (!particlesContainer) {
        console.error('Particles container not found');
        return; // 如果找不到容器，停止執行
      }

      const x = event.clientX; // 點擊的 X 坐標
      const y = event.clientY; // 點擊的 Y 坐標

      for (let i = 0; i < particlesCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle'; // 設定類別
        particle.style.left = `${x}px`; // 粒子初始位置
        particle.style.top = `${y}px`;
        particlesContainer.appendChild(particle); // 將粒子添加到容器

        const randomX = Math.random() * 200 - 100; // 隨機 X 偏移量
        const randomY = Math.random() * 200 - 100; // 隨機 Y 偏移量

        // 使用 GSAP 進行動畫
        gsap.to(particle, {
          x: randomX,
          y: randomY,
          opacity: 0, // 逐漸隱藏
          duration: 0.5,
          onComplete: () => particle.remove() // 動畫完成後移除粒子
        });
      }
    }
    

  }
};


</script>

<style>
body {
  margin: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

#app {
  height: 100vh;
  width:100vw;
  display: flex;
  flex-direction: column;
}

.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 9999;
}

.particle {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #ff8cdb; /* 粒子顏色 */
  pointer-events: none;
}
</style>
