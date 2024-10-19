<template>
    <div class="pet-page">
        <!-- 上半部 - 寵物特寫與資訊 -->
        <div class="pet-feature" @click="showClickGif">
            <div class="pet-info">
                <!-- 用於顯示原始 GIF -->
                <transition name="fade" mode="out-in">
                    <img :src="mainPetImage" alt="Main Pet" class="main-pet overlay" v-if="!isClickGif" />
                </transition>

                <!-- 顯示 -click.gif，過渡效果 -->
                <transition name="fade" mode="out-in">
                    <img v-if="isClickGif" :src="clickGifImage" alt="Clicked Pet" class="main-pet overlay" />
                </transition>

                <!-- 寵物等級與名稱 -->
                <div class="pet-details">
                    <p class="pet-level">Level: {{ petLevel }}</p>
                    <p class="pet-name">Name: {{ petName }}</p>
                </div>
                <div class="spann">

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
export default {
    data() {
        return {
            petLevel: 1, // 寵物等級，初始為 1
            petName: 'Fluffy', // 假設初始寵物名稱
            mainPet: { src: 'pet/pet3.png', owned: true }, // 主寵物，初始為 pet3
            isClickGif: false, // 控制是否顯示 -click.gif
            petCollection: [
                { src: 'pet/pet3.png', owned: true }, // 預設已擁有 pet3
                { src: 'pet/pet5.png', owned: true }, // 預設已擁有 pet5
                { src: 'pet/pet1.png', owned: false }, // 未擁有寵物
                { src: 'pet/pet2.png', owned: false }, // 未擁有寵物
                { src: 'pet/pet4.png', owned: false }, // 未擁有寵物
                { src: 'pet/pet6.png', owned: false }, // 新增的 pet6，未擁有
            ], // 預設圖鑑中的寵物頭像
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
    methods: {
        // 當用戶點擊上方主寵物區域，顯示 -click.gif，並在數秒後恢復正常 gif
        showClickGif() {
            if (this.mainPet.src.includes('pet3') || this.mainPet.src.includes('pet5')) {
                this.isClickGif = true;
                setTimeout(() => {
                    this.isClickGif = false; // 恢復正常的 gif
                }, 1500); // 顯示 -click.gif 1.5秒後恢復
            }
        },
        // 選擇新的主寵物並更新圖片
        selectPet(index) {
            if (this.petCollection[index].owned) { // 只有擁有的寵物才能被選中
                this.mainPet = { ...this.petCollection[index] }; // 設置主寵物為選中的寵物
            }
        },
    },
};
</script>

<style scoped>
.spann {
    height: 350px;
    padding-bottom: 150px;
}

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
    height: 350px;
    padding-bottom: 150px;
    /* 給上半區明確的高度，保證居中對齊 */
}

.main-pet,
.overlay {
    width: 250px;
    height: 250px;
    object-fit: cover;
    position: absolute;
    top: 50%;
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
    /* 保證在圖片的下方 */
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    background-color: rgba(255, 255, 255, 0.8);
    /* 半透明背景以提升可讀性 */
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
