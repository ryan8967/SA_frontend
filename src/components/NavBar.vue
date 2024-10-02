<template>
    <nav class="nav-bar">
        <div class="nav-item coins">Coins: {{ virtualCoins }}</div>
        <div class="nav-item username">Hi, {{ user ? user.displayName : 'Guest' }}</div>
        <button class="logout-btn" @click="handleLogout" v-if="user">Logout</button>
    </nav>
</template>

<script>
import { useUserStore } from "@/stores/userStore";
import { computed } from 'vue'; // 引入 computed

export default {
    setup() {
        const userStore = useUserStore();

        // 使用 computed 讓數據變成響應式
        const user = computed(() => userStore.user);
        const virtualCoins = computed(() => userStore.virtualCoins);

        const handleLogout = () => {
            userStore.logout();
        };

        return {
            user,
            virtualCoins,
            handleLogout,
        };
    },
};
</script>

<style scoped>
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
</style>
