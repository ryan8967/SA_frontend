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
          <font-awesome-icon :icon="['fas', 'user']" class="icon" />
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
          <font-awesome-icon :icon="['fas', 'user']" class="icon" />
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
          <font-awesome-icon :icon="['fas', 'user']" class="icon" />
          {{ isUserJoined(task) ? 'Disjoin' : 'Join' }} ({{ task.attendees ? Object.keys(task.attendees).length : 0 }})
        </button>
      </div>
    </div>

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

export default {
  setup() {
    const userStore = useUserStore();
    // Making user reactive via computed
    const user = userStore.user;

    return {
      user,
    };
  },
  data() {
    return {
      newTaskTitle: "",
      newTaskDescription: "",
      tasks: [],
      showPopup: false, // Controls the visibility of the popup modal
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
      // const userId = JSON.parse(localStorage.getItem("user")).uid;
      const tasksRef = ref(database, `tasks`); //users/${userId}/
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
      // const userId = JSON.parse(localStorage.getItem("user")).uid;
      const tasksRef = ref(database, `tasks`); //users/${userId}/

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
      // const userId = JSON.parse(localStorage.getItem("user")).uid;
      const taskRef = ref(database, `tasks/${taskId}`); //users/${userId}/

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
  },
};
</script>

<style scoped>
/* General Layout */
.task-page {
  /*margin-top: 200px;*/ /* Space for NavBar */
  /*margin-bottom: 200px;*/ /* Space for BottomBar */
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
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}
</style>
