<template>
  <div class="card-block">
    <button @click="showScreen" v-if="!show">Add Card</button>
    <div class="word-card" v-if="show">
      <div class="word-card__header">
        <h2 class="word-card__title">建立字卡</h2>
        <button class="word-card__close" @click="closeAddCard">
          <strong>X</strong>
        </button>
      </div>
      <div class="word-card__content" style="justify-content: left">
        <input style="display: flex" type="text" class="word-card__input" placeholder="輸入英文單字" v-model="inputWord" />
        <div class="submit-block" style="display: flex">
          <button class="word-card__button" :disabled="empty" @click="getCardFromGPT">
            查詢單字
          </button>
          <span v-if="empty" style="display: flex; color: gray; margin-top: 10px; margin-left: 5vh;">* type in the word
            first</span>
        </div>
        <div v-if="wordData" class="word-card__result">
          <button class="word-card__close" @click="closeCard">
            <strong>X</strong>
          </button>
          <h3>{{ wordData.word }}</h3>
          <p><strong>詞性：</strong>{{ wordData.partOfSpeech }}</p>
          <p><strong>中文翻譯：</strong>{{ wordData.translation }}</p>
          <p><strong>例句：</strong>{{ wordData.exampleSentence }}</p>

          <!-- Buttons for Save, Edit, and Delete -->
          <div class="word-card__actions">
            <button @click="editCardData" class="edit-card-button">編輯</button>
            <button @click="deleteCard" class="delete-card-button">刪除</button>
            <button v-if="!editCardIndex" @click="saveCard" class="save-card-button">儲存</button>
            <!-- Save button appears when not editing -->
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editCardIndex !== null" class="edit-modal">
      <div class="edit-modal-content">
        <h3>編輯單字</h3>
        <label>
          單字:
          <input v-model="editCard.word" type="text" />
        </label>
        <label>
          翻譯:
          <input v-model="editCard.translation" type="text" />
        </label>
        <label class=example>
          例句:
          <textarea v-model="editCard.exampleSentence"></textarea>
        </label>
        <label>
          詞性:
          <input v-model="editCard.partOfSpeech" type="text" />
        </label>
        <div class="modal-actions">
          <button @click="saveEditedCard" class="save-edit-button">儲存</button>
          <button @click="cancelEdit" class="cancel-edit-button">取消</button>
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

  <div v-if="showExperienceModal" class="modal-overlay">
    <div class="modal">
      <button class="close-button" @click="closeExperienceModal">×</button>
      <p>完成新增五個字卡！寵物已獲得20經驗值！</p>
    </div>
  </div>
</template>

<script>
import OpenAI from "openai";
//import { ref, set, remove } from "firebase/database";
//import { database } from "../firebase"; // 引入 Firebase Realtime Database

