<template>
    <div class="task-page">
        <!-- Button to trigger popup -->
        <button @click="showPopup = true" class="add-task-btn">+</button>
        
        <!-- Task list display -->
        <ul>
            <li v-for="task in tasks" :key="task.id" class="card task-item">
                <div class="task-header">
                    <span class="task-username">{{ task.username }}</span>
                    <span class="task-time">{{ task.published_time }}</span>
                </div>
                <div class="task-body">
                    <span class="task-description">{{ task.description }}</span>
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
    max-width: 450px;
    margin: 0 auto;
    position: relative;
    padding-top: 35vh;
    box-sizing: border-box;
    background-color: #f9f9f9;
    min-height: 100vh;
}

.add-task-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 15px;
    font-size: 28px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 50%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    z-index: 1000;
}

.add-task-btn:hover {
    background-color: #0056b3;
}

.task-item {
    background-color: white;
    border: 1px solid #eee;
    margin: 10px 0;
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.3s ease;
}

.task-item:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.task-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    margin-bottom: 8px;
    color: #333;
}

.task-username {
    font-size: 18px;
}

.task-time {
    font-size: 14px;
    color: #999;
}

.task-body {
    margin-top: 10px;
    font-size: 16px;
    color: #555;
}

.popup-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1001;
}

.popup-content {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 320px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.popup-content h3 {
    font-size: 20px;
    margin-bottom: 15px;
    text-align: center;
}

.popup-buttons {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
}

.popup-buttons button {
    flex: 1;
    margin: 0 5px;
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
}

.popup-buttons button:first-child {
    background-color: #007bff;
    color: white;
}

.popup-buttons button:last-child {
    background-color: #f44336;
    color: white;
}

@media only screen and (max-width: 600px) {
    .task-page {
        padding: 15px;
    }

    .task-item {
        padding: 12px;
    }

    .add-task-btn {
        font-size: 22px;
        padding: 10px;
    }

    .popup-content {
        width: 90%;
        padding: 15px;
    }

    .popup-content h3 {
        font-size: 18px;
    }
}
</style> -->

<!-- <style scoped>
.task-page {
    max-width: 400px;
    margin: 0 auto;
    position: relative;
    padding-top: 20px;
    box-sizing: border-box;
}

.add-task-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 5px 10px;
    font-size: 24px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
}

.add-task-btn:hover {
    background-color: #0056b3;
}

.task-item {
    background-color: white;
    border: 1px solid #ccc;
    margin: 10px 0;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.task-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    margin-bottom: 10px;
}

.task-username {
    font-size: 16px;
}

.task-time {
    font-size: 12px;
    color: #999;
}

.task-body {
    margin-top: 5px;
}

.popup-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-content {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 300px;
}

.popup-buttons {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
}

@media only screen and (max-width: 600px) {
    .task-page {
        padding: 10px;
    }

    .task-item {
        padding: 10px;
    }

    .add-task-btn {
        font-size: 20px;
    }
}
</style> -->

