<template>
  <div class="task-page">
    <!-- Button to trigger popup -->
    <button @click="showPopup = true" class="add-task-btn">+</button>

    <!-- Task list display -->
    <ul class="task-list">
      <li v-for="task in tasks" :key="task.id" class="task-item">
        <div class="task-card">
          <div class="task-header">
            <span class="task-username">{{ task.username }}</span>
            <span class="task-time">{{ task.published_time }}</span>
          </div>
          <div class="task-body">
            <span class="task-description">{{ task.description }}</span>
          </div>
        </div>
      </li>
    </ul>

    <!-- Popup modal for adding a new task -->
    <div v-if="showPopup" class="popup-modal">
      <div class="popup-content">
        <h3>Add New Task</h3>
        <form @submit.prevent="addTask">
          <input v-model="newTaskUsername" placeholder="Enter username" required />
          <input v-model="newTaskDescription" placeholder="Enter task description" required />
          <div class="popup-buttons">
            <button type="submit">Add Task</button>
            <button @click="showPopup = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/userStore";

export default {
  setup() {
    const userStore = useUserStore();

    // Using computed to make the data reactive
    const user = userStore.user;

    return {
      user,
    };
  },
  data() {
    return {
      newTaskDescription: "",
      newTaskUsername: "",
      tasks: [], // 模擬的任務數據
      showPopup: false // Controls the visibility of the popup modal
    };
  },
  mounted() {
    this.loadTasks();
  },
  methods: {
    addTask() {
      const newTask = {
        id: Date.now().toString(),
        description: this.newTaskDescription,
        username: this.user?.displayName || this.newTaskUsername,
        published_time: new Date().toISOString().split('T')[0], // Gets the current date in yyyy-mm-dd format
        status: "not started"
      };

      this.tasks.push(newTask); // 將新任務加入本地任務列表
      this.newTaskDescription = "";
      this.newTaskUsername = "";
      this.showPopup = false; // 隱藏彈窗
    },
    loadTasks() {
      // 模擬加載任務數據
      this.tasks = [
        {
          id: "1",
          description: "Complete Vue.js project",
          username: "User1",
          published_time: "2024-01-01",
          status: "in progress"
        },
        {
          id: "2",
          description: "Prepare for presentation",
          username: "User2",
          published_time: "2024-01-02",
          status: "not started"
        }
      ];
    }
  }
};
</script>

<style scoped>
/* 保留原有的樣式 */
.task-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin-top: 20vh;
}

.add-task-btn {
  margin-bottom: 20px;
  font-size: 24px;
  padding: 10px 20px;
  cursor: pointer;
}

.task-list {
  display: flex;
  flex-direction: column;
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.task-item {
  width: 100%;
  margin-bottom: 15px;
}

.task-card {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.task-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.popup-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
}
</style>
