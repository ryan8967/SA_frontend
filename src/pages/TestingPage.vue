<template>
    <div class="task-page">
      <!-- Task Input Popup -->
      <div v-if="showPopup" class="popup">
        <div class="popup-content">
          <textarea v-model="newTaskDescription" placeholder="Describe your task..." class="input-textarea"></textarea>
          <div class="popup-actions">
            <button @click="addTask" class="btn btn-primary">Add Task</button>
            <button @click="cancelTask" class="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
  
      <!-- Task List -->
      <div class="task-list">
        <div v-for="task in tasks" :key="task.id" class="task-item">
          <div class="task-header">
            <span class="task-username">{{ task.username }}</span>
            <span class="task-time">{{ task.time }}</span>
          </div>
          <div class="task-description">{{ task.description }}</div>
        </div>
      </div>
  
      <!-- Add Task Button -->
      <button class="add-task-btn" @click="togglePopup">
        <font-awesome-icon :icon="['fas', 'plus']" />
      </button>
    </div>
  </template>
  
  <script>
  import { ref as vueRef } from 'vue'; // Use 'vueRef' to avoid conflict with Firebase ref
  import { ref, push, onValue } from "firebase/database";
  import { database } from "../firebase";
  import { useUserStore } from "@/stores/userStore";
  
  export default {
    setup() {
      const tasks = vueRef([]);
      const newTaskDescription = vueRef('');
      const showPopup = vueRef(false);
  
      const userStore = useUserStore();
      let user = userStore.user;
  
      const togglePopup = () => {
        showPopup.value = !showPopup.value;
      };
  
      const addTask = () => {
        if (!user) {
            console.error("User is not defined yet.");
            return;
        }
        if (newTaskDescription.value.trim()) {
          const userId = JSON.parse(localStorage.getItem("user")).uid; // Assuming user ID is stored here
          const tasksRef = ref(database, `users/${userId}/tasks`);
          console.log(this.user.displayName);
          const newTask = {
            description: newTaskDescription.value,
            username: this.user.displayName, // Assuming user.displayName is available
            time: new Date().toISOString().split('T')[0], // yyyy-mm-dd format
            status: "not started"
          };
          
          // Push new task to Firebase
          push(tasksRef, newTask)
            .then(() => {
              newTaskDescription.value = '';
              showPopup.value = false; // Hide the popup after adding task
            })
            .catch((error) => {
              console.error("Error adding task:", error);
            });
        }
      };
  
      const cancelTask = () => {
        newTaskDescription.value = '';
        showPopup.value = false;
      };
  
      const loadTasks = () => {
        const userId = JSON.parse(localStorage.getItem("user")).uid;
        const tasksRef = ref(database, `users/${userId}/tasks`);
  
        onValue(tasksRef, (snapshot) => {
          const data = snapshot.val();
          const tasksArray = [];
  
          for (const key in data) {
            tasksArray.push({
              id: key,
              ...data[key]
            });
          }
  
          tasks.value = tasksArray;
        });
      };
  
      // Call loadTasks when component is mounted
      loadTasks();
  
      return {
        user,
        tasks,
        newTaskDescription,
        showPopup,
        togglePopup,
        addTask,
        cancelTask,
      };
    }
  };
  </script>

<style scoped>
/* General Layout */
.task-page {
margin-top: 60px; /* Space for NavBar */
margin-bottom: 60px; /* Space for BottomBar */
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
margin-top: 20px;
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
  