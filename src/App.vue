<template>
  <div id="app">
    <router-view></router-view> <!-- 渲染當前路由的頁面 -->

    <!-- 當頁面不是 WelcomePage 時顯示 BottomBar -->
    <BottomBar v-if="!isWelcomePage" />
  </div>
</template>

<script>
import BottomBar from '@/components/BottomBar.vue'; // 引入 BottomBar 元件

export default {
  name: 'App',
  components: {
    BottomBar,
  },
  computed: {
    isWelcomePage() {
      // 檢查當前路由是否有名稱，且名稱是否為 'welcome'
      return this.$route && this.$route.name === 'Welcome';
    }
  }
};
</script>

<style>
/* 這裡可以放全局樣式 */
body {
  margin: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

#app {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
