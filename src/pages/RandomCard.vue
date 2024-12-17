<template>
  <div class="quiz-block" :class="{ 'result-padding': showResult }">
    <!-- No Wrong Questions Message -->
    <div v-if="noQuestionsAvailable" class="result-card">
      <h2 class="result-title">太棒了！</h2>
      <div class="result-content">
        <p class="result-message">目前沒有字卡需要複習！</p>
      </div>
      <div class="result-buttons">
        <button @click="goToMenu" class="menu-button">回選單</button>
        <button @click="goToCreateCard" class="continue-button">前往主題單字</button>
      </div>
    </div>

    <AchievementPopup v-if="showResult && showPopup" :title="popupData.title" :description="popupData.description"
      :image="popupData.image" @close="handlePopupClose" />

    <!-- Quiz Content -->
    <template v-else>
      <div v-if="currentQuestion && !showResult" class="quiz-question">
        <h2 class="quiz-question-title">{{ currentQuestion.chineseTranslation }}</h2>
        <div class="quiz-options">
          <div class="option" v-for="(option, index) in currentQuestion.options" :key="index">
            <button :class="{
              'correct': isSelectedCorrect && selectedOptionIndex === index,
              'incorrect': !isSelectedCorrect && selectedOptionIndex === index
            }" @click="handleAnswer(option, index)">
              {{ option }}
              <img v-if="selectedOptionIndex === index"
                :src="isSelectedCorrect ? '/cardimg/correct.png' : '/cardimg/wrong.png'" class="result-icon" />
            </button>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div v-if="!showResult" class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <div class="progress-text">{{ questionsAnswered }} / 10</div>
      </div>

      <!-- Result Card -->
      <div v-if="showResult" class="result-card">
        <h2 class="result-title">測驗完成！</h2>
        <div class="result-content">
          <p class="result-score">你答對了 {{ correctCount }} 題，共 {{ questionsAnswered }} 題</p>
          <p class="result-percentage">正確率: {{ (correctCount / questionsAnswered * 100).toFixed(1) }}%</p>
          <div class="result-message">
            <p v-if="correctCount === totalQuestions">太棒了！完美的表現！</p>
            <p v-else-if="correctCount >= totalQuestions * 0.8">做得很好！繼續保持！</p>
            <p v-else-if="correctCount >= totalQuestions * 0.6">表現不錯！還可以再進步！</p>
            <p v-else>繼續加油！通過練習一定會進步的！</p>
          </div>
        </div>
        <div class="result-buttons">
          <button @click="goToMenu" class="menu-button">回選單</button>
          <button @click="navigateTo('wrong')" class="continue-button">前往錯題測驗</button>
        </div>

        <!-- Answer Review Section -->
        <div class="answer-review">
          <h3 class="review-title">答題記錄</h3>
          <div class="review-list">
            <div v-for="(question, index) in answeredQuestions" :key="index" class="review-item"
              :class="{ 'correct-answer': question.isCorrect }">
              <div class="review-question">
                <span class="question-number">Q{{ index + 1 }}.</span>
                <span class="chinese-text">{{ question.chineseTranslation }}</span>
              </div>
              <div class="review-answers">
                <div class="user-answer">
                  你的答案: <span :class="{ 'correct-text': question.isCorrect, 'incorrect-text': !question.isCorrect }">
                    {{ question.userAnswer }}
                  </span>
                </div>
                <div class="correct-answer" v-if="!question.isCorrect">
                  正確答案: <span class="correct-text">{{ question.correctAnswer }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Loading State -->
    <div v-if="showLoading" class="loading-modal">
      <div class="loading-content">
        <div class="loading-spinner">
          <div class="loading-dot"></div>
          <div class="loading-dot"></div>
          <div class="loading-dot"></div>
        </div>
        <p class="loading-text">Loading...</p>
      </div>
    </div>
  </div>
</template>

<script>
import OpenAI from "openai";
import AchievementPopup from "../components/AchievementPopup.vue";
export default {
  components: {
    AchievementPopup,
  },
  data() {

    return {

      currentQuestion: null,
      showLoading: false,
      selectedOptionIndex: null,
      isSelectedCorrect: false,
      questionsAnswered: 0,
      showResult: false,
      correctCount: 0,
      answeredQuestions: [],
      showPopup: true, // 控制彈窗顯示（可不需要單獨此屬性）
      popupData: {
        title: "測驗完成！",
        description: "",
        image: "pet/pet3.gif", // 替換為成就圖片
      },
    };
  },
  computed: {
    progressPercentage() {
      return (this.questionsAnswered / 10) * 100;
    }
  },
  mounted() {
    this.startQuiz();
  },
  methods: {
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },

    async startQuiz() {
      this.showLoading = true;
      try {
        // 從API獲取隨機單字
        const response = await fetch("http://localhost:8080/api/cards/random", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data || data.length === 0) {
          console.error("No words available");
          this.showLoading = false;
          return;
        }

        await this.generateQuestion(data[0].word);
        this.remainingWords = data.slice(1);

      } catch (error) {
        console.error("Error starting quiz:", error);
        this.showLoading = false;
      }
    },

    async loadNextQuestion() {
      if (this.questionsAnswered >= 10) {
        this.showResult = true;
        this.showLoading = false;
        return;
      }

      if (!this.remainingWords || this.remainingWords.length === 0) {
        this.showResult = true;
        this.showLoading = false;
        return;
      }

      const nextWord = this.remainingWords.shift();
      await this.generateQuestion(nextWord.word);
    },

    async generateQuestion(word) {
      this.showLoading = true;
      try {
        let kkk = "c2stcHJvai1GR1ZjRS16TTJIRnRwYVVVOFhYZzNLWVE2aGg3SnVoY0czZWpleDZ3UVNETWE5R3JQLXJscVQ4UGJTQ1ZCVDZjdWZIRUhFZGpzQ1QzQmxia0ZKall0c1kxZm1BbENvZmp2Mko3NHlQbldDd203eUFjTTh4REk2Y1hnYlZUcXphNXNlbHU1Nmh6X3BTcGszcDlKLUpxUmFIcnBPd0E=";
        const decodedStr = atob(kkk);

        const openai = new OpenAI({
          apiKey: decodedStr,
          dangerouslyAllowBrowser: true,
        });

        const prompt = `You are an English teacher helping the user create a multiple-choice question.
        Given the word: "${word}", generate a JSON object as follows:
        {
          "chineseTranslation": "", 
          "options": ["", "", "", ""],
          "correctAnswer": ""
        }.
        The "options" should include three incorrect english words as distractors along with the correct english word.
        The distractors should be plausible but clearly incorrect.
        Return only the JSON object without any additional text or explanation. The "chineseTranslation" should be the Chinese translation of the word, use zh-tw.`;

        const gptResponse = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are a helpful English teacher." },
            { role: "user", content: prompt },
          ],
        });

        const message = gptResponse.choices[0].message.content;
        let questionData = JSON.parse(message);
        questionData.options = this.shuffleArray([...questionData.options]);
        questionData.originalWord = word; // 保存原始單字
        this.currentQuestion = questionData;
        this.questionsAnswered += 1;

      } catch (error) {
        console.error("Error generating question:", error);
      } finally {
        this.showLoading = false;
      }
    },

    async handleAnswer(selectedOption, index) {
      this.selectedOptionIndex = index;
      this.isSelectedCorrect = selectedOption === this.currentQuestion.correctAnswer;

      this.answeredQuestions.push({
        chineseTranslation: this.currentQuestion.chineseTranslation,
        userAnswer: selectedOption,
        correctAnswer: this.currentQuestion.correctAnswer,
        isCorrect: this.isSelectedCorrect
      });

      if (this.isSelectedCorrect) {
        this.correctCount++;
      }

      try {
        const endpoint = this.isSelectedCorrect
          ? "http://localhost:8080/api/correct/add"
          : "http://localhost:8080/api/incorrect/add";

        await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ word: this.currentQuestion.originalWord }),
        });

      } catch (error) {
        console.error("Error updating word database:", error);
      }

      setTimeout(async () => {
        this.isSelectedCorrect = false;
        this.selectedOptionIndex = null;
        // this.showResult = true;
        if (this.questionsAnswered >= 10) {

          this.popupData.description = `你答對了 ${this.correctCount} 題，共 ${this.questionsAnswered} 題！正確率為 ${(this.correctCount / this.questionsAnswered * 100).toFixed(1)}%。`;
          this.showResult = true;
        } else {
          await this.loadNextQuestion();
        }
        await this.loadNextQuestion();
      }, 2000);
    },
    handlePopupClose() {
      this.showPopup = false; // 關閉彈窗後隱藏
    },

    goToMenu() {
      this.$router.push('/menu');
    },

    navigateTo(page) {
      this.$router.push({ name: page });
    },
    async restartQuiz() {
      this.questionsAnswered = 0;
      this.correctCount = 0;
      this.answeredQuestions = [];
      this.showResult = false;
      await this.startQuiz();
    }
  }
};
</script>
<style scoped>
.quiz-block {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  background-color: #f4f4f4;
  flex-direction: column;
  position: fixed;
  top: -50px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.quiz-question {
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.quiz-question-title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}

.quiz-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  width: 100%;
}

