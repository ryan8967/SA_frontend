<template>
    <div class="pet-page">
        <!-- 上半部 - 寵物特寫與資訊 -->
        <div class="pet-feature">
            <div class="pet-info">
                <!-- 根據主寵物類型動態顯示 gif 或 png -->
                <img :src="mainPetImage" alt="Main Pet" class="main-pet" />
                <div class="pet-details">
                    <p class="pet-level">Level: {{ petLevel }}</p>
                    <p class="pet-name">Name: {{ petName }}</p>
                </div>
            </div>
        </div>

        <!-- 下半部 - 圖鑑，顯示多個寵物頭像 -->
        <div class="pet-gallery">
            <h2>Pet Collection</h2>
            <div class="pet-thumbnails">
                <!-- 使用 v-for 顯示多個寵物頭像，已擁有的寵物能夠點擊 -->
                <img v-for="(pet, index) in petCollection" :key="index" :src="pet.src" :alt="`Pet ${index + 1}`"
                    :class="{ 'pet-thumbnail': true, 'unowned': !pet.owned }" @click="selectPet(index)" />
            </div>
        </div>

        <!-- 寵物初始化按鈕 -->
        <button class="initialize-button" @click="initializeDefaultPets">
            寵物初始化
        </button>
    </div>
</template>

<script>
import { ref, onValue, update, set } from 'firebase/database';
import { database } from '@/firebase'; // 引入已經初始化的 Firebase Realtime Database
import { useUserStore } from '@/stores/userStore';

export default {
    data() {
        return {
            petLevel: 1, // 寵物等級，初始為 1
            petName: 'Fluffy', // 假設初始寵物名稱
            mainPet: 'pet3', // 主寵物編號，預設為 pet3
            petCollection: [
                { src: 'pet/pet3.png', owned: true }, // 預設已擁有 pet3
                { src: 'pet/pet5.png', owned: true }, // 預設已擁有 pet5
                { src: 'pet/pet1.png', owned: false }, // 未擁有寵物
                { src: 'pet/pet2.png', owned: false }, // 未擁有寵物
                { src: 'pet/pet4.png', owned: false }, // 未擁有寵物
                { src: 'pet/pet6.png', owned: false }, // 新增的 pet6，未擁有
            ], // 預設圖鑑中的寵物頭像
            userId: null, // 使用者ID
        };
    },
    computed: {
        // 根據主寵物編號動態選擇顯示 gif 或 png
        mainPetImage() {
            if (this.mainPet === 'pet3' || this.mainPet === 'pet5') {
                return `pet/${this.mainPet}.gif`; // 若主寵物是 pet3 或 pet5，顯示 gif
            }
            return `pet/${this.mainPet}.png`; // 其他情況顯示 png
        },
    },
    mounted() {
        this.initializePetData();
    },
    methods: {
        initializePetData() {
            const userStore = useUserStore();
            const userId = userStore.user ? userStore.user.uid : null;
            this.userId = userId; // 保存使用者ID

            if (userId) {
                const userPetRef = ref(database, `users/${userId}/pets`);

                // 檢查 Firebase 中是否有該用戶的寵物數據
                onValue(userPetRef, (snapshot) => {
                    const data = snapshot.val();
                    if (!data) {
                        // 如果沒有數據，進行初始化
                        this.initializeDefaultPets();
                    } else {
                        // 如果有數據，更新寵物數據
                        this.petLevel = data.petLevel || 1;
                        this.petName = data.petName || 'Fluffy';
                        this.mainPet = data.mainPet || 'pet3';
                        this.updatePetCollection(data.pets);
                    }
                });
            }
        },
        initializeDefaultPets() {
            const defaultPets = [
                { src: 'pet/pet3.png', owned: true },
                { src: 'pet/pet5.png', owned: true },
                { src: 'pet/pet1.png', owned: false },
                { src: 'pet/pet2.png', owned: false },
                { src: 'pet/pet4.png', owned: false },
                { src: 'pet/pet6.png', owned: false }, // 添加 pet6
            ];

            // 初始化 Firebase 中的預設寵物數據
            const userPetRef = ref(database, `users/${this.userId}/pets`);
            set(userPetRef, {
                petLevel: this.petLevel,
                petName: this.petName,
                mainPet: this.mainPet,
                pets: defaultPets,
            });

            // 更新本地 petCollection 狀態
            this.petCollection = defaultPets;
        },
        updatePetCollection(userPets) {
            // 更新用戶的寵物圖鑑，從 Firebase 獲取數據
            const updatedCollection = this.petCollection.map((pet) => {
                const isOwned = userPets && userPets.some((userPet) => userPet.src === pet.src && userPet.owned === true);
                return { ...pet, owned: isOwned }; // 保持從 Firebase 獲得的擁有狀態
            });
            this.petCollection = updatedCollection;
        },
        savePetData() {
            const userStore = useUserStore();
            const userId = userStore.user ? userStore.user.uid : null;

            if (userId) {
                const userPetRef = ref(database, `users/${userId}/pets`);

                // 將當前的寵物數據保存到 Firebase
                update(userPetRef, {
                    petLevel: this.petLevel,
                    petName: this.petName,
                    mainPet: this.mainPet,
                    pets: this.petCollection,
                });
            }
        },
        // 選擇新的主寵物並更新圖片
        selectPet(index) {
            if (this.petCollection[index].owned) { // 只有擁有的寵物才能被選中
                const petFileName = this.petCollection[index].src.split('/').pop().split('.')[0]; // 提取圖片名稱
                this.mainPet = petFileName; // 設置主寵物為選中的寵物
                this.savePetData(); // 保存變更到 Firebase
            }
        },
    },
};
</script>

<style scoped>
.pet-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    padding-top: 80px;
    /* 上方增加空白以容納 NavBar */
}

.pet-feature {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f0f4f8;
    border-radius: 15px;
    padding: 20px;
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.main-pet {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
}

.pet-details {
    margin-top: 10px;
    text-align: center;
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
    /* 若未擁有，顯示為灰色 */
    cursor: not-allowed;
}

.pet-thumbnail:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease;
}

/* 初始化按鈕樣式 */
.initialize-button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 50px;
}

.initialize-button:hover {
    background-color: #2980b9;
}
</style>