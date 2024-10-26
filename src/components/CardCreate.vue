<template>
    <div class="word-card" v-if="show">
      <div class="word-card__header">
        <h2 class="word-card__title">建立字卡</h2>
        <button class="word-card__close" @click="closeCard">
            <strong>X</strong>
        </button>
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
          <h3>{{ wordData.word }}</h3>
          <p><strong>詞性：</strong>{{ wordData.partOfSpeech }}</p>
          <p><strong>中文翻譯：</strong>{{ wordData.translation }}</p>
          <p><strong>例句：</strong>{{ wordData.exampleSentence }}</p>
        </div>
      </div>
    </div>
</template>
  
<script>
import OpenAI from "openai";

export default {
    data() {
      return {
        inputWord: "", // 用戶輸入的英文單字
        wordData: null, // 單字資料
        show: true,
      };
    },
    computed: {
        empty() {
            return !this.inputWord;
        },
    },
    methods: {
        closeCard() {
            this.wordData = null; // 清除單字資料
            this.show = false;
        },
        async getCardFromGPT() {
            console.log("getCardFromGPT");
            // console.log("this.inputWord", this.inputWord);
            // let a = 2;
            // if(2==a){
            //     return;
            // }
            // const storedUser = localStorage.getItem('user');
            // if (storedUser) {
            //     this.user = JSON.parse(storedUser);

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
                You can ignore the imgUrl, just fill with empty string.`
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
                }
            } else {
                console.log(run.status);
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
  </style>
  
 
