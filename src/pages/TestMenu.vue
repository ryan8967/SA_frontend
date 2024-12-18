<template>
  <div class="wrapper">
    <!-- 標題區 -->
    <div class="header">
      <div class="title">測驗選單</div>
    </div>

    <!-- 卡片區 -->
    <div class="card-container">
      <div class="card" @click="navigateTo('wrong')">
        <div class="card-content">
          <h3>錯題複習</h3>
          <p>回顧過去的錯題，加深印象。</p>
        </div>
      </div>
      <div class="card" @click="navigateTo('CardByTopic')">
        <div class="card-content">
          <h3>主題測驗</h3>
          <p>針對特定主題進行測驗，掌握重點。</p>
        </div>
      </div>
      <div class="card" @click="navigateTo('randomcard')">
        <div class="card-content">
          <h3>字卡測驗</h3>
          <p>隨機挑選字卡，測驗記憶效果。</p>
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
/* 整體頁面樣式 */
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f5f5;
  /* 柔和背景色 */
}

/* 標題樣式 */
.header {
  margin-bottom: 40px;
  text-align: center;
}

.title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.1);
}

/* 卡片區樣式 */
.card-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  /* 2x2 排列 */
  gap: 20px;
  width: 100%;
  max-width: 800px;
}

/* 卡片樣式 */
.card {
  background: linear-gradient(135deg, #ff6f61, #ff9671);
  /* 柔和漸層色 */
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.card-content h3 {
  margin: 0 0 10px;
  font-size: 20px;
  font-weight: bold;
}

.card-content p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

/* 響應式設計 */
@media screen and (max-width: 768px) {
  .card-container {
    grid-template-columns: 1fr;
    /* 單列佈局 */
  }

  .title {
    font-size: 28px;
  }

  .card-content h3 {
    font-size: 18px;
  }

  .card-content p {
    font-size: 12px;
  }
}
</style>
