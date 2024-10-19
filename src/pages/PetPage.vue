<template>
    <div class="pet-page">
        <!-- 上半部 - 寵物特寫與資訊 -->
        <div class="pet-feature">
            <div class="pet-info">
                <img src="pet/pet5.gif" alt="Main Pet" class="main-pet" />
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
                <!-- 使用 v-for 顯示多個寵物頭像 -->
                <img v-for="(pet, index) in pets" :key="index" :src="pet.src" :alt="`Pet ${index + 1}`"
                    class="pet-thumbnail" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            petLevel: 5, // 假設這是從store取得的等級，這裡先用靜態數據
            petName: 'Fluffy', // 假設這是從store取得的寵物名稱
            pets: [
                { src: 'pet/pet1.png' },
                { src: 'pet/pet2.png' },
                { src: 'pet/pet3.png' },
                { src: 'pet/pet4.png' },
                { src: 'pet/pet5.png' },
                { src: 'pet/pet6.png' }, // 重複使用圖片
                // { src: 'pet/pet2.png' }, // 重複使用圖片
                // { src: 'pet/pet3.png' }, // 重複使用圖片
                // { src: 'pet/pet4.png' }, // 重複使用圖片
                // { src: 'pet/pet5.png' }, // 重複使用圖片
            ],
        };
    },
};
</script>

<style scoped>
.pet-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    margin-top: 45vh;
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
    width: 250px;
    height: 250px;
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
    padding-bottom: 35vh;
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

.pet-thumbnail:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease;
}

@media (max-width: 600px) {
    .pet-feature {
        width: 90%;
    }
}
</style>
