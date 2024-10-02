<template>
  <div id="app">
    <NavBar v-if="!isWelcomePage" />
    <router-view></router-view> <!-- 渲染當前路由的頁面 -->
    <BottomBar v-if="!isWelcomePage" />
  </div>
</template>

<script>
import BottomBar from '@/components/BottomBar.vue';
import NavBar from '@/components/NavBar.vue';
import { useUserStore } from '@/stores/userStore';
import { ref, onValue, update } from 'firebase/database'; // 引入 Firebase 相關 API
import { database } from '@/firebase'; // 引入初始化的 Firebase 服務

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
    this.setupPassiveIncome(); // 被動產生虛擬幣
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

      // 監聽 Firebase 的數據變化
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          userStore.setVirtualCoins(data.virtualCoins);
          userStore.setPetLevel(data.petLevel || 1);
        }
      });

      // 定時從 Firebase 抓取數據
      setInterval(() => {
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            userStore.setVirtualCoins(data.virtualCoins);
            userStore.setPetLevel(data.petLevel || 1);
            console.log('Data updated from Firebase:', data.virtualCoins);
          }
        });

      }, 10000); // 每10秒抓取一次資料
    },
    setupPassiveIncome() {
      const userStore = useUserStore();
      const userId = userStore.user ? userStore.user.uid : null;

      if (userId) {
        const userRef = ref(database, `users/${userId}`);

        // 每隔 10 秒自動增加虛擬幣
        setInterval(() => {
          const newCoins = userStore.virtualCoins + 1;
          userStore.setVirtualCoins(newCoins);

          // 同步到 Firebase
          update(userRef, {
            virtualCoins: newCoins,
          });
        }, 10000); // 每10秒增加 1 個虛擬幣
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
  display: flex;
  flex-direction: column;
}
</style>
