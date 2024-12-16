<template>
    <div class="wrapper">
      <div class="header">
        <div class="title">自我測驗</div>
      </div>
        <button class="create-card-button" @click="navigateTo('wrong')">錯題複習</button>
        <button class="create-card-button" @click="navigateTo('CardByTopic')">主題測驗</button>
  
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
  .header {
    display: flex;                
    justify-content: space-between; 
    align-items: center;        
    padding: 10px;             
    margin-top: 150px;
    gap: 50px;
  }
  
  
  .title {
    font-size: 35px;
    text-align: center;
    margin-top: 4px;
  }
  
  .options {
    vertical-align: middle;
  }
  .wrapper {
    position: relative;
    padding-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
  }
  
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
  }
  
  button:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
  
  button {
    background-color: #ff6f61;
    padding: 10px 25px;
    border-radius: 10px;
    font-size: 15px;
    border: none;
    color: white;
    cursor: pointer;
  }
  
  .all-cards-button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 10px;
    background-color: #ff6f61;
    color: white;
    margin-top: 4px;
  }
  
  .create-card-button {
    padding: 10px 20px;
    margin-top: 10px;
  }
  
  
</style>