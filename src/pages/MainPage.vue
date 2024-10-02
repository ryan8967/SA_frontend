<template>
    <div id="main-page">
        <!-- Nav Bar 顯示虛擬幣與玩家資訊，固定在螢幕頂部 -->
        <nav class="nav-bar" v-if="user">
            <div class="nav-item coins">Coins: {{ virtualCoins }}</div>
            <div class="nav-item username">Hi, {{ user.displayName }}</div>
            <button class="logout-btn" @click="logout">Logout</button>
        </nav>

        <!-- 如果 user 尚未加載，顯示加載提示 -->
        <div v-else>
            <p>Loading user information...</p>
        </div>

        <!-- 寵物顯示區域 -->
        <div class="card pet-display" v-if="user">
            <h2>Your Pet</h2>
            <img :src="petImage" alt="Pet Image" class="pet-image" />
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
                    <!-- 根據任務狀態顯示相應的按鈕 -->
                    <button v-if="task.status === 'not started'" @click="acceptTask(task)">Accept Task</button>
                    <button v-if="task.status === 'in progress'" @click="completeTask(task)">Complete Task</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: null, // 用戶資訊預設為 null
            virtualCoins: 100, // 假數據: 虛擬幣數量
            petLevel: 3, // 假數據: 寵物等級
            petImage: 'test1.webp', // 假數據: 寵物圖片
            tasks: [ // 假數據: 任務列表
                { id: 1, description: 'Complete project report', status: 'not started' },
                { id: 2, description: 'Attend team meeting', status: 'in progress' },
                { id: 3, description: 'Submit performance review', status: 'not started' }
            ]
        };
    },
    mounted() {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            this.user = JSON.parse(storedUser); // 如果有儲存的用戶資料，則初始化
        } else {
            this.$router.push('/'); // 如果沒有用戶資料，重定向回登入頁面
        }
    },
    methods: {
        acceptTask(task) {
            task.status = 'in progress';
        },
        completeTask(task) {
            task.status = 'completed';
            this.virtualCoins += 10; // 完成任務獲得額外虛擬幣
        },
        async logout() {
            try {
                localStorage.removeItem('user'); // 移除本地存儲中的用戶資料
                this.user = null;
                this.$router.push('/welcome'); // 登出後導回歡迎頁面
            } catch (error) {
                console.error('Error during logout:', error);
            }
        }
    }
};
</script>

<style scoped>
/* 固定 Nav Bar 在螢幕頂部，並保持項目有足夠的間距 */
.nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #2c3e50;
    color: white;
    padding: 20px 40px;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    box-sizing: border-box;

}

.nav-item {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
}

.coins {
    flex: 1;
    text-align: left;
}

.username {
    flex: 1;
    text-align: center;
}

.logout-btn {
    flex: 1;
    text-align: right;
    background-color: #c0392b;
    color: white;
    font-size: 14px;
    padding: 8px 12px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    max-width: 80px;
}

#main-page {
    padding-top: 80px;
    /* 預留空間給 Nav Bar */
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
    .nav-bar {
        padding: 10px;
        font-size: 14px;
    }

    .logout-btn {
        font-size: 12px;
        padding: 6px 10px;
    }

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