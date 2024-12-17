<template>
    <div class="wrapper">
        <!-- 標題區 -->
        <div class="header">
            <div class="title">學習選單</div>
        </div>

        <!-- 卡片區 -->
        <div class="card-container">
            <div class="card" @click="navigateTo('AllCards')">
                <div class="card-content">
                    <h3>查看字卡</h3>
                    <p>探索所有字卡，輕鬆進行複習。</p>
                </div>
            </div>
            <div class="card" @click="navigateTo('createMenu')">
                <div class="card-content">
                    <h3>創建字卡</h3>
                    <p>創建自己的學習字卡，按步驟完成。</p>
                </div>
            </div>
            <div class="card" @click="navigateTo('learn')">
                <div class="card-content">
                    <h3>立即學習</h3>
                    <p>進入學習模式，快速提升知識。</p>
                </div>
            </div>
            <div class="card" @click="navigateTo('testmenu')">
                <div class="card-content">
                    <h3>自我測驗</h3>
                    <p>測試您的學習成果，挑戰自己！</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        navigateTo(page) {
            this.$router.push({ name: page });
        },
    },
};
</script>

<style scoped>
/* 整體頁面設計 */
.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    min-height: 100vh;
    background-color: #f9f9f9;
    /* 背景灰白色 */
}

/* 標題區 */
.header {
    margin-bottom: 40px;
    text-align: center;
}

.title {
    font-size: 48px;
    font-weight: bold;
    color: #333;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
}

/* 卡片區 */
.card-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* 2x2布局 */
    gap: 20px;
    /* 卡片之間的間距 */
    width: 100%;
    max-width: 900px;
    /* 最大寬度 */
}

/* 卡片設計 */
.card {
    background: linear-gradient(135deg, #ff6f61, #ff9671);
    /* 漸層背景 */
    border-radius: 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    padding: 30px;
    color: white;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-8px);
    /* 懸停時上移 */
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
    /* 加強陰影 */
}

.card-content h3 {
    margin: 0 0 10px;
    font-size: 24px;
    font-weight: bold;
}

.card-content p {
    font-size: 16px;
    line-height: 1.4;
    opacity: 0.9;
}

/* 響應式設計 */
@media only screen and (max-width: 768px) {
    .card-container {
        grid-template-columns: 1fr;
        /* 小螢幕改成單列 */
        gap: 15px;
    }

    .title {
        font-size: 36px;
    }

    .card-content h3 {
        font-size: 20px;
    }

    .card-content p {
        font-size: 14px;
    }
}
</style>