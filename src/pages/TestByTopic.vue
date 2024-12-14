<template>
    <div class="card-block">
    <button @click="showScreen" v-if="!show" class="add-card-button">
      Add Card
    </button>
    <div class="word-card" v-if="show">
      <div class="word-card__header">
        <h2 class="word-card__title">主題式單字測驗</h2>
        <button class="word-card__close" @click="closeAddCard">
          <strong>X</strong>
        </button>
      </div>
      <div class="word-card__content">
        <input 
          type="text" 
          class="word-card__input" 
          placeholder="輸入主題" 
          v-model="inputWord" 
        />
        <div class="submit-block">
          <button 
            class="word-card__button" 
            :disabled="empty" 
            @click="getCardFromGPT">
            開始測驗
          </button>
          <span v-if="empty" class="error-message">請輸入主題!</span>
        </div>
      </div>
    </div>
        <div v-if="wordData && wordData.length && testCompleted" class="flashcard-wrapper">
            <div v-for="(word, index) in wordData" :key="index" class="flashcard">
                <div class="content" @click="flipCard(word)">
                    <p v-if="!word.flipped" class="question">{{ word.word }}</p>
                        <div v-else class="back">
                            <p>{{ word.translation }}</p>
                            <hr />
                            <p><strong>詞性：</strong>{{ word.partOfSpeech }}</p>
                            <p><strong>中文翻譯：</strong>{{ word.translation }}</p>
                            <p><strong>例句：</strong>{{ word.exampleSentence }}</p>
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

        <div class="test-card" v-if="isTesting">
            <div class="test-card__header">
                <h2>測驗進行中：{{ currentIndex + 1 }}/{{ wordCount }}</h2>
            </div>
            <div class="test-card__content">
                <h3 class="flashcard">題目：{{ currentQuestion.translation }}</h3>
                <div class="choices">
                    <button v-for="(choice, index) in currentChoices" :key="index" class="choice-button"
                        @click="selectAnswer(choice)" :class="{ selected: selectedAnswer === choice }">
                        {{ choice }}
                    </button>
                </div>
                <button class="test-card__submit" @click="submitAnswer" :disabled="!selectedAnswer">
                    提交答案
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import OpenAI from "openai";
//import { ref, set } from "firebase/database";
//import { database } from "../firebase"; // 引入 Firebase Realtime Database

