<template>
    <div class="task-page">
        <h2>Add New Task</h2>
        <form @submit.prevent="addTask">
            <div class="form-group">
                <input v-model="newTaskDescription" placeholder="Enter task description" required />
            </div>
            <button type="submit">Add Task</button>
        </form>

        <h2>Existing Tasks</h2>
        <ul>
            <li v-for="task in tasks" :key="task.id">
                {{ task.description }} - Status: {{ task.status }}
            </li>
        </ul>
    </div>
</template>

<script>
import { ref, push, onValue } from "firebase/database";
import { database } from "../firebase"; // 引入 Firebase Realtime Database

export default {
    data() {
        return {
            newTaskDescription: "", // 新任務描述
            tasks: [] // 現有任務列表
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
                status: "not started"
            };

            // 將新任務推送到 Firebase
            push(tasksRef, newTask)
                .then(() => {
                    this.newTaskDescription = ""; // 清空輸入框
                })
                .catch((error) => {
                    console.error("Error adding task:", error);
                });
        },
        loadTasks() {
            const userId = JSON.parse(localStorage.getItem("user")).uid;
            const tasksRef = ref(database, `users/${userId}/tasks`);

            // 監聽任務列表的變化
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

<style scoped>
.task-page {
    max-width: 400px;
    margin: 0 auto;
}

.form-group {
    margin-bottom: 10px;
}
</style>