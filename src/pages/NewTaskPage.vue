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
export default {
    data() {
        return {
            newTaskDescription: "",
            newTaskUsername: "",
            tasks: [],
            showPopup: false, // Controls the visibility of the popup modal
        };
    },
    mounted() {
        this.loadTasks();
    },
    methods: {
        addTask() {
            const newTask = {
                id: this.generateId(),
                description: this.newTaskDescription,
                username: this.newTaskUsername || "Anonymous",
                published_time: new Date().toISOString().split('T')[0], // Gets the current date in yyyy-mm-dd format
                status: "not started",
            };

            this.tasks.push(newTask); // Add new task to local tasks array
            this.newTaskDescription = "";
            this.newTaskUsername = "";
            this.showPopup = false; // Hide the popup after adding task
        },
        loadTasks() {
            // Mock loading tasks from a local array
            this.tasks = [
                {
                    id: "1",
                    description: "Complete project documentation",
                    username: "John Doe",
                    published_time: "2024-12-10",
                    status: "not started",
                },
                {
                    id: "2",
                    description: "Code review with the team",
                    username: "Jane Smith",
                    published_time: "2024-12-09",
                    status: "in progress",
                },
                {
                    id: "3",
                    description: "Prepare project presentation",
                    username: "Alice Brown",
                    published_time: "2024-12-08",
                    status: "completed",
                },
            ];
        },
        generateId() {
            // Generate a simple unique ID for new tasks
            return Date.now().toString();
        },
    },
};
</script>

<style scoped>
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
</style>
