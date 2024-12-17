<template>
    <div class="task-status-container">
        <div class="card task-status">
            <h2>Task Status</h2>
            <p class="task-intro">Complete tasks to level up your pet!</p>
            <ul>
                <li v-for="task in tasks" :key="task.id">
                    <span>{{ task.description }}</span>
                    <span class="task-status-text">Status: {{ task.status }}</span>
                    <button v-if="task.status === 'not started'" @click="acceptTask(task)">
                        Accept Task
                    </button>
                    <button v-if="task.status === 'in progress'" @click="completeTask(task)">
                        做任務
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TaskStatus',
    props: {
        petStore: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            tasks: [
                { id: 1, description: "記起來5個字卡", status: "in progress" },
                { id: 2, description: "新增5個字卡", status: "in progress" },
                { id: 3, description: "點擊簽到", status: "in progress" },
            ]
        };
    },
    methods: {
        acceptTask(task) {
            task.status = "in progress";
        },
        completeTask(task) {
            if (task.id == 1) {
                this.$router.push("/learn");
            }
            else if(task.id == 2) {
                this.$router.push("/card");
            }
            else {
                task.status = "completed";
                this.petStore.addExperience(20);
                this.$emit('show-experience-modal');
            }
        },
        async fetchTaskStatus() {
            //取得status
            /*
            try {
                const db = getDatabase();
                const userId = JSON.parse(localStorage.getItem('user')).username;
                for (let task of this.tasks) {
                    const taskRef = ref(db, `users/${userId}/tasks/${task.id}`);
                    const snapshot = await get(taskRef);
                    if (snapshot.exists()) {
                        task.status = snapshot.val().status;
                    }
                }
            } catch (error) {
                console.error("Error fetching task status: ", error);
            }
            */
        }
    }
};
</script>

<style scoped>
.task-status-container {
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 100px 20px;
    box-sizing: border-box;
}

.card {
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
    width: 100%;
    max-width: 800px;
    margin-bottom: 20px;
}

.task-status ul {
    list-style-type: none;
    padding: 0;
}

.task-status li {
    background-color: #f0f4f8;
    margin: 10px 0;
    padding: 10px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.task-status-text {
    font-size: 14px;
    color: #7f8c8d;
}

button {
    padding: 8px 12px;
    background-color: #ff5349;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

button:hover {
    background-color: #ff5349;
}

.task-intro {
    color: #7f8c8d;
    margin-bottom: 10px;
}

@media only screen and (max-width: 600px) {
    .task-status-container {
        padding: 100px 10px;
    }

    .card {
        padding: 15px;
    }

    .task-status li {
        font-size: 14px;
    }
}
</style>