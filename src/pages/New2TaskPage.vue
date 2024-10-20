<template>
  <div class="task-page">
    <!-- Task List -->
    <div class="task-list">
      <h2>Not Started</h2>
      <div v-for="task in tasks.filter(task => task.status === 'not started')" :key="task.id" class="task-item">
        <div class="task-header">
          <span class="task-title">{{ task.title }}</span>
          <span class="task-username">{{ task.username }}</span>
          <span class="task-time">{{ task.time }}</span>
        </div>
        <div class="task-description">{{ task.description }}</div>
        <div class="task-progress">
          <progress :value="0" max="100"></progress>
          <span>0% Complete</span>
        </div>
      </div>

      <h2>In Progress</h2>
      <div v-for="task in tasks.filter(task => task.status === 'in progress')" :key="task.id" class="task-item">
        <div class="task-header">
          <span class="task-title">{{ task.title }}</span>
          <span class="task-username">{{ task.username }}</span>
          <span class="task-time">{{ task.time }}</span>
        </div>
        <div class="task-description">{{ task.description }}</div>
        <div class="task-progress">
          <progress :value="50" max="100"></progress>
          <span>50% Complete</span>
        </div>
      </div>

      <h2>Completed</h2>
      <div v-for="task in tasks.filter(task => task.status === 'completed')" :key="task.id" class="task-item">
        <div class="task-header">
          <span class="task-title">{{ task.title }}</span>
          <span class="task-username">{{ task.username }}</span>
          <span class="task-time">{{ task.time }}</span>
        </div>
        <div class="task-description">{{ task.description }}</div>
        <div class="task-progress">
          <progress :value="100" max="100"></progress>
          <span>100% Complete</span>
          <button class="reward-btn" @click="receiveReward(task.id)">Receive Reward</button>
        </div>
      </div>
    </div>
    <AchievementPopup v-if="isPopupVisible" :title="popupTitle" :description="popupDescription" :image="popupImage"
      @close="isPopupVisible = false" />
    <!-- Add Task Button -->
    <button class="add-task-btn" @click="togglePopup">
      <font-awesome-icon :icon="['fas', 'plus']" />
    </button>
  </div>
</template>

<script>
import { ref, push, onValue, update, remove } from "firebase/database";
import { database } from "../firebase";
import { useUserStore } from "@/stores/userStore";
import AchievementPopup from '../components/AchievementPopup.vue';
import { usePetStore } from '../stores/petStore'; // 引入狀態管理


export default {
  components: {
    AchievementPopup,
  },
  setup() {
    const userStore = useUserStore();
    // Making user reactive via computed
    const user = userStore.user;
    const petStore = usePetStore();


    return {
      petStore,
      user,
    };
  },
  data() {
    return {
      newTaskTitle: "",
      newTaskDescription: "",
      tasks: [],
      showPopup: false, // Controls the visibility of the popup modal
      isPopupVisible: false,
      popupTitle: "",
      popupDescription: "",
      popupImage: "",
    };
  },
  mounted() {
    this.loadTasks();
  },
  methods: {
    togglePopup() {
      this.showPopup = !this.showPopup;
    },
    addTask() {
      const userId = JSON.parse(localStorage.getItem("user")).uid;
      const tasksRef = ref(database, `users/${userId}/tasks`);
      const newTask = {
        title: this.newTaskTitle,
        description: this.newTaskDescription,
        username: this.user ? this.user.displayName : "Anonymous", // Fallback for displayName
        time: new Date().toISOString().split('T')[0], // yyyy-mm-dd format
        status: "not started",
        attendees: {},
      };

      // Push new task to Firebase
      push(tasksRef, newTask)
        .then(() => {
          this.newTaskTitle = "";
          this.newTaskDescription = "";
          this.showPopup = false; // Hide the popup after adding task
        })
        .catch((error) => {
          console.error("Error adding task:", error);
        });
    },
    loadTasks() {
      const userId = JSON.parse(localStorage.getItem("user")).uid;
      const tasksRef = ref(database, `users/${userId}/tasks`);

      onValue(tasksRef, (snapshot) => {
        const data = snapshot.val();
        const tasksArray = [];

        for (const key in data) {
          tasksArray.push({
            id: key,
            ...data[key],
          });
        }

        this.tasks = tasksArray;
      });
    },
    updateTaskStatus(taskId, newStatus) {
      const userId = JSON.parse(localStorage.getItem("user")).uid;
      const taskRef = ref(database, `users/${userId}/tasks/${taskId}`);

      update(taskRef, { status: newStatus }).catch((error) => {
        console.error("Error updating task status:", error);
      });
    },
    toggleJoinTask(taskId) {
      const userId = JSON.parse(localStorage.getItem("user")).uid;
      const userName = this.user ? this.user.displayName : "Anonymous";
      const taskRef = ref(database, `tasks/${taskId}/attendees/${userId}`);

      if (this.isUserJoined(this.tasks.find(task => task.id === taskId))) {
        remove(taskRef).catch((error) => {
          console.error("Error disjoining task:", error);
        });
      } else {
        update(taskRef, { username: userName }).catch((error) => {
          console.error("Error joining task:", error);
        });
      }
    },
    isUserJoined(task) {
      const userId = JSON.parse(localStorage.getItem("user")).uid;
      return task.attendees && task.attendees[userId];
    },
    cancelTask() {
      this.newTaskTitle = "";
      this.newTaskDescription = "";
      this.showPopup = false;
    },
    receiveReward(taskId) {


      // to pop up
      //alert(`Reward received for task ${taskId}!`);
      this.isPopupVisible = true;
      this.popupTitle = taskId + " 成就解鎖：超級冒險者！";
      this.popupDescription = "你已經完成了所有挑戰，獲得了獨特的獎勵！";
      this.popupImage = "./pet/pet1.png";

      this.petStore.addExperience(50); // 增加當前選中寵物的經驗值
      alert(`Reward received for task ${taskId}!`);

      // Additional logic for rewarding can be added here
    },
  },
};
</script>

<style scoped>
/* General Layout */
.task-page {
  margin-top: 80px;
  /* Space for NavBar */
  margin-bottom: 60px;
  /* Space for BottomBar */
  padding: 20px;
  background-color: #f4f7fa;
  min-height: 100vh;
  box-sizing: border-box;
  width: 100vw;
}

/* Add Task Button */
.add-task-btn {
  position: fixed;
  bottom: 80px;
  right: 20px;
  background-color: #28a745;
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
  background-color: #218838;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.25);
}

/* Task List */
.task-list {
  /* margin-top: 20px; */
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
  color: #3498db;
}

.task-time {
  font-size: 12px;
  color: #7f8c8d;
}

.task-description {
  font-size: 16px;
  line-height: 1.5;
  color: #2c3e50;
}

/* Task Progress */
.task-progress {
  margin-top: 10px;
}

progress {
  width: 100%;
  height: 10px;
}

.reward-btn {
  margin-top: 10px;
  padding: 10px;
  background-color: #ffc107;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  font-weight: bold;
}

.reward-btn:hover {
  background-color: #e0a800;
}
</style>