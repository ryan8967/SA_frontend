<template>
    <nav class="bottom-bar">
        <button class="nav-item" @click="navigateTo('Pet')">
            <font-awesome-icon :icon="['fas', 'paw']" class="icon" />
        </button>

        <button class="nav-item" @click="navigateTo('Test2')">
            <font-awesome-icon :icon="['fas', 'tasks']" class="icon" />
        </button>

        <!-- 中間圖標換成 tsmc.png -->
        <button class="nav-item home-btn" @click="navigateTo('Main')">
            <!-- <div class="home-icon">
                <img src="tsmc.png" alt="Home" class="tsmc-icon" />
            </div> -->
            <font-awesome-icon :icon="['fas', 'home']" class="icon" />
        </button>

        <button class="nav-item" @click="navigateTo('Shop')">
            <font-awesome-icon :icon="['fas', 'store']" class="icon" />
        </button>

        <button class="nav-item" @click="navigateTo('test')">
            <font-awesome-icon :icon="['fas', 'book']" class="icon" />
        </button>
    </nav>
</template>

<script>
export default {
    methods: {
        navigateTo(page) {
            this.$router.push({ name: page });
        }
    }
};
</script>

<style scoped>
.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background-color: #2c3e50;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 1000;
}

.nav-item {
    display: flex;
    align-items: center;
    color: white;
    border: none;
    background: none;
    cursor: pointer;
    transition: color 0.3s ease;
}

.nav-item:hover {
    color: #ff5349;
}

.icon {
    font-size: 32px;
    /* 調整圖標大小 */
}

.home-btn {
    position: relative;
    bottom: 10px;
}

.home-icon {

    border-radius: 50%;

    color: white;
    font-size: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 新增 tsmc 圖片樣式 */
.tsmc-icon {
    width: 80px;
    height: 63px;
    object-fit: cover;
    scale: 1.3;
}

.nav-item:hover .icon {
    transform: scale(1.5);
    transition: transform 0.02s ease;
}

.nav-item:active .icon {
    transform: scale(0.8);
    transition: transform 0.1s ease;
}
</style>
