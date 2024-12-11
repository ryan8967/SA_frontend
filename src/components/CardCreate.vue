<template>
  <div class="card-block">
    <button @click="showScreen" v-if="!show">Add Card</button>
    <div class="word-card" v-if="show">
      <div class="word-card__header">
        <h2 class="word-card__title">建立字卡</h2>
        <button class="word-card__close" @click="closeAddCard"><strong>X</strong></button>
      </div>
      <div class="word-card__content" style="justify-content: left;">
        <input style="display: flex;" type="text" class="word-card__input" placeholder="輸入英文單字" v-model="inputWord" />
        <div class="submit-block" style="display: flex;">
          <button class="word-card__button" :disabled="empty" @click="getCardFromGPT">查詢單字</button>
          <span v-if="empty" style="display: flex; color: gray; margin-top: 10px;margin-left: 5vh;">* type in the word
            first</span>
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

export default {
  data() {
    return {
      inputWord: "", // 用戶輸入的英文單字
      wordData: null, // 單字資料
      show: true, // whether to show the add-card component
      showLoading: false, // show loading icon when fetching word data
    };
  },
  computed: {
    empty() {
      return !this.inputWord;
    },
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
                Don't use markdown simbol in your answer.`;
      let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: "asst_8GkyxwRkgLuvSkUcvhkFIFKT",
        instructions: prompt
      });

      if (run.status === "completed") {
        const messages = await openai.beta.threads.messages.list(run.thread_id);
        for (const message of messages.data.reverse()) {
          let mes = message.content[0].text.value;
          console.log("mes", mes);

          this.wordData = JSON.parse(mes);
        }
      } else {
        console.log(run.status);
      }

      this.showLoading = false;
    },
  },
};
</script>

<style scoped>
/* 保持原有樣式不變 */
</style>
