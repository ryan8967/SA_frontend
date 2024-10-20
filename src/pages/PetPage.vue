<template>
    <div class="pet-page">
        <!-- 上半部 - 寵物特寫與資訊 -->
        <div class="pet-feature" @click="handlePetClick">
            <div class="pet-info">
                <!-- 用於顯示原始 GIF -->
                <transition name="fade" mode="out-in">
                    <img :src="mainPetImage" alt="Main Pet" class="main-pet overlay" v-if="!isClickGif" />
                </transition>

                <!-- 顯示 -click.gif，過渡效果 -->
                <transition name="fade" mode="out-in">
                    <img v-if="isClickGif" :src="clickGifImage" alt="Clicked Pet" class="main-pet overlay" />
                </transition>

                <!-- 寵物等級、名稱、經驗值條 -->
                <div class="pet-details">
                    <p class="pet-level">Level: {{ selectedPet.level }}</p>
                    <p class="pet-name">Name: {{ petName }}</p>

                    <!-- 經驗值進度條 -->
                    <div class="exp-bar">
                        <div class="exp-fill" :style="{ width: experiencePercentage + '%' }"></div>
                    </div>
                    <p class="experience-text">{{ selectedPet.currentExperience }} / {{ selectedPet.experienceNeeded }}
                        XP</p>
                </div>
            </div>
        </div>

        <!-- 下半部 - 圖鑑，顯示多個寵物頭像 -->
        <div class="pet-gallery">
            <h2>Pet Collection</h2>
            <div class="pet-thumbnails">
                <img v-for="(pet, index) in petStore.petCollection" :key="index" :src="pet.src"
                    :alt="`Pet ${index + 1}`" :class="{ 'pet-thumbnail': true, 'unowned': !pet.owned }"
                    @click="selectPet(index)" />
            </div>
        </div>

        <!-- 寵物初始化按鈕 -->
        <button class="initialize-button" @click="initializeDefaultPets">
            寵物初始化
        </button>
    </div>
</template>

<script>
import { ref, update, onValue } from 'firebase/database';
import { database } from '../firebase';
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
            petName: 'Fluffy',
            mainPet: { src: 'pet/pet3.png', owned: true },
            isClickGif: false,
            selectedPetIndex: 0, // 追蹤選中的寵物索引
        };
    },
    computed: {
        // 從 petStore 中取得選中的寵物
        selectedPet() {
            return this.petStore.selectedPet;
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
                return 'pet/upgrade-click.gif'; // 突破後的主圖片
            }
            return `pet/${petFileName}-click.gif`;
        },
        experiencePercentage() {
            return (this.selectedPet.currentExperience / this.selectedPet.experienceNeeded) * 100;
        }
    },
    methods: {
        handlePetClick() {
            this.isClickGif = true;
            this.petStore.addExperience(1); // 增加當前選中寵物的經驗值
            setTimeout(() => {
                this.isClickGif = false;
            }, 1500);
        },
        selectPet(index) {
            this.petStore.selectPet(index); // 更新選中的寵物
        },
        updatePetData() {
            const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).uid : null;
            if (userId) {
                const userRef = ref(database, `users/${userId}/pets`);
                update(userRef, {
                    petCollection: this.petStore.petCollection, // 同步整個寵物集合到 Firebase
                });
            }
        },
        initializeDefaultPets() {
            // 預設的寵物數據初始化
            const defaultPetCollection = [
                { src: 'pet/pet3.png', owned: true, level: 1, currentExperience: 0, experienceNeeded: 100 },
                { src: 'pet/pet5.png', owned: true, level: 1, currentExperience: 0, experienceNeeded: 100 },
                { src: 'pet/pet1.png', owned: false, level: 1, currentExperience: 0, experienceNeeded: 100 },
                { src: 'pet/pet2.png', owned: false, level: 1, currentExperience: 0, experienceNeeded: 100 },
                { src: 'pet/pet4.png', owned: false, level: 1, currentExperience: 0, experienceNeeded: 100 },
                { src: 'pet/pet6.png', owned: false, level: 1, currentExperience: 0, experienceNeeded: 100 },
            ];

            // 更新 petStore 的寵物數據
            this.petStore.updatePetCollection(defaultPetCollection);
            this.petStore.selectPet(0); // 預設選擇第一隻寵物

            // 同步初始化數據到 Firebase
            this.updatePetData();
        }
    },
    mounted() {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userId = JSON.parse(storedUser).uid;
            const userRef = ref(database, `users/${userId}/pets`);
            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                if (data && data.petCollection) {
                    this.petStore.updatePetCollection(data.petCollection);
                }
            });
        }
    },
};
</script>


<style scoped>
/* 經驗值條樣式 */
.exp-bar {
    width: 100%;
    height: 20px;
    background-color: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 10px;
}

.exp-fill {
    height: 100%;
    background-color: #2c3e50;
    border-radius: 10px;
    transition: width 0.3s ease;
}

.experience-text {
    margin-top: 5px;
    font-size: 14px;
    color: #2c3e50;
}

/* 其他樣式保持不變 */
.pet-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    margin-top: 50px;
}

.pet-feature {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    border-radius: 15px;
    padding: 20px;
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    height: 500px;
}

.main-pet,
.overlay {
    width: 250px;
    height: 250px;
    object-fit: cover;
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: opacity 0.5s ease-in-out;
    z-index: 1;
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
    bottom: 20px;
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

.pet-gallery {
    margin-top: 20px;
    width: 100%;
}

.pet-thumbnails {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}

.pet-thumbnail {
    width: 100%;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    object-fit: cover;
    cursor: pointer;
}

.pet-thumbnail.unowned {
    filter: grayscale(100%);
    cursor: not-allowed;
}

.pet-thumbnail:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease;
}

.initialize-button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: white;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 50px;
}

.initialize-button:hover {
    background-color: white;
}
</style>
