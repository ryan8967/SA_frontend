<template>
    <div id="main-page">
        <!-- 如果 user 尚未加載，顯示加載提示 -->
        <div v-if="!user">
            <p>Loading user information...</p>
        </div>

        <!-- 寵物顯示區域 -->
        <div class="card pet-display" v-if="user" @click="showClickGif">
            <h2>Your Pet</h2>
            <!-- 寵物圖片顯示與過渡效果 -->
            <div class="pet-info">
                <transition name="fade" mode="out-in">
                    <img :src="mainPetImage" alt="Main Pet" class="pet-image" v-if="!isClickGif" />
                </transition>

                <transition name="fade" mode="out-in">
                    <img v-if="isClickGif" :src="clickGifImage" alt="Clicked Pet" class="pet-image overlay" />
                </transition>

                <div class="pet-details">
                    <p class="pet-level">Level: {{ petLevel }}</p>
                    <p class="pet-name">Name: {{ petName }}</p>
                </div>
            </div>
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
            petName: 'Fluffy', // 初始寵物名稱
            mainPet: { src: 'pet/pet3.png', owned: true }, // 初始主寵物
            isClickGif: false, // 控制是否顯示 -click.gif
            tasks: [], // 任務列表
            passiveIncomeInterval: null // 用於被動收入的定時器
        };
    },
    computed: {
        // 根據主寵物編號動態選擇顯示 gif 或 png，並控制是否顯示 -click.gif
        mainPetImage() {
            if (this.mainPet && this.mainPet.src) {
                const petFileName = this.mainPet.src.split('/').pop().split('.')[0];
                if (petFileName === 'pet3' || petFileName === 'pet5') {
                    return `pet/${petFileName}.gif`; // 顯示正常的 gif
                }
                return this.mainPet.src; // 其他情況顯示 png
            }
            return ''; // 若未定義，返回空字串
        },
        // 返回 -click.gif 的圖片路徑
        clickGifImage() {
            const petFileName = this.mainPet.src.split('/').pop().split('.')[0];
            return `pet/${petFileName}-click.gif`;
        }
    },
    mounted() {
        this.loadUserData();
    },
    methods: {
        loadUserData() {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                this.user = JSON.parse(storedUser);
                const userId = this.user.uid;
                const userRef = ref(database, `users/${userId}`);

                // 監聽 Firebase Realtime Database 的變化
                onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        this.petLevel = data.petLevel || 1;
                        this.petName = data.petName || 'Fluffy';
                        this.mainPet = data.mainPet || { src: 'pet/pet3.png', owned: true };
                        this.tasks = data.tasks || [];
                    }
                });
            } else {
                this.$router.push('/'); // 如果沒有用戶資料，重定向回登入頁面
            }
        },
        acceptTask(task) {
            task.status = 'in progress';
            this.updateTasks();
        },
        completeTask(task) {
            task.status = 'completed';
            this.petLevel += 1; // 每完成一個任務提升寵物等級
            this.updateTasks();
        },
        updateTasks() {
            const userId = this.user.uid;
            const userRef = ref(database, `users/${userId}`);
            update(userRef, {
                petLevel: this.petLevel,
                tasks: this.tasks
            });
        },
        // 當用戶點擊寵物，顯示 -click.gif，並在 1.5 秒後恢復正常 gif
        showClickGif() {
            if (this.mainPet.src.includes('pet3') || this.mainPet.src.includes('pet5')) {
                this.isClickGif = true;
                setTimeout(() => {
                    this.isClickGif = false;
                }, 1500);
            }
        }
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
    width: 100%;
}

.card {
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
    width: 100%;

    margin-bottom: 20px;
}

/* 寵物顯示區域樣式 */
.pet-info {
    position: relative;
    height: 250px;
    width: 100%;
}

.pet-image,
.overlay {
    width: 350px;
    height: 350px;
    object-fit: cover;
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: opacity 0.5s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease-in-out;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.pet-details {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 5px 10px;
    border-radius: 10px;
}

.pet-level,
.pet-name {
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
    .pet-image {
        width: 150px;
        height: 150px;
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
