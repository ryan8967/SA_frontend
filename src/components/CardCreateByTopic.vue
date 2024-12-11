<template>
    <div class="card-block">
      <button @click="showScreen" v-if="!show">Add Card</button>
      <div class="word-card" v-if="show">
        <div class="word-card__header">
          <h2 class="word-card__title">建立主題式字卡</h2>
          <button class="word-card__close" @click="closeAddCard">
            <strong>X</strong>
          </button>
        </div>
        <div class="word-card__content" style="justify-content: left">
          <input style="display: flex" type="text" class="word-card__input" placeholder="輸入主題" v-model="inputWord" />
          <!-- Input for number of words -->
          <input style="display: flex" type="number" class="word-card__input" placeholder="輸入單字數量"
            v-model.number="wordCount" min="1" />
          <div class="submit-block" style="display: flex">
            <button class="word-card__button" :disabled="empty" @click="getCardFromGPT">
              取得單字
            </button>
            <span v-if="empty" style="
                display: flex;
                color: gray;
                margin-top: 10px;
                margin-left: 5vh;
              ">* type in the word first</span>
          </div>
          <div v-if="wordData && wordData.length" class="word-card__result">
            <button class="word-card__close" @click="closeCard">
              <strong>X</strong>
            </button>
            <div v-for="(word, index) in wordData" :key="index" class="word-card__item">
              <h3>{{ word.word }}</h3>
              <p><strong>詞性：</strong>{{ word.partOfSpeech }}</p>
              <p><strong>中文翻譯：</strong>{{ word.translation }}</p>
              <p><strong>例句：</strong>{{ word.exampleSentence }}</p>
              <hr />
            </div>
          </div>
        </div>
      </div>
      <!-- show loading icon -->
      <div v-if="showLoading" class="loading-modal">
        <div class="loading-content">
          <p>Loading...</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import OpenAI from "openai";
  import { ref, set } from "firebase/database";
  import { database } from "../firebase"; // 引入 Firebase Realtime Database
  
  export default {
    data() {
      return {
        inputWord: "", // 用戶輸入的英文單字
        wordCount: 1,
        wordData: null, // 單字資料
        show: true, // whether to show the add-card component
        showLoading: false, // show loading icon when fetching word data
        userId: null,
      };
    },
    computed: {
      empty() {
        return !this.inputWord || this.wordCount <= 0;
      },
    },
    mounted() {
      // Skip UID retrieval for debugging
      this.userId = JSON.parse(localStorage.getItem("user")).uid;
      // You can set a temporary userId for testing
      //this.userId = 'testUserId'; // Use a test ID or hard-code a value for debugging
    },
    methods: {
      showScreen() {
        this.show = !this.show;
      },
      closeAddCard() {
        this.show = false;
      },
      closeCard() {
        this.wordData = null; // 清除單字資料
      },
      async getCardFromGPT() {
        console.log("getCardFromGPT");
        this.showLoading = true;
        // loading test
  
        // await sleep(2000);
        // this.showLoading = false;
        // let a = 2;
        // if (a === 2) {
        //     return;
        // }
        let kkk =
        "c2stcHJvai15cUFsY3JwS1JEMWlkLWU4MHFBSzRHUmRVckYwYlZNemtXSEZNeVFBZ1JCeHBRNm9fZlowY29OeW5xVDNCbGJrRkpnMkFpVVoycjNPb0trYm5QSmlkSm5xTUloMFBmRXg2a2pCcHFkdGVmaGhlbVduNEhhSGZjWkowSGNB";
      const decodedStr = atob(kkk);
  
        const openai = new OpenAI({
          apiKey: decodedStr,
          dangerouslyAllowBrowser: true,
        });
  
        const prompt = `You are an English teacher to help the user understand an English word.
          Here is the given topic: "${this.inputWord}". Generate ${this.wordCount} words related to this topic. Please answer with a JSON format string as follows:
          {"word":"", "translation":"", "exampleSentence": "", "partOfSpeech": "", "imgUrl":""}
          word: the word itself.
          translation: Traditional Chinese of the word.
          exampleSentence: a sample sentence including the word to show the user how to use the word.
          partOfSpeech: the meaning of the attribute name.
          You can ignore the imgUrl, just fill with an empty string.
          Don't use markdown symbols in your answer.`;
  
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-4", // Use your desired model (GPT-4, GPT-3.5, etc.)
            messages: [
              { role: "system", content: "You are a helpful English teacher." },
              { role: "user", content: prompt },
            ],
          });
  
          const message = response.choices[0].message.content;
          console.log("Response from GPT:", message);
  
          this.storeWordData(message);
        } catch (error) {
          console.error("Error interacting with OpenAI:", error);
          this.showLoading = false;
        }
      },
      storeWordData(mes) {
        try {
          const wordDataArray = JSON.parse(mes);
  
          wordDataArray.forEach((wordData) => {
            const cardRef = ref(database, `users/${this.userId}/wordCards/${wordData.word}`);
            set(cardRef, wordData).catch((error) =>
              console.error("Error storing data: ", error)
            );
          });
  
          console.log("Cards stored successfully!");
          this.wordData = wordDataArray;
        } catch (error) {
          console.error("Error parsing or storing word data: ", error);
        } finally {
          this.showLoading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .word-card {
    border: 1px solid #ddd;
    padding: 20px;
    width: 300px;
    background-color: #f9f9f9;
    border-radius: 5px;
  }
  
  .word-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .word-card__input,
  .word-card__button {
    margin-top: 10px;
  }
  
  .word-card__close {
    width: 30px;
    height: 30px;
    border: none;
    background-color: transparent;
    color: black;
    font-size: larger;
  }
  
  .word-card__result {
    margin-top: 15px;
    border-top: 1px solid #ddd;
    padding-top: 10px;
  }
  
  .loading-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .loading-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
  }
  </style>
  