export default {
  data() {
    return {
      inputWord: "", // 用戶輸入的英文單字
      wordData: null, // 單字資料
      show: true, // whether to show the add-card component
      showLoading: false, // show loading icon when fetching word data
      userId: null,
      savedCardsCount: 0,
      editCardIndex: null,
      showExperienceModal: false,
      petStore: {
        experience: 0,
        addExperience(points) {
          this.experience += points;
          console.log(`Experience added: ${points}. Total: ${this.experience}`);
        },
      },
      editCard: {
        word: "",
        translation: "",
        exampleSentence: "",
        partOfSpeech: ""
      }
    };
  },
  computed: {
    empty() {
      return !this.inputWord;
    },
  },
  mounted() {
    //this.userId = JSON.parse(localStorage.getItem("user")).uid;
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
    editCardData() {

      this.editCard = { ...this.wordData };
      this.editCardIndex = this.userId;
    },
    saveCard() {
      if (this.savedCardsCount < 5) {
        this.savedCardsCount++;
      }
      if (this.savedCardsCount == 5) {
        const task = { id: 2, status: "completed" };
        console.log(`Task status: ${task.status}`);
        this.petStore.addExperience(20);
        this.showExperienceModal = true;
        this.savedCardsCount++;
      }
      /*
        // Save new card to Firebase
        const cardRef = ref(database, `users/${this.userId}/wordCards/${this.inputWord}`);
        const newWordData = {
          word: this.inputWord,
          translation: this.wordData.translation,
          exampleSentence: this.wordData.exampleSentence,
          partOfSpeech: this.wordData.partOfSpeech,
        };
        set(cardRef, newWordData)
          .then(() => {
            console.log("Card saved successfully!");
            this.wordData = newWordData;
            this.inputWord = "";
            this.wordData = null;
          })
          .catch((error) => {
            console.error("Error saving data: ", error);
          }); 
      */
    },
    saveEditedCard() {
      /*
        // Save edited card back to Firebase
        const cardRef = ref(database, `users/${this.userId}/wordCards/${this.editCard.word}`);
        set(cardRef, this.editCard)
          .then(() => {
            console.log("Card edited successfully!");
            this.wordData = { ...this.editCard }; // Update word data with edited values
            this.editCardIndex = null; // Close modal after saving
          })
          .catch((error) => {
            console.error("Error saving edited data: ", error);
          }); 
      */
    },
    cancelEdit() {
      this.editCardIndex = null; // Close the modal without saving
    },
    deleteCard() {
      /*
        // Delete the card from Firebase
        const cardRef = ref(database, `users/${this.userId}/wordCards/${this.wordData.word}`);
        remove(cardRef)
          .then(() => {
            console.log("Card deleted successfully!");
            this.inputWord = "";
            this.wordData = null; // Clear word data
          })
          .catch((error) => {
            console.error("Error deleting card: ", error);
          }); 
      */
    },
    async getCardFromGPT() {
      console.log("getCardFromGPT");
      this.showLoading = true;

      let kkk = "c2stcHJvai1GR1ZjRS16TTJIRnRwYVVVOFhYZzNLWVE2aGg3SnVoY0czZWpleDZ3UVNETWE5R3JQLXJscVQ4UGJTQ1ZCVDZjdWZIRUhFZGpzQ1QzQmxia0ZKall0c1kxZm1BbENvZmp2Mko3NHlQbldDd203eUFjTTh4REk2Y1hnYlZUcXphNXNlbHU1Nmh6X3BTcGszcDlKLUpxUmFIcnBPd0E=";
      const decodedStr = atob(kkk);

      const openai = new OpenAI({
        apiKey: decodedStr,
        dangerouslyAllowBrowser: true,
      });

      const prompt = `You are an English teacher to help the user understand an English word.
    Here is the given word: "${this.inputWord}". Please answer with a JSON format string as follows:
    {"word":"", "translation":"", "exampleSentence": "", "partOfSpeech": "", "imgUrl":""}. translation: Traditional Chinese of the word.
      exampleSentence: a sample sentence including the word to show the user how to use the word based on the word's part of speech.
      partOfSpeech: the meaning of the attribute name.
      You can ignore the imgUrl, just fill with an empty string.
      Don't use markdown symbols in your answer.`;

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are a helpful English teacher." },
            { role: "user", content: prompt },
          ],
        });

        const message = response.choices[0].message.content;

        // Parse the JSON response
        this.wordData = JSON.parse(message);

        console.log("Word data fetched:", this.wordData);
      } catch (error) {
        console.error("Error interacting with OpenAI:", error);
      } finally {
        this.showLoading = false;
      }
    },
    storeWordData() {  //mes inside ()
      /*
        let wordData = JSON.parse(mes);
        const cardRef = ref(database, `users/${this.userId}/wordCards/${wordData.word}`);
        set(cardRef, wordData)
          .then(() => {
            console.log("Card stored successfully!");
            this.wordData = wordData;
          })
          .catch((error) => {
            console.error("Error storing data: ", error);
          });
        this.showLoading = false; 
      */
    },
    closeExperienceModal() {
      this.showExperienceModal = false;
    }
  },
};
</script>

<style scoped>
.modal {
  display: block !important;
  background-color: white;
  border: 1px solid black;
  z-index: 1000;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
}

.card-block {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: #f5f5f5;
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
  padding: 0 10px;
  border-bottom: 1px solid #ddd;
}

.word-card__title {
  margin: 0;
  font-size: 1.5em;
  font-weight: bold;
}

.word-card__close {
  width: 30px;
  height: 30px;
  border: none;
  background-color: transparent;
  color: black;
  font-size: larger;
  cursor: pointer;
}

.word-card__input {
  margin-top: 20px;
  margin-bottom: 20px;
}

.edit-modal {
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

.edit-modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.modal-actions {
  margin-top: 15px;
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

.edit-card-button,
.save-card-button,
.delete-card-button,
.save-edit-button,
.cancel-edit.button {
  margin-right: 5px;
}

label {
  display: block;
  margin-bottom: 5px;
}

.example {
  margin-left: 25px;
}
</style>