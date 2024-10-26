<template>
    <div class="word-card">
      <div class="word-card__header">
        <h2 class="word-card__title">建立字卡</h2>
        <button class="word-card__close" @click="closeCard">
          <font-awesome-icon :icon="['fas', 'times']" class="icon" />
        </button>
      </div>
      <div class="word-card__content">
        <input
          type="text"
          class="word-card__input"
          placeholder="輸入英文單字"
          v-model="inputWord"
        />
        <button class="word-card__button" @click="fetchWordData">
          查詢單字
        </button>
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
  export default {
    data() {
      return {
        inputWord: "", // 用戶輸入的英文單字
        wordData: null, // 單字資料
      };
    },
    methods: {
      closeCard() {
        this.wordData = null; // 清除單字資料
      },
        // async getCardFromGPT(word) {
        //     let a = 2;
        //     if(2==a){
        //         return;
        //     }
        //     const storedUser = localStorage.getItem('user');
        //     let displayUserName = "Kevin";
        //     if (storedUser) {
        //         this.user = JSON.parse(storedUser);
        //         displayUserName = this.user.displayName

        //     }

        //     let kkk =
        //         "c2stM1VhNDUwUHhhdjNnVVNNLUNmSHVTQ25ySUI3YUZGZjU1d0RRaE92SEZSVDNCbGJrRkowUkVpazRGWmN3QnIwZXIyX2xUU1BsbWV5dFZzQWpnYmpNS1puLVRfNEE=";
        //     const decodedStr = atob(kkk);

        //     const openai = new OpenAI({
        //         apiKey: decodedStr,
        //         dangerouslyAllowBrowser: true,
        //     });

        //     const thread = await openai.beta.threads.create();

        //     console.log("loading GPT");
        //     let prompt = `Please address the user as ${displayUserName}. The user has a premium account.First greeting to user with his name. Then say something to encourage him to work, give me five sentences. Separate each sentence with commas. Each sentence should cotent user name and not exceed 10 words. there shoudn't be comma after name. Answer in Traditional Chinese.`
        //     let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
        //         assistant_id: "asst_8GkyxwRkgLuvSkUcvhkFIFKT",
        //         instructions: prompt

        //     });

        //     if (run.status === "completed") {

        //         const messages = await openai.beta.threads.messages.list(run.thread_id);
        //         for (const message of messages.data.reverse()) {
        //             console.log(`${message.role} > ${message.content[0].text.value}`);
        //             this.mes = message.content[0].text.value;
        //             this.floatingTexts = this.mes.split("，");
        //             console.log(this.floatingTexts);
        //         }
        //     } else {
        //         console.log(run.status);
        //     }
        // },
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
    display: block;
  }
  .word-card__result {
    margin-top: 15px;
    border-top: 1px solid #ddd;
    padding-top: 10px;
  }
  </style>
  
 
