<template>
    <div class="title">Flashcards</div>
    <div class="flashcard-wrapper">
      <input v-model="userInput" placeholder="輸入單字" class="input-box" />

      <div class="flashcard">
        <div class="content" @click="flipCard">
          <p v-if="!flipped" class="question">{{ userInput || "Enter text above" }}</p>
          <p v-else class="answer">nooooo</p>
        </div>
      </div>
      
      <div class="controls">
        <button @click.stop="rateCard('good')">記起來了</button>
        <button @click.stop="rateCard('again')">再試一次</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        flipped: false,
        userInput: "",
      };
    },
    methods: {
      flipCard() {
        this.flipped = !this.flipped;
      },
      rateCard(rating) {
        this.$emit("rate", rating);
        this.flipped = false; 
      },
    },
  };
  </script>
  
  <style scoped>
    .title {
      padding-top: 500px;
      font-size: 45px;
      text-align: center;
    }
  
    .flashcard-wrapper {
      padding-top: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
  
    .flashcard {
      padding: 20px;
      border-radius: 12px;
      width: 600px;
      background-color: #ffffff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      margin-bottom: 20px;
      font-size: 30px;
    }
  
    .content {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      cursor: pointer;
    }
  
    .input-box {
      margin-bottom: 15px;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      width: 200px;
      box-sizing: border-box;
    }
  
    button:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }
  
    button {
      background-color: #ff6f61;
      padding: 15px 25px;
      border-radius: 10px;
      font-size: 15px;
      border: none;
      color: white;
      cursor: pointer;
    }
  
    .controls {
      display: flex;
      gap: 10px;
    }
  </style>
  