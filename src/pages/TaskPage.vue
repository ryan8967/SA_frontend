<template>
    <div class="task-page">
        <!-- 新任務表單區塊 -->
        <div class="card form-card">
            <h2 class="section-title">Add New Task</h2>
            <form @submit.prevent="addTask">
                <div class="form-group">
                    <input v-model="newTaskDescription" placeholder="Enter task description" required />
                </div>
                <button type="submit" class="add-btn">Add Task</button>
            </form>
        </div>

        <!-- 現有任務清單區塊 -->
        <div class="card task-list-card">
            <h2 class="section-title">Existing Tasks</h2>
            <ul class="task-list">
                <li v-for="task in tasks" :key="task.id" class="task-item">
                    <div class="task-content">
                        <span class="task-description">{{ task.description }}</span>
                        <span class="task-status">Status: {{ task.status }}</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>


<script>
export default {
    data() {
        return {
            newTaskDescription: "", // 新任務描述
            tasks: [] // 現有任務列表
        };
    },
    methods: {
        addTask() {
            const newTask = {
                id: Date.now(), // 唯一 ID
                description: this.newTaskDescription,
                status: "not started"
            };
            this.tasks.push(newTask);
            this.newTaskDescription = ""; // 清空輸入欄
        }
    }
};
</script>


<style scoped>
/* 頁面整體設計 */
.task-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f9f9f9;
    min-height: 100vh;
    gap: 20px;
    /* 區塊之間的間距 */
}

/* 卡片通用設計 */
.card {
    width: 100%;
    max-width: 600px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
    transition: all 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* 標題設計 */
.section-title {
    margin-bottom: 15px;
    font-size: 24px;
    font-weight: bold;
    color: #333;
}

/* 表單設計 */
.form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
}

.add-btn {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #2ecc71;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.add-btn:hover {
    background-color: #27ae60;
}

/* 任務清單設計 */
.task-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ecf0f1;
    border-radius: 8px;
    padding: 10px 15px;
    margin-bottom: 10px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.task-item:hover {
    transform: scale(1.02);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.task-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.task-description {
    font-size: 16px;
    font-weight: bold;
    color: #2c3e50;
}

.task-status {
    font-size: 14px;
    color: #7f8c8d;
}
</style>
