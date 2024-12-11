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
export default {
    data() {
        return {
            newTaskDescription: "", // 新任務描述
            tasks: [] // 現有任務列表
        };
    },
    methods: {
        addTask() {
            // 生成新的任務物件
            const newTask = {
                id: Date.now(), // 使用當前時間戳作為唯一 ID
                description: this.newTaskDescription,
                status: "not started"
            };

            // 將新任務加入到本地任務列表
            this.tasks.push(newTask);

            // 清空輸入框
            this.newTaskDescription = "";
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
