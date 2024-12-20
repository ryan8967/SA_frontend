<template>
  <div class="task-page">
    <!-- Task Input Popup -->
    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <input v-model="newTaskTitle" placeholder="Task title..." class="input-title" />
        <textarea v-model="newTaskDescription" placeholder="Describe your task..." class="input-textarea"></textarea>
        <div class="popup-actions">
          <button @click="addTask" class="btn btn-primary">Add Task</button>
          <button @click="cancelTask" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Task List -->
    <div class="task-list">
      <button @click="navigateToSocial" class="btn btn-social">Go to Social</button>
      <h2>Not Started</h2>
      <div v-for="task in tasks.filter(task => task.status === 'not started')" :key="task.id" class="task-item">
        <div class="task-header">
          <span class="task-title">{{ task.title }}</span>
          <span class="task-username">{{ task.username }}</span>
          <span class="task-time">{{ task.time }}</span>
        </div>
        <div class="task-description">{{ task.description }}</div>
        <button @click="updateTaskStatus(task.id, 'in progress')" class="btn btn-primary">Start the Event</button>
        <button @click="toggleJoinTask(task.id)" class="btn btn-secondary">
          {{ isUserJoined(task) ? 'Disjoin' : 'Join' }} ({{ task.attendees ? Object.keys(task.attendees).length : 0 }})
        </button>
      </div>

      <h2>In Progress</h2>
      <div v-for="task in tasks.filter(task => task.status === 'in progress')" :key="task.id" class="task-item">
        <div class="task-header">
          <span class="task-title">{{ task.title }}</span>
          <span class="task-username">{{ task.username }}</span>
          <span class="task-time">{{ task.time }}</span>
        </div>
        <div class="task-description">{{ task.description }}</div>
        <button @click="updateTaskStatus(task.id, 'completed')" class="btn btn-primary">End the Event</button>
        <button @click="toggleJoinTask(task.id)" class="btn btn-secondary">
          {{ isUserJoined(task) ? 'Disjoin' : 'Join' }} ({{ task.attendees ? Object.keys(task.attendees).length : 0 }})
        </button>
      </div>

      <h2>Completed</h2>
      <div v-for="task in tasks.filter(task => task.status === 'completed')" :key="task.id" class="task-item">
        <div class="task-header">
          <span class="task-title">{{ task.title }}</span>
          <span class="task-username">{{ task.username }}</span>
          <span class="task-time">{{ task.time }}</span>
        </div>
        <div class="task-description">{{ task.description }}</div>
        <button @click="toggleJoinTask(task.id)" class="btn btn-secondary">
          {{ isUserJoined(task) ? 'Disjoin' : 'Join' }} ({{ task.attendees ? Object.keys(task.attendees).length : 0 }})
        </button>
      </div>
    </div>

    <!-- Add Task Button -->
    <button class="add-task-btn" @click="togglePopup">
      Add Task
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newTaskTitle: "",
      newTaskDescription: "",
      tasks: [], // 使用本地資料來儲存任務
      showPopup: false,
    };
  },
  methods: {
    navigateToSocial() {
      this.$router.push({ name: 'Social' });
    },
    togglePopup() {
      this.showPopup = !this.showPopup;
    },
    addTask() {
      const newTask = {
        id: Date.now(), // 唯一 ID
        title: this.newTaskTitle,
        description: this.newTaskDescription,
        username: "Anonymous", // 預設用戶名稱
        time: new Date().toISOString().split('T')[0], // yyyy-mm-dd 格式
        status: "not started",
        attendees: {},
      };
      this.tasks.push(newTask);
      this.newTaskTitle = "";
      this.newTaskDescription = "";
      this.showPopup = false;
    },
    updateTaskStatus(taskId, newStatus) {
      const task = this.tasks.find(t => t.id === taskId);
      if (task) task.status = newStatus;
    },
    toggleJoinTask(taskId) {
      const task = this.tasks.find(t => t.id === taskId);
      const userId = "User123"; // 模擬用戶 ID
      if (!task.attendees) task.attendees = {};
      if (task.attendees[userId]) {
        delete task.attendees[userId];
      } else {
        task.attendees[userId] = "Anonymous"; // 模擬用戶名稱
      }
    },
    isUserJoined(task) {
      const userId = "User123"; // 模擬用戶 ID
      return task.attendees && task.attendees[userId];
    },
    cancelTask() {
      this.newTaskTitle = "";
      this.newTaskDescription = "";
      this.showPopup = false;
    },
  },
};
</script>

<style scoped>
/* General Layout */
.task-page {
  /*margin-top: 200px;*/
  /* Space for NavBar */
  /*margin-bottom: 200px;*/
  /* Space for BottomBar */
  display: flex;
  flex-direction: column;
  justify-items: center;
  flex-wrap: wrap;
  padding: 0;
  background-color: #f4f7fa;
  min-height: 100vh;
  box-sizing: border-box;
  width: 100vw;
  height: 100%;
}

/* Add Task Button */
.add-task-btn {
  position: fixed;
  bottom: 80px;
  right: 20px;
  background-color: #ff4500;
  color: white;
  border: none;
  padding: 20px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.add-task-btn:hover {
  background-color: #e87b54;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.25);
}

/* Task List */
.task-list {
  padding: 20% 0%;
}

.task-item {
  background-color: white;
  border-radius: 8px;
  padding: 15px 20px;
  margin-bottom: 15px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.task-item:hover {
  transform: translateY(-5px);
}

/* Task Header */
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.task-username {
  font-weight: 600;
  font-size: 14px;
  color: #ff5349;
}

.task-time {
  font-size: 12px;
  color: #7f8c8d;
}

.task-description {
  font-size: 22px;
  font-weight: bold;
  line-height: 1.5;
  color: #2c3e50;

}

/* Popup Styles */
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 30px;
  width: 350px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  z-index: 1000;
}

.popup-content {
  display: flex;
  flex-direction: column;
}

.input-textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 14px;
  resize: none;
}

.popup-actions {
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {

  background-color: #ff5349;
  color: white;
}

.btn-primary:hover {
  background-color: #d38e6c;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}

.btn-social {
  background-color: #ff5349;
  /* 按鈕的背景色 */
  color: white;
  /* 按鈕上的文字顏色 */
  border: none;
  /* 去掉邊框 */
  padding: 10px 15px;
  /* 調整內邊距，讓按鈕更大 */
  border-radius: 5px;
  /* 圓角邊框 */
  cursor: pointer;
  /* 當滑鼠移到按鈕上顯示手型 */
  font-size: 16px;
  /* 調整字體大小 */
  font-weight: bold;
  /* 調整文字粗細 */
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  /* 添加過渡效果 */
  margin: 15px 0;
  /* 調整按鈕與周圍的間距 */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  /* 添加陰影效果 */
}

.btn-social:hover {
  background-color: #cf807c;
  /* 當滑鼠懸停時改變背景顏色 */
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.25);
  /* 滑鼠懸停時加深陰影效果 */
}

.btn-social:active {
  background-color: #cf807c;
  /* 當按下按鈕時的背景顏色 */
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  /* 按下時陰影縮小 */
}
</style>
