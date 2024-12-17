<template>
    <div id="main-page">
        <!-- Pet Display Card -->
        <div class="card pet-display" @click="showClickGif">
            <h2 class="hh">Your Pet</h2>
            <div v-if="showBubble" :key="floatingTextIndex" class="floating-text">
                {{ floatingTexts[floatingTextIndex] }}
            </div>
            <div v-else style="height: 48px;">&nbsp;</div>

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

        <!-- Buttons as Cards -->
        <div class="card-container">
            <div class="card action-card" @click="navigateTo('wrong')">
                <h3>錯題複習</h3>
                <p>Review your incorrect answers to improve!</p>
            </div>
            <div class="card action-card" @click="goToCreateCard">
                <h3>主題單字</h3>
                <p>Explore new words and themes to learn.</p>
            </div>
            <div class="card action-card" @click="navigateTo('randomcard')">
                <h3>字卡測驗</h3>
                <p>Test your vocabulary knowledge with flashcards.</p>
            </div>
        </div>
    </div>
</template>

<script>
import { usePetStore } from "../stores/petStore";

export default {
    setup() {
        const petStore = usePetStore();
        return {
            petStore,
        };
    },
    data() {
        return {
            // Comment out login-related data
            /*
            user: null,
            showLoginModal: true,
            loginUsername: "",
            loginPassword: "",
            */
            isClickGif: false,
            tasks: [
                { id: 1, description: "記起來5個字卡", status: "in progress" },
                { id: 2, description: "新增5個字卡", status: "in progress" },
                { id: 3, description: "點擊簽到", status: "in progress" },
            ],
            showBubble: false,
            floatingTexts: ["你超棒", "明日新星就是你", "又完成一個任務了", "加油加油", "你是最棒的"],
            floatingTextIndex: 0,
            showExperienceModal: false,
        };
    },
    computed: {
        selectedPet() {
            return this.petStore.selectedPet;
        },
        petName() {
            return this.selectedPet.name || "Fluffy";
        },
        petLevel() {
            return this.selectedPet.level || 1;
        },
        mainPetImage() {
            const petFileName = this.selectedPet.src.split("/").pop().split(".")[0];
            if (this.petStore.hasBrokenThrough && petFileName == "pet3") {
                return "pet/upgrade.gif";
            }
            return `pet/${petFileName}.gif`;
        },
        clickGifImage() {
            const petFileName = this.selectedPet.src.split("/").pop().split(".")[0];
            if (this.petStore.hasBrokenThrough && petFileName == "pet3") {
                return "pet/upgrade-click.gif";
            }
            return `pet/${petFileName}-click.gif`;
        },
    },
    methods: {
        // Comment out login-related methods
        /*
        handleLogin() {
            if (this.loginUsername && this.loginPassword) {
                const mockUser = {
                    username: this.loginUsername,
                    password: this.loginPassword,
                };
                localStorage.setItem("user", JSON.stringify(mockUser));
                this.user = mockUser;
                this.showLoginModal = false;
            } else {
                alert("Please enter valid credentials.");
            }
        },
        loadUserData() {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                this.user = JSON.parse(storedUser);
                this.showLoginModal = false;
            } else {
                this.user = null;
                this.showLoginModal = true;
            }
        },
        */
        showClickGif() {
            this.isClickGif = true; // 點擊時設為 true
            setTimeout(() => {
                this.isClickGif = false; // 兩秒後改回 false
            }, 2000); // 延遲 2 秒（2000 毫秒）
        },
        navigateTo(page) {
            this.$router.push({ name: page });
        },
        goToCreateCard() {
            this.$router.push('/cardByTopic');
        },
        acceptTask(task) {
            task.status = "in progress";
        },
        completeTask(task) {
            if (task.id == 1) {
                this.$router.push("/learn");
            }
            else if (task.id == 2) {
                this.$router.push("/card");
            }
            else {
                task.status = "completed";
                this.petStore.addExperience(20);
                this.showExperienceModal = true;
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
        },
        closeExperienceModal() {
            this.showExperienceModal = false;
        },
    },
};
</script>


<style scoped>
#main-page {
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 300px;
    text-align: center;
}

.modal h2 {
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
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
        width: 300px;
        height: 300px;
    }

    .card {
        padding: 15px;
    }

    .task-status li {
        font-size: 14px;
    }

    #main-page {
        padding-top: 100px;
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

.close-button {
    margin-left: 0;
}

.button-container {
    display: flex;
    justify-content: space-between;
    width: 90%;
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
}

.create-card-button,
.continue-button {
    padding: 8px 12px;
    background-color: #ff5349;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    min-width: 120px;
}

.create-card-button:hover,
.continue-button:hover {
    background-color: #ff5349;
}

@media only screen and (max-width: 600px) {
    .button-container {
        flex-direction: column;
        gap: 10px;
        align-items: center;
    }

    .create-card-button,
    .continue-button {
        width: 100%;
        max-width: 300px;
    }
}

@media only screen and (min-width: 1024px) {
    #main-page {
        padding-top: 150px;
    }

    .card-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        /* 每行三個卡片 */
        gap: 30px;
        /* 增加卡片間距 */
        margin-top: 20px;
        width: 100%;
        max-width: 1200px;
        /* 最大寬度限制 */
    }

    .card.action-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #ff6f61, #ff9671);
        border-radius: 15px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        padding: 30px;
        text-align: center;
        color: white;
    }

    .card.action-card:hover {
        transform: translateY(-5px);
        /* 懸停時微微上移 */
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        /* 增強陰影 */
        background: linear-gradient(135deg, #ff9671, #ff6f61);
    }

    .card.action-card h3 {
        font-size: 22px;
        margin-bottom: 10px;
    }

    .card.action-card p {
        font-size: 16px;
        line-height: 1.5;
    }
}
</style>
