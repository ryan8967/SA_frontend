<template>
    <div class="profile-page">
      <h1 class="title">個人資料頁面</h1>
  
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
            <img :src="achievement.icon" :alt="achievement.description" class="achievement-icon" />
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
  import { ref, computed } from 'vue';
  
  export default {
    setup() {
      const userAvatar = ref("/default-avatar.png"); // 預設頭像
      const achievements = ref([
        {
          id: 'login-three-times',
          icon: 'badge/login-three-times-badge.png',
          description: '登入三次的成就',
          completed: true,
        },
        {
          id: 'employee-of-the-year',
          //name: '年度最佳員工',
          icon: 'badge/employOfTheYear.png',
          description: '獲得年度最佳員工的成就',
          completed: false,
        },
        {
          id: 'first-avatar-change',
          //name: '第一次換頭像',
          icon: 'badge/firstTime.webp',
          description: '首次更換頭像的成就',
          completed: false,
        },
        // 其他成就...
      ]);
  
      const completedAchievements = computed(() => achievements.value.filter(achievement => achievement.completed));
      const incompleteAchievements = computed(() => achievements.value.filter(achievement => !achievement.completed));
  
      const showDialog = ref(false);
      const dialogContent = ref("");
  
      const uploadAvatar = async (event) => {
        const file = event.target.files[0];
        if (file) {
          userAvatar.value = URL.createObjectURL(file);
          // 更新第一次換頭像的成就狀態
          const firstAvatarChange = achievements.value.find((achievement) => achievement.id === 'first-avatar-change');
          if (firstAvatarChange && !firstAvatarChange.completed) {
            firstAvatarChange.completed = true;
            await updateFirebaseAchievement(firstAvatarChange);
            updateAchievements();
          }
        }
      };
  
      const updateFirebaseAchievement = async (achievement) => {
        // 在這裡添加與 Firebase 通訊的邏輯
        console.log(`成就 ${achievement.name} 已更新至 Firebase`);
      };
  
      const updateAchievements = () => {
        achievements.value = [...achievements.value];
      };
  
      const showAchievementDetails = (achievement) => {
        dialogContent.value = (achievement.description || achievement.name) + '\n可兌換300鑽石';
        showDialog.value = true;
      };
  
      const closeDialog = () => {
        showDialog.value = false;
      };
  
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
    opacity: 0.6;
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
  </style>
  