<template>
    <nav class="nav-bar">
        <div class="nav-item coins">
            <font-awesome-icon :icon="['fas', 'coins']" class="icon" />{{ virtualCoins }}
            <div ref="addCoinAnime" class="add-coin-anime">+ {{ addCoinAmount }}</div>
        </div>
        <div class="nav-item diamonds">
            <font-awesome-icon :icon="['fas', 'gem']" class="icon" /> {{ diamonds }}
            <div ref="addDimondAnime" class="add-dimond-anime">+ {{ addDimondAmount }}</div>
        </div> <!-- 顯示鑽石 -->
        <div class="nav-item username">
            Hi, {{ user ? user.displayName : 'Guest' }}
        </div>
        <button class="logout-btn" @click="handleLogout" v-if="user">Logout</button>
    </nav>
</template>

<script>
import { useUserStore } from "@/stores/userStore";
import { computed, ref, watch, onMounted, nextTick  } from 'vue'; // 引入 computed
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"; // 引入 FontAwesomeIcon
import gsap from 'gsap'; // 引入 gsap
export default {
    components: {
        FontAwesomeIcon, // 註冊 FontAwesomeIcon 組件
    },
  
    setup() {
        const userStore = useUserStore();
        const addCoinAnime = ref(null);
        const addCoinAmount = ref(0); // 新增金幣數量
        const addDimondAnime = ref(null);
        const addDimondAmount = ref(0); // 新增金幣數量

        // 使用 computed 讓數據變成響應式
        const user = computed(() => userStore.user);
        const virtualCoins = computed(() => userStore.virtualCoins);
        const diamonds = computed(() => userStore.diamonds); // 新增對鑽石的計算

        const handleLogout = () => {
            userStore.logout();
        };

        // 動畫效果
        const triggerCoinAnimation = () => {
            if (!addCoinAnime.value) return;
            addCoinAnime.value.style.display = 'block';
            gsap.fromTo(
            addCoinAnime.value,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power1.out" }
            );

            // 隱藏動畫效果
            gsap.to(addCoinAnime.value, {
                opacity: 0,
                delay: 1,
                duration: 0.5,
                ease: "power1.in",
                onComplete: () => {
                    // 在動畫完成後將元素隱藏
                    if (addCoinAnime.value) {
                        addCoinAnime.value.style.display = 'none';
                    }
        
                }
            });
        };

        // 動畫效果
        const triggerDimondAnimation = () => {
            if (!addDimondAnime.value) return;
            addDimondAnime.value.style.display = 'block';
            gsap.fromTo(
                addDimondAnime.value,
                    { opacity: 0, y: -20 },
                    { opacity: 1, y: 0, duration: 0.5, ease: "power1.out" }
            );

            // 隱藏動畫效果
            gsap.to(addDimondAnime.value, {
                opacity: 0,
                delay: 1,
                duration: 0.5,
                ease: "power1.in",
                onComplete: () => {
                    // 在動畫完成後將元素隱藏
                    if (addDimondAnime.value) {
                        addDimondAnime.value.style.display = 'none';
                    }
        
                }
            });
        };

        // 監聽 virtualCoins 變化，觸發動畫
        watch(virtualCoins, (newVal, oldVal) => {
            if (newVal > oldVal) {
                console.log('newVal', newVal);
                addCoinAmount.value = newVal - oldVal;
                triggerCoinAnimation();
            }
        });
        watch(diamonds, (newVal, oldVal) => {
            if (newVal > oldVal) {
                console.log('newVal', newVal);
                addDimondAmount.value = newVal - oldVal;
                triggerDimondAnimation();
            }
        });

        // 初始時隱藏動畫元素
        onMounted(async () => {
            await nextTick();
            if (addCoinAnime.value) {
                addCoinAnime.value.style.display = 'none';
            }
            if (addDimondAnime.value) {
                addDimondAnime.value.style.display = 'none';
            }
        });

        return {
            user,
            virtualCoins,
            diamonds, // 返回鑽石數據
            handleLogout,
            addCoinAnime,
            addCoinAmount,
            addDimondAnime,
            addDimondAmount
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
    display: flex;
    align-items: center;
    /* 將文字和 icon 垂直對齊 */
}

.coins {
    flex: 1;
    text-align: left;
}

.diamonds {
    flex: 1;
    text-align: left;
}

.add-coin-anime {

  color: yellow;
  font-weight: bold;
  font-size: 14px;
  padding-left: 5%;
  pointer-events: none;
  opacity: 0; /* 初始狀態隱藏 */
}

.add-dimond-anime {

    color: rgb(45, 148, 228);
    font-weight: bold;
    font-size: 14px;
    padding-left: 5%;
    pointer-events: none;
    opacity: 0; /* 初始狀態隱藏 */
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

.icon {
    margin-right: 8px;
    /* 調整 icon 與文字之間的間距 */
    font-size: 20px;
    /* 調整 icon 大小 */
}

</style>