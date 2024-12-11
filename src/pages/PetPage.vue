<template>
    <div class="pet-page">
        <div class="pet-feature" @click="handlePetClick">
            <div class="pet-info">
                <transition name="fade" mode="out-in">
                    <img :src="mainPetImage" alt="Main Pet" class="main-pet overlay" v-if="!isClickGif" />
                </transition>
                <transition name="fade" mode="out-in">
                    <img v-if="isClickGif" :src="clickGifImage" alt="Clicked Pet" class="main-pet overlay" />
                </transition>
                <div class="pet-details">
                    <p class="pet-level">Level: {{ selectedPet.level }}</p>
                    <p class="pet-name">Name: {{ petName }}</p>
                    <div class="exp-bar">
                        <div class="exp-fill" :style="{ width: experiencePercentage + '%' }"></div>
                    </div>
                    <p class="experience-text">{{ selectedPet.currentExperience }} / {{ selectedPet.experienceNeeded }}
                        XP</p>
                </div>
            </div>
        </div>

        <div class="pet-gallery">
            <h2>Pet Collection</h2>
            <div class="pet-thumbnails">
                <img v-for="(pet, index) in petCollection" :key="index" :src="pet.src" :alt="`Pet ${index + 1}`"
                    :class="{ 'pet-thumbnail': true, 'unowned': !pet.owned }" @click="selectPet(index)" />
            </div>
        </div>

        <button class="initialize-button" @click="initializeDefaultPets">寵物初始化</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            petName: 'Fluffy',
            isClickGif: false,
            selectedPetIndex: 0,
            petCollection: [
                { src: 'pet/pet3.png', owned: true, level: 1, currentExperience: 0, experienceNeeded: 100 },
                { src: 'pet/pet5.png', owned: true, level: 1, currentExperience: 0, experienceNeeded: 100 },
                { src: 'pet/pet1.png', owned: false, level: 1, currentExperience: 0, experienceNeeded: 100 },
                { src: 'pet/pet2.png', owned: false, level: 1, currentExperience: 0, experienceNeeded: 100 },
                { src: 'pet/pet4.png', owned: false, level: 1, currentExperience: 0, experienceNeeded: 100 },
                { src: 'pet/pet6.png', owned: false, level: 1, currentExperience: 0, experienceNeeded: 100 },
            ], // 預設的寵物集合
        };
    },
    computed: {
        selectedPet() {
            return this.petCollection[this.selectedPetIndex] || {
                src: '',
                owned: false,
                level: 1,
                currentExperience: 0,
                experienceNeeded: 100,
            };
        },
        mainPetImage() {
            if (!this.selectedPet || !this.selectedPet.src) return '';
            const petFileName = this.selectedPet.src.split('/').pop().split('.')[0];
            return `pet/${petFileName}.gif`;
        },
        clickGifImage() {
            if (!this.selectedPet || !this.selectedPet.src) return '';
            const petFileName = this.selectedPet.src.split('/').pop().split('.')[0];
            return `pet/${petFileName}-click.gif`;
        },
        experiencePercentage() {
            if (!this.selectedPet || this.selectedPet.experienceNeeded === 0) return 0;
            return (this.selectedPet.currentExperience / this.selectedPet.experienceNeeded) * 100;
        },
    },
    methods: {
        handlePetClick() {
            this.isClickGif = true;
            this.addExperience(1);
            setTimeout(() => {
                this.isClickGif = false;
            }, 1500);
        },
        selectPet(index) {
            if (this.petCollection[index].owned) {
                this.selectedPetIndex = index;
            }
        },
        addExperience(amount) {
            const selectedPet = this.petCollection[this.selectedPetIndex];
            if (!selectedPet) return;
            selectedPet.currentExperience += amount;
            if (selectedPet.currentExperience >= selectedPet.experienceNeeded) {
                selectedPet.level += 1;
                selectedPet.currentExperience = 0;
                selectedPet.experienceNeeded += 50; // 每次升級經驗值需求增加
            }
        },
        initializeDefaultPets() {
            this.petCollection = [
                { src: 'pet/pet3.png', owned: true, level: 1, currentExperience: 0, experienceNeeded: 100 },
                { src: 'pet/pet5.png', owned: true, level: 1, currentExperience: 0, experienceNeeded: 100 },
                { src: 'pet/pet1.png', owned: false, level: 1, currentExperience: 0, experienceNeeded: 100 },
                { src: 'pet/pet2.png', owned: false, level: 1, currentExperience: 0, experienceNeeded: 100 },
                { src: 'pet/pet4.png', owned: false, level: 1, currentExperience: 0, experienceNeeded: 100 },
                { src: 'pet/pet6.png', owned: false, level: 1, currentExperience: 0, experienceNeeded: 100 },
            ];
            this.selectedPetIndex = 0;
        },
    },
    mounted() {
        this.initializeDefaultPets(); // 初始化時載入預設寵物集合
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

.pet-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    margin-top: 50px;
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

.pet-thumbnail.unowned {
    filter: grayscale(100%);
    cursor: not-allowed;
}
</style>
