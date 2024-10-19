<template>
    <div class="profile-page">
      <h1 class="title">個人資料頁面</h1>
  
      <!-- 初始化成就按鈕 -->
      <button @click="initializeAchievements" class="initialize-btn">初始化成就資料</button>
  
      <div class="avatar-section">
        <label for="avatar-upload" class="avatar-label">
          <img :src="userAvatar" alt="User Avatar" class="avatar-image" />
          <span>更改頭像</span>
        </label>
        <input type="file" id="avatar-upload" @change="uploadAvatar" accept="image/*" class="avatar-input" />
      </div>
  
      <div class="achievements">
        <h2>Achievements</h2>
  
        <!-- 已完成成就區塊 -->
        <div class="achievements-completed">
          <h3>已完成</h3>
          <div
            v-for="achievement in completedAchievements"
            :key="achievement.id"
            class="achievement-item completed"
            @click="showAchievementDetails(achievement)"
          >
            <img :src="achievement.icon" :alt="achievement.description" class="achievement-icon" />
            <span>{{ achievement.name }}</span>
            <p>{{ achievement.description }}</p>
          </div>
        </div>
  
        <!-- 未完成成就區塊 -->
        <div class="achievements-incomplete">
          <h3>未完成</h3>
          <div
            v-for="achievement in incompleteAchievements"
            :key="achievement.id"
            class="achievement-item"
            @click="showAchievementDetails(achievement)"
          >
            <!-- 使用 class 動態控制圖像透明度 -->
            <img :src="achievement.icon" :alt="achievement.description" :class="{'incomplete-icon': !achievement.completed}" class="achievement-icon" />
            <span>{{ achievement.name }}</span>
            <p>{{ achievement.description }}</p>
          </div>
        </div>
      </div>
  
      <div v-if="showDialog" class="dialog-overlay">
        <div class="dialog">
          <p>{{ dialogContent }}</p>
          <button @click="closeDialog">關閉</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref as firebaseRef, onValue, update } from 'firebase/database';
  import { ref, computed, onMounted } from 'vue';
  import { database } from '../firebase'; // 引入 Firebase 初始化
  
  export default {
    setup() {
      const userAvatar = ref("/default-avatar.png"); // 預設頭像
      const achievements = ref([]); // 用來存儲從 Firebase 拿到的成就資料
  
      const completedAchievements = computed(() =>
        achievements.value.filter(achievement => achievement.completed)
      );
      const incompleteAchievements = computed(() =>
        achievements.value.filter(achievement => !achievement.completed)
      );
  
      const showDialog = ref(false);
      const dialogContent = ref("");
  
      // 載入 Firebase 中的成就資料
      const loadAchievements = async (userId) => {
        const achievementsRef = firebaseRef(database, `users/${userId}/achievements`);
  
        // 從 Firebase 中加載成就資料
        onValue(achievementsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            achievements.value = Object.values(data); // 將成就資料更新到前端
          }
        });
      };
  
      // 更換頭像及完成成就
      const uploadAvatar = async (event) => {
        const file = event.target.files[0];
        if (file) {
          userAvatar.value = URL.createObjectURL(file);
          const firstAvatarChange = achievements.value.find((achievement) => achievement.id === 'first-avatar-change');
          if (firstAvatarChange && !firstAvatarChange.completed) {
            firstAvatarChange.completed = true;
            await updateFirebaseAchievement(firstAvatarChange);
          }
        }
      };
  
      // 更新成就到 Firebase
      const updateFirebaseAchievement = async (achievement) => {
        const userId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).uid : null;
        if (userId) {
          const achievementRef = firebaseRef(database, `users/${userId}/achievements/${achievement.id}`);
          await update(achievementRef, {
            completed: achievement.completed
          });
          console.log(`成就 ${achievement.name} 已更新至 Firebase`);
        }
      };
  
      // 初始化按鈕：初始化成就到 Firebase
      const initializeAchievements = async () => {
        const userId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).uid : null;
        if (userId) {
          const achievementsRef = firebaseRef(database, `users/${userId}/achievements`);
  
          const defaultAchievements = {
            'login-three-times': {
              id: 'login-three-times',
              name: '登入三次',
              description: '登入三次的成就',
              completed: false,
              icon: 'badge/login-three-times-badge.png',
            },
            'first-avatar-change': {
              id: 'first-avatar-change',
              name: '第一次換頭像',
              description: '首次更換頭像的成就',
              completed: false,
              icon: 'badge/firstTime.webp',
            },
            'employee-of-the-year': {
              id: 'employee-of-the-year',
              name: '年度最佳員工',
              description: '獲得年度最佳員工的成就',
              completed: false,
              icon: 'badge/employOfTheYear.png',
            }
          };
  
          await update(achievementsRef, defaultAchievements);
          alert("成就資料初始化完成！");
        } else {
          console.error("無法取得用戶 ID，請先登入");
        }
      };
  
      const showAchievementDetails = (achievement) => {
        dialogContent.value = (achievement.description || achievement.name) + '\n可兌換300鑽石';
        showDialog.value = true;
      };
  
      const closeDialog = () => {
        showDialog.value = false;
      };
  
      // 初始加載 Firebase 資料
      onMounted(() => {
        const userId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).uid : null;
        if (userId) {
          loadAchievements(userId);
        }
      });
  
      return {
        userAvatar,
        achievements,
        completedAchievements,
        incompleteAchievements,
        uploadAvatar,
        showDialog,
        dialogContent,
        showAchievementDetails,
        closeDialog,
        initializeAchievements,
      };
    },
  };
  </script>
  
  <style scoped>
  .profile-page {
    padding: 20px;
  }
  .avatar-section {
    margin-bottom: 20px;
  }
  .avatar-label {
    cursor: pointer;
  }
  .avatar-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ccc;
  }
  .achievements {
    margin-top: 20px;
  }
  .achievements-completed, .achievements-incomplete {
    margin-bottom: 20px;
  }
  .achievements-list {
    display: flex;
    flex-wrap: wrap;
  }
  .achievement-item {
    margin: 10px;
    text-align: center;
    cursor: pointer;
  }
  .achievement-icon {
    width: 50px;
    height: 50px;
  }
  .completed {
    opacity: 1;
  }
  .incomplete-icon {
    opacity: 0.4; /* 未完成成就的圖標顏色較淺 */
  }
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dialog {
    background: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
  .initialize-btn {
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 20px;
  }
  .initialize-btn:hover {
    background-color: #2980b9;
  }
  </style>
  