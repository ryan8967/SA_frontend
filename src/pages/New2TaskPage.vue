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
  </div>
</template>

<script>
import AchievementPopup from '../components/AchievementPopup.vue';
import { useUserStore } from "@/stores/userStore";
import { usePetStore } from '../stores/petStore';

export default {
  components: {
    AchievementPopup,
  },
  setup() {
    const userStore = useUserStore();
    const petStore = usePetStore();

    return {
      userStore,
      petStore,
    };
  },
  data() {
    return {
      tasks: [], // 本地模擬的任務數據
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
    loadTasks() {
      // 模擬從後端獲取任務數據
      this.tasks = [
        {
          id: "1",
          title: "Finish Vue.js project",
          description: "Complete the Vue.js front-end for the project",
          username: "John Doe",
          time: "2024-12-10",
          status: "not started",
        },
        {
          id: "2",
          title: "Write Documentation",
          description: "Prepare documentation for the project",
          username: "Jane Smith",
          time: "2024-12-09",
          status: "in progress",
        },
        {
          id: "3",
          title: "Project Review",
          description: "Review the project with the team",
          username: "Sam Wilson",
          time: "2024-12-08",
          status: "completed",
        },
      ];
    },
    receiveReward(taskId) {
      const task = this.tasks.find(task => task.id === taskId);
      if (task) {
        this.isPopupVisible = true;
        this.popupTitle = `${task.title} 成就解鎖：超級冒險者！`;
        this.popupDescription = "你已經完成了所有挑戰，獲得了獨特的獎勵！";
        this.popupImage = "./pet/pet1.png";
        this.petStore.addExperience(50); // 增加寵物經驗值
      }
    },
  },
};
</script>

<style scoped>
/* General Layout */

#text {
  font-size: 20px;
  color: #333;

}

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
  color: #ff5349;
}

.task-time {
  font-size: 12px;
  color: #7f8c8d;
}

.task-description {
  font-size: 20px;
  font-weight: bold;
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
  background-color: #ff5349;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  font-weight: bold;
}

.reward-btn:hover {
  background-color: #db7671;
}
</style>