export default {
    data() {
        return {
            inputWord: "", // 用戶輸入的英文單字
            wordCount: 10,
            wordData: null, // 單字資料
            show: true, // whether to show the add-card component
            showLoading: false, // show loading icon when fetching word data
            userId: null,
            isTesting: false,
            testCompleted: false,
            currentIndex: 0,
            selectedAnswer: null,
            currentChoices: [],
            score: 0,
            vocabBank: [
                "apple", "blue", "cat", "dog", "easy", "flower", "grass", "happy", "ice", "jump",
                "kite", "lamp", "moon", "nice", "open", "paint", "queen", "rose", "star", "tree",
                "umbrella", "vivid", "water", "x-ray", "yellow", "zebra", "anchor", "breeze",
                "cloud", "dream", "earth", "flavor", "garden", "harmony", "island", "journey",
                "knowledge", "laughter", "memory", "nature", "ocean", "patience", "quiet",
                "ribbon", "serene", "temple", "unique", "village", "wander", "yonder", "zeal",
                "aberration", "belligerent", "contemplate", "dilemma", "effervescent", "facetious",
                "gregarious", "heinous", "indomitable", "juxtaposition", "knack", "lucid",
                "meticulous", "nuance", "oblivious", "paradox", "quintessential", "resilient",
                "surreal", "tenacious", "ubiquitous", "vehement", "whimsical", "xenophobia",
                "yearning", "zenith", "anachronistic", "boisterous", "cognizant", "discombobulate",
                "empathy", "flabbergasted", "grandiose", "haphazard", "ineffable", "juxtapose",
                "kaleidoscope", "labyrinthine", "myriad", "nonchalant", "oscillate", "phenomenon",
                "quixotic", "reverence", "serendipity", "taciturn", "unprecedented", "voracious",
                "wistful", "xylophone", "yawning", "zealous"
            ],
        };
    },
    computed: {
        empty() {
            return !this.inputWord || this.wordCount <= 0;
        },
    },
    mounted() {
        // Skip UID retrieval for debugging
        //this.userId = JSON.parse(localStorage.getItem("user")).uid;
        // You can set a temporary userId for testing
        //this.userId = 'testUserId'; // Use a test ID or hard-code a value for debugging
    },
    methods: {
        flipCard(word) {
            word.flipped = !word.flipped;
        },
        startTest() {
            this.isTesting = true;
            this.currentIndex = 0;
            this.score = 0;
            this.nextQuestion();
        },
        nextQuestion() {
            const currentWord = this.wordData[this.currentIndex];
            this.currentQuestion = currentWord;
            const correctAnswer = currentWord.word;

            const wrongAnswers = this.vocabBank
                .filter(word => word !== correctAnswer) // Exclude correct answer
                .sort(() => 0.5 - Math.random())        // Shuffle
                .slice(0, 3);                           // Pick 3 random words

            this.currentChoices = [correctAnswer, ...wrongAnswers]
                .sort(() => 0.5 - Math.random());

            this.selectedAnswer = null;
        },
        selectAnswer(choice) {
            this.selectedAnswer = choice; // Store selected choice
        },
        submitAnswer() {
            if (this.selectedAnswer === this.currentQuestion.word) {
                this.score++; // Increment score for correct answer
            }
            if (this.currentIndex + 1 < this.wordCount) {
                this.currentIndex++;
                this.nextQuestion();
            } else {
                this.endTest();
            }
        },
        endTest() {
            this.testCompleted = true;
            this.isTesting = false;
            alert(`測驗結束！您的得分是：${this.score}/${this.wordCount}`);

        },
        showScreen() {
            this.show = !this.show;
        },
        closeAddCard() {
            this.show = false;
        },
        closeCard() {
            this.wordData = null;
            this.testCompleted = false;
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
            this.showLoading = false;
        },
        /*storeWordData(mes) {
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

                this.isTesting = true;
                this.startTest();
                this.show = false;
            } catch (error) {
                console.error("Error parsing or storing word data: ", error);
                this.showLoading = false;
            }
        },*/
    },
};
</script>

<style scoped>
.card-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px auto;
  max-width: 100%;
  margin-top: 150px;
}

.add-card-button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-card-button:hover {
  background-color: #0056b3;
}

.word-card {
  width: 100%;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.word-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.word-card__content {
  margin-top: 20px;
}

.word-card__input {
  margin-top: 10px;
  width: 80%; 
  max-width: 250px; 
  padding: 8px; 
  border: 1px solid #ccc; 
  border-radius: 4px; 
  box-sizing: border-box;
}

.word-card__button {
  padding: 10px 20px;
  font-size: 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.word-card__button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.submit-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-left: 10px;
}

.flashcard-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    margin-top: 50px;
    margin-bottom: 100px;
}

.flashcard {
    padding: 20px;
    border-radius: 12px;
    width: 300px;
    background-color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    margin-bottom: 20px;
    font-size: 18px;
}

.content {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
}

.question {
    font-size: 22px;
    font-weight: bold;
}

.answer {
    text-align: left;
    margin-top: 10px;
}

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

.choices {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    justify-content: center;
    align-items: center;
    max-width: 400px;
    /* adjust as needed */
    margin: 0 auto;
    /* center the grid */
}

.choice-button {
    background-color: #ff6f61;
    padding: 10px 25px;
    border-radius: 10px;
    font-size: 15px;
    border: none;
    color: white;
    cursor: pointer;
}

.choice-button:hover {
    background-color: #e0e0e0;
}

.choice-button.selected {
    background-color: #d1e7dd;
    border-color: #0f5132;
    color: #0f5132;
    font-weight: bold;
}

.flashcard {
    padding: 20px;
    border-radius: 12px;
    width: 300px;
    background-color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    margin-bottom: 20px;
    font-size: 30px;
}
</style>