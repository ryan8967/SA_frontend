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
  
  <style scoped>
  /* Center the entire task page */
  .task-page {

    width:100%;
    /* width: 100%; */
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    margin-top: 20vh;
  }
  
  /* Style for the add task button */
  .add-task-btn {
    margin-bottom: 20px;
    font-size: 24px;
    padding: 10px 20px;
    cursor: pointer;
  }
  
  /* Remove default list styles and center the task list */
  .task-list {
    display: flex;
    flex-direction: column;
    list-style-type: none;
    padding: 0;
    margin: 0;
    width: 100%;
    /* max-width: 600px; Adjust the max-width as needed */
  }
  
  /* Center each task item */
  .task-item {
    width: 100%;
    margin-bottom: 15px;
  }
  
  /* Style for the task card */
  .task-card {
    border: 1px solid #ccc;
    padding: 15px;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  /* Style for the task header */
  .task-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10
  }
</style>
<script>
import { ref, push, onValue } from "firebase/database";
import { database } from "../firebase";
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
            tasks: [],
            showPopup: false // Controls the visibility of the popup modal
        };
    },
    mounted() {
        this.loadTasks();
    },
    methods: {
        addTask() {
            const userId = JSON.parse(localStorage.getItem("user")).uid;
            const tasksRef = ref(database, `users/${userId}/tasks`);
            const newTask = {
                description: this.newTaskDescription,
                username: this.user.displayName,
                published_time: new Date().toISOString().split('T')[0], // Gets the current date in yyyy-mm-dd format
                status: "not started"
            };

            // Push new task to Firebase
            push(tasksRef, newTask)
                .then(() => {
                    this.newTaskDescription = "";
                    this.newTaskUsername = "";
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
                        ...data[key]
                    });
                }

                this.tasks = tasksArray;
            });
        }
    }
};
</script>
<!-- <style scoped>
.task-page {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 100vh; /* Full height of the viewport */
    padding: 10px;
}

.task-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column; /* Ensure tasks are listed from top to bottom */
    width: 100%;
    height: 100%; /* Make sure the task list fills the available space */
    overflow-y: auto; /* Allow scrolling if tasks overflow */
}

.task-item {
    width: 100%; /* Make each task item take full width */
    margin: 10px 0; /* Add space between task items */
}

.task-card {
    background-color: #f4f4f4;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    height: 200px; /* Fixed height */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.add-task-btn {
    font-size: 2rem;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    position: fixed;
    bottom: 20px;
    right: 20px;
    cursor: pointer;
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
</style> -->
