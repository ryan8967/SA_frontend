<template>
    <div id="main-page">
        <!-- 如果 user 尚未加載，顯示加載提示 -->
        <div v-if="!user">
            <p>Loading user information...</p>
        </div>

        <!-- 寵物顯示區域 -->
        <div class="card pet-display" v-if="user" @click="showClickGif">
            <h2 class="hh">Your Pet</h2>

            <div v-if="showBubble" :key="floatingTextIndex" class="floating-text">
                {{ floatingTexts[floatingTextIndex] }}
            </div>
            <div v-else style="height: 48px;">
                &nbsp;
            </div>
            <!-- 寵物圖片顯示與過渡效果 -->
            <div class="pet-info">
                <transition name="fade" mode="out-in">
                    <img :src="mainPetImage" alt="Main Pet" class="pet-image" v-if="!isClickGif" />
                </transition>

                <transition name="fade" mode="out-in">
                    <img v-if="isClickGif" :src="clickGifImage" alt="Clicked Pet" class="pet-image overlay"
                        @click="showTextBubble" />
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
// import OpenAI from "openai";
import { usePetStore } from '../stores/petStore'; // 引入狀態管理

export default {
    setup() {
        const petStore = usePetStore();
        return {
            petStore,
        };
    },
    data() {
        return {
            user: null, // 用戶資訊
            isClickGif: false, // 控制是否顯示 -click.gif
            tasks: [], // 任務列表
            showBubble: false,
            floatingTexts: ["你超棒", "明日新星就是你", "又完成一個任務了", "加油加油", "你是最棒的"],
            floatingTextIndex: 0
        };
    },
    computed: {
        selectedPet() {
            return this.petStore.selectedPet;
        },
        petName() {
            return this.selectedPet.name || 'Fluffy';
        },
        petLevel() {
            return this.selectedPet.level || 1;
        },
        mainPetImage() {
            const petFileName = this.selectedPet.src.split('/').pop().split('.')[0];
            if (this.petStore.hasBrokenThrough && petFileName == 'pet3') {
                return 'pet/upgrade.gif'; // 突破後的主圖片
            }
            return `pet/${petFileName}.gif`;
        },
        clickGifImage() {
            const petFileName = this.selectedPet.src.split('/').pop().split('.')[0];
            if (this.petStore.hasBrokenThrough && petFileName == 'pet3') {
                return 'pet/upgrade-click.gif'; // 突破後的點擊圖片
            }
            return `pet/${petFileName}-click.gif`;
        },
    },
    mounted() {
        this.loadUserData();
        this.getMessageFromChatGPT();
    },
    methods: {
        loadUserData() {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                this.user = JSON.parse(storedUser);
            } else {
                this.$router.push('/'); // 如果沒有用戶資料，重定向回登入頁面
            }
        },
        acceptTask(task) {
            task.status = 'in progress';
        },
        completeTask(task) {
            task.status = 'completed';
            this.petStore.addExperience(10); // 完成任務提升經驗值
        },
        showClickGif() {
            this.isClickGif = true;
            setTimeout(() => {
                this.isClickGif = false;
            }, 1500);
        },
        showTextBubble() {
            this.showBubble = true;
            this.floatingTextIndex = (this.floatingTextIndex + 1) % this.floatingTexts.length;
            setTimeout(() => {
                this.showBubble = false;
            }, 5000);
        },
        async getMessageFromChatGPT() {
            // 假回傳替代 OpenAI 調用
            this.floatingTexts = ["模擬訊息1", "模擬訊息2", "模擬訊息3", "模擬訊息4", "模擬訊息5"];
        },
    },


};
</script>



<style scoped>
.hh {
    padding-bottom: 150px;
}

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
    width: 90%;

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

.floating-text {

    background-color: rgba(255, 255, 255, 0.7);
    color: rgb(0, 0, 0);
    padding: 10px 15px;
    border-radius: 10px;
    font-size: 14px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    animation: fadeOut 3s forwards;
    transform: translateY(-50px);
    opacity: 0;
    max-width: 80%;
    z-index: 1000;
    /* Limit the maximum width to keep it readable */

}

@keyframes fadeOut {
    0% {
        opacity: 1;
        transform: translateY(-100px);
    }

    90% {
        opacity: 0.5;
    }

    100% {
        opacity: 0;
        transform: translateY(-240px);
    }
}
</style>
