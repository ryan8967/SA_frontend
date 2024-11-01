<template>
  <div class="card-block">
    <button @click="showScreen" v-if="!show">Add Card</button>
    <div class="word-card" v-if="show">
      <div class="word-card__header">
        <h2 class="word-card__title">建立字卡</h2>
        <button class="word-card__close" @click="closeAddCard"><strong>X</strong></button>
      </div>
      <div class="word-card__content" style="justify-content: left;">
        <input style="display: flex;"
          type="text"
          class="word-card__input"
          placeholder="輸入英文單字"
          v-model="inputWord"
        />
        <div class="submit-block" style="display: flex;">
            <button class="word-card__button" :disabled="empty" @click="getCardFromGPT">查詢單字</button>
            <span v-if="empty" style="display: flex; color: gray; margin-top: 10px;margin-left: 5vh;">* type in the word first</span>
        </div>
        <div v-if="wordData" class="word-card__result">
            <button class="word-card__close" @click="closeCard"><strong>X</strong></button>
            <h3>{{ wordData.word }}</h3>
            <p><strong>詞性：</strong>{{ wordData.partOfSpeech }}</p>
            <p><strong>中文翻譯：</strong>{{ wordData.translation }}</p>
            <p><strong>例句：</strong>{{ wordData.exampleSentence }}</p>
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
        wordData: null, // 單字資料
        show: true, // whether to show the add-card component
        showLoading: false, // show loading icon when fetching word data
        userId: null,
      };
    },
    computed: {
        empty() {
            return !this.inputWord;
        },
    },
    mounted() {
        // Skip UID retrieval for debugging
        //this.userId = JSON.parse(localStorage.getItem("user")).uid;
        // You can set a temporary userId for testing
        this.userId = 'testUserId'; // Use a test ID or hard-code a value for debugging
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
                "c2stM1VhNDUwUHhhdjNnVVNNLUNmSHVTQ25ySUI3YUZGZjU1d0RRaE92SEZSVDNCbGJrRkowUkVpazRGWmN3QnIwZXIyX2xUU1BsbWV5dFZzQWpnYmpNS1puLVRfNEE=";
            const decodedStr = atob(kkk);

            const openai = new OpenAI({
                apiKey: decodedStr,
                dangerouslyAllowBrowser: true,
            });

            const thread = await openai.beta.threads.create();

            console.log("loading GPT");
            let prompt = `You are a English teacher to help user understanding a English word.
                Here is the given word: "${this.inputWord}". Please Answer with a JSON fromat string as following:
                {"word":"", "translation":"", "exampleSentence": "", "partOfSpeech": "", imgUrl:"" }
                word: the word itself.
                translation: Traditional Chinese of the word.
                exampleSentence: a sample sentence including the word to show user how use the word.
                partOfSpeecch: as the meaning of the attribute name
                You can ignore the imgUrl, just fill with empty string.
                Don't use markdown simbol in your answer.`
            let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
                assistant_id: "asst_8GkyxwRkgLuvSkUcvhkFIFKT",
                instructions: prompt
            });

            if (run.status === "completed") {

                const messages = await openai.beta.threads.messages.list(run.thread_id);
                for (const message of messages.data.reverse()) {
                    // console.log(`${message.role} > ${message.content[0].text.value}`);
                    let mes = message.content[0].text.value;
                    console.log("mes", mes);

                    // do store the word data
                    this.storeWordData(mes);
                }
            } else {
                console.log(run.status);
            }

            this.showLoading = false;
        },
        storeWordData(mes) {
            let wordData = JSON.parse(mes);
            // store to user's word card collection
              // Generate your own unique ID (if needed)

            // Store to user's word card collection with your ID
            const cardRef = ref(database, `users/${this.userId}/wordCards/${wordData.word}`);
            set(cardRef, wordData)
                .then(() => {
                    console.log("Card stored successfully!");
                    this.wordData = wordData;
                })
                .catch((error) => {
                    console.error("Error storing data: ", error);
                });
            
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
  
 
