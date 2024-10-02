<template>
    <div id="main-page">
        <!-- 如果 user 尚未加載，顯示加載提示 -->
        <div v-if="!user">
            <p>Loading user information...</p>
        </div>

        <!-- 寵物顯示區域 -->
        <div class="card pet-display" v-if="user">
            <h2>Your Pet</h2>
            <img src="test1.webp" alt="Pet Image" class="pet-image" />
            <p class="pet-level">Level: {{ petLevel }}</p>
        </div>

        <!-- 任務狀態顯示 -->
        <div class="card task-status" v-if="user">
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
                        Complete Task
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { ref, update, onValue } from 'firebase/database';
import { database } from '../firebase'; // 引入 Firebase Realtime Database

export default {
    data() {
        return {
            user: null, // 用戶資訊
            petLevel: 1, // 初始寵物等級
            virtualCoins: 0, // 初始虛擬幣
            tasks: [], // 任務列表
            passiveIncomeInterval: null // 用於被動收入的定時器
        };
    },
    mounted() {
        this.loadUserData();
    },
    methods: {
        loadUserData() {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                this.user = JSON.parse(storedUser); // 確保 user 被正確設置
                const userId = this.user.uid;
                const userRef = ref(database, `users/${userId}`);

                // 監聽 Firebase Realtime Database 寵物等級和虛擬幣的變化
                onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        this.petLevel = data.petLevel || 1;
                        this.virtualCoins = data.virtualCoins || 0;
                        this.tasks = data.tasks || []; // 從 Firebase 加載任務列表
                    }
                });

                this.startPassiveIncome(); // 開始被動收入邏輯
            } else {
                this.$router.push('/'); // 如果沒有用戶資料，重定向回登入頁面
            }
        },
        acceptTask(task) {
            task.status = 'in progress'; // 修改任務狀態
            this.updateTasks();
        },
        completeTask(task) {
            task.status = 'completed'; // 修改任務狀態
            this.petLevel += 1; // 每完成一個任務提升寵物等級
            this.virtualCoins += 10; // 完成任務增加虛擬幣
            this.updateTasks(); // 更新 Firebase 上的數據
        },
        updateTasks() {
            // 將資料更新到 Firebase
            const userId = this.user.uid;
            const userRef = ref(database, `users/${userId}`);
            update(userRef, {
                petLevel: this.petLevel,
                virtualCoins: this.virtualCoins,
                tasks: this.tasks // 同步更新任務狀態
            });
        },
        startPassiveIncome() {
            // 每 10 秒自動賺取虛擬幣
            this.passiveIncomeInterval = setInterval(() => {
                this.virtualCoins += 1;
                const userId = this.user.uid;
                const userRef = ref(database, `users/${userId}`);
                update(userRef, {
                    virtualCoins: this.virtualCoins,
                });
            }, 10000); // 10 秒
        }
    },
    beforeUnmount() {
        clearInterval(this.passiveIncomeInterval); // 清除定時器
    }
};
</script>



<style scoped>
#main-page {
    padding-top: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
}

.card {
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
    width: 100%;
    max-width: 500px;
    margin-bottom: 20px;
}

.pet-display img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 15px;
}

.pet-level {
    font-size: 18px;
    font-weight: bold;
    color: #2c3e50;
}

/* 任務區塊 */
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
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

button:hover {
    background-color: #2980b9;
}

.task-intro {
    color: #7f8c8d;
    margin-bottom: 10px;
}

@media only screen and (max-width: 600px) {
    .pet-display img {
        width: 120px;
        height: 120px;
    }

    .card {
        padding: 15px;
    }

    .task-status li {
        font-size: 14px;
    }

    #main-page {
        padding: 10px;
    }
}
</style>