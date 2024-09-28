<template>
  <div id="app">
    <h1>Google Login Test</h1>
    <button @click="login">Login with Google</button>

    <div v-if="user">
      <h2>Welcome, {{ user.displayName }}</h2>
      <p>Your ID: {{ user.uid }}</p>

      <input v-model="name" placeholder="Enter your name" />
      <input v-model.number="balance" placeholder="Enter your balance" type="number" />
      <button @click="saveData">Save Data</button>
    </div>
  </div>
</template>

<script>
import { signInWithGoogle, database } from './firebase';
import { ref, set } from 'firebase/database'; // 使用 Realtime Database 的 ref 和 set 方法

export default {
  name: 'App',
  data() {
    return {
      user: null, // 用戶資訊
      name: '', // 用戶輸入的名字
      balance: 0 // 用戶輸入的金額
    };
  },
  methods: {
    // Google 登入功能
    async login() {
      try {
        const result = await signInWithGoogle();
        this.user = result.user; // 登入成功後，儲存用戶資訊
      } catch (error) {
        console.error('Error during Google login:', error);
      }
    },
    // 儲存用戶資料到 Firebase Realtime Database
    saveData() {
      if (this.user) {
        const userId = this.user.uid; // 使用 Google 的 UID 作為用戶 ID
        const userRef = ref(database, 'users/' + userId); // 建立到資料庫的參考路徑

        // 儲存用戶的名字和金額
        set(userRef, {
          name: this.name,
          balance: this.balance
        })
          .then(() => {
            console.log('Data saved successfully');
          })
          .catch((error) => {
            console.error('Error saving data:', error);
          });
      }
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