.quiz-options .option {
  width: 100%;
}

.quiz-options button {
  width: 100%;
  padding: 15px 20px;
  font-size: 18px;
  border: none;
  border-radius: 10px;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
}

.quiz-options button:hover {
  background-color: #e0e0e0;
}

.quiz-options button.incorrect {
  background-color: #F44336 !important;
  color: white;
}

.quiz-options button.correct {
  background-color: #4CAF50 !important;
  color: white;
}

.result-icon {
  width: 25px;
  height: 25px;
  margin-left: 10px;
}

.result-card {
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
  height: calc(100vh - 40px);
  overflow-y: auto;
  margin: 20px;
}

.result-title {
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
}

.result-content {
  margin-bottom: 20px;
}

.result-score {
  font-size: 24px;
  color: #4CAF50;
  margin-bottom: 15px;
}

.result-percentage {
  font-size: 20px;
  color: #666;
  margin-bottom: 20px;
}

.result-message {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f8f8;
  border-radius: 8px;
}

.result-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
}

.menu-button,
.continue-button {
  padding: 12px 25px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.menu-button {
  background-color: #666;
  color: white;
}

.continue-button {
  background-color: #4CAF50;
  color: white;
}

.menu-button:hover,
.continue-button:hover {
  transform: translateY(-2px);
}

.answer-review {
  margin-top: 20px;
  width: 100%;
  text-align: left;
}

.review-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.review-list {
  background-color: #f8f8f8;
  border-radius: 10px;
  padding: 20px;
  max-height: calc(100vh - 460px);
  overflow-y: auto;
}

.review-item {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 10px;
}

.review-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.question-number {
  font-weight: bold;
  color: #666;
  margin-right: 10px;
}

.chinese-text {
  font-size: 16px;
  color: #333;
}

.review-answers {
  margin-top: 10px;
  padding-left: 25px;
}

.user-answer,
.correct-answer {
  margin: 5px 0;
  font-size: 14px;
}

.correct-text {
  color: #4CAF50;
  font-weight: 500;
}

.incorrect-text {
  color: #F44336;
  font-weight: 500;
}

.correct-answer .correct-text {
  font-weight: 600;
}

.loading-modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.loading-content {
  background: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.loading-dot {
  width: 15px;
  height: 15px;
  background-color: #ff6f61;
  border-radius: 50%;
  margin: 0 8px;
  animation: bounce 0.5s ease-in-out infinite alternate;
}

.loading-dot:nth-child(2) {
  animation-delay: 0.1s;
}

.loading-dot:nth-child(3) {
  animation-delay: 0.2s;
}

.loading-text {
  color: #000000;
  font-weight: 600;
  font-size: large;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.progress-container {
  position: absolute;
  bottom: 100px;
  left: 0;
  width: 100%;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 900;
}

.progress-bar {
  width: 90%;
  max-width: 600px;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-text {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.no-questions-message {
  text-align: center;
  padding: 30px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
}

.no-questions-message h2 {
  color: #4CAF50;
  margin-bottom: 20px;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
    opacity: 0.6;
  }

  100% {
    transform: translateY(-15px);
    opacity: 1;
  }
}

@media (max-width: 600px) {
  .quiz-options {
    grid-template-columns: 1fr;
  }

  .quiz-question {
    padding: 20px;
    margin: 0 15px;
  }

  .quiz-question-title {
    font-size: 20px;
  }

  .quiz-options button {
    font-size: 16px;
    padding: 12px 15px;
  }

  .result-card {
    margin: 15px;
    padding-top: 100px;
    height: calc(100vh - 30px);
  }

  .result-title {
    font-size: 24px;
  }

  .result-score {
    font-size: 20px;
  }

  .result-percentage {
    font-size: 18px;
  }

  .result-message {
    font-size: 16px;
  }

  .result-buttons {
    flex-direction: column;
  }

  .menu-button,
  .continue-button {
    width: 100%;
    margin-bottom: 10px;
  }

  .answer-review {
    margin-top: 20px;
  }

  .review-list {
    padding: 15px;
    max-height: calc(100vh - 440px);
  }

  .review-item {
    padding: 12px;
  }

  .chinese-text {
    font-size: 14px;
  }

  .review-answers {
    padding-left: 20px;
  }

  .user-answer,
  .correct-answer {
    font-size: 13px;
  }

  .progress-container {
    padding: 10px;
  }

  .progress-bar {
    width: 85%;
  }

  .progress-text {
    font-size: 12px;
  }
}
</style>
