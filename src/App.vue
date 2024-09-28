<template>
  <div id="app">
    <div class="login-container" v-if="!user">
      <div class="login-box">
        <h1>Welcome to TSMC-pet</h1>
        <p>Your journey to success and rewards starts here</p>
        <button class="login-btn" @click="login">
          Login with Google
        </button>
      </div>
    </div>

    <div class="user-info" v-if="user">
      <h2>Welcome, {{ user.displayName }}!</h2>
      <p>Your ID: {{ user.uid }}</p>

      <div class="form-group">
        <input v-model="name" placeholder="Enter your pet's name" class="input-field" />
      </div>

      <div class="form-group">
        <input v-model.number="balance" placeholder="Enter your pet's energy level" type="number" class="input-field" />
      </div>

      <button class="save-btn" @click="saveData">Save Pet Info</button>
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
      name: '', // 用戶輸入的名字（寵物名）
      balance: 0 // 用戶輸入的金額（寵物能量值）
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

        // 儲存用戶的名字和金額（寵物的名字和能量）
        set(userRef, {
          petName: this.name,
          petEnergy: this.balance
        })
          .then(() => {
            console.log('Pet data saved successfully');
          })
          .catch((error) => {
            console.error('Error saving pet data:', error);
          });
      }
    }
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f9f9f9;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-box {
  background-color: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 350px;
}

.login-box h1 {
  font-size: 28px;
  margin-bottom: 10px;
  color: #c0392b;
  /* 使用紅色系 */
}

.login-box p {
  font-size: 16px;
  margin-bottom: 20px;
  color: #7f8c8d;
}

.login-btn {
  background-color: #c0392b;
  color: white;
  font-size: 16px;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-btn:hover {
  background-color: #e74c3c;
}

.user-info {
  width: 350px;
  margin-top: 20px;
  text-align: center;
}

.form-group {
  margin: 10px 0;
}

.input-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #bdc3c7;
  border-radius: 10px;
  margin-bottom: 10px;
}

.save-btn {
  background-color: #c0392b;
  color: white;
  font-size: 16px;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
}

.save-btn:hover {
  background-color: #e74c3c;
}

/* 手機優化設計 */
@media only screen and (max-width: 600px) {

  .login-box,
  .user-info {
    width: 90%;
    padding: 20px;
  }
}
</style>
