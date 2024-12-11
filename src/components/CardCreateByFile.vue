<template>
    <div class="card-block">
      <button @click="showScreen" v-if="!show">Upload Word File</button>
      <div class="word-card" v-if="show">
        <div class="word-card__header">
          <h2 class="word-card__title">上傳文件</h2>
          <button class="word-card__close" @click="closeAddCard">
            <strong>X</strong>
          </button>
        </div>
        <div class="word-card__content">
          <input type="file" accept=".docx" @change="handleFileUpload" class="input"/>
          <div class="submit-block" style="margin-top: 20px;">
            <button class="word-card__button" :disabled="!fileContent" @click="processFile">
              生成單字
            </button>
          </div>
          <div v-if="wordDataArray.length" class="word-card__result">
            <h3>Generated Words</h3>
            <ul>
              <li v-for="(wordData, index) in wordDataArray" :key="wordData.word">
                <strong>{{ wordData.word }}</strong> ({{ wordData.partOfSpeech }}):
                {{ wordData.translation }}
                <em>{{ wordData.exampleSentence }}</em>
                <button @click="deleteCard(index)">刪除</button>
                <button @click.stop="selectCard(index)">編輯</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
  
      <!-- Loading Modal -->
      <div v-if="showLoading" class="loading-modal">
        <div class="loading-content">
          <p>Loading...</p>
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
          <label>
            例句:
            <textarea v-model="editCard.exampleSentence"></textarea>
          </label>
          <label>
            詞性:
            <input v-model="editCard.partOfSpeech" type="text" />
          </label>
          <div class="modal-actions">
            <button @click="saveEditedCard">儲存</button>
            <button @click="cancelEdit">取消</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import OpenAI from "openai";
  import { ref, set, remove } from "firebase/database";
  import { database } from "../firebase";
  import * as mammoth from "mammoth";
  
  export default {
    data() {
      return {
        show: true,
        showLoading: false,
        fileContent: null,
        wordDataArray: [],
        editCardIndex: null, // Index of the card being edited
        editCard: {}, // Data of the card being edited
        userId: null,
      };
    },
    mounted() {
      this.userId = JSON.parse(localStorage.getItem("user")).uid;
    },
    methods: {
      showScreen() {
        this.show = !this.show;
      },
      closeAddCard() {
        this.show = false;
      },
      async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
  
        mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
          .then((result) => {
            this.fileContent = result.value.split(/\s+/); // Split text into words
          })
          .catch((error) => {
            console.error("Error reading Word file:", error);
          });
      },
      async processFile() {
        if (!this.fileContent || !this.fileContent.length) return;
  
        this.showLoading = true;
        let kkk =
        "c2stcHJvai15cUFsY3JwS1JEMWlkLWU4MHFBSzRHUmRVckYwYlZNemtXSEZNeVFBZ1JCeHBRNm9fZlowY29OeW5xVDNCbGJrRkpnMkFpVVoycjNPb0trYm5QSmlkSm5xTUloMFBmRXg2a2pCcHFkdGVmaGhlbVduNEhhSGZjWkowSGNB";
      const decodedStr = atob(kkk);
  
        const openai = new OpenAI({
          apiKey: decodedStr,
          dangerouslyAllowBrowser: true,
        });
  
        for (const word of this.fileContent) {
          if (!word.trim()) continue;
  
          const prompt = `You are an English teacher to help the user understand an English word.
            Here is the given word: "${word}". Please answer with a JSON format string as follows:
            {"word":"", "translation":"", "exampleSentence": "", "partOfSpeech": "", "imgUrl":""}
            word: the word itself.
            translation: Traditional Chinese of the word.
            exampleSentence: a sample sentence including the word to show the user how to use the word based on the word's part of speech.
            partOfSpeech: the meaning of the attribute name.
            You can ignore the imgUrl, just fill with an empty string.
            Don't use markdown symbols in your answer.`;
  
          try {
            const response = await openai.chat.completions.create({
              model: "gpt-4",
              messages: [
                { role: "system", content: "You are a helpful English teacher." },
                { role: "user", content: prompt },
              ],
            });
  
            const message = JSON.parse(response.choices[0].message.content);
            this.storeWordData(message);
          } catch (error) {
            console.error(`Error processing word "${word}":`, error);
          }
        }
  
        this.showLoading = false;
      },
      storeWordData(wordData) {
        const cardRef = ref(
          database,
          `users/${this.userId}/wordCards/${wordData.word}`
        );
        set(cardRef, wordData)
          .then(() => {
            console.log(`Card for ${wordData.word} stored successfully!`);
            this.wordDataArray.push(wordData);
          })
          .catch((error) => {
            console.error("Error storing data: ", error);
          });
      },
      selectCard(index) {
        this.editCardIndex = index;
        this.editCard = { ...this.wordDataArray[index] }; // Copy card data
      },
      cancelEdit() {
        this.editCardIndex = null;
        this.editCard = {};
      },
      saveEditedCard() {
        const cardRef = ref(
          database,
          `users/${this.userId}/wordCards/${this.editCard.word}`
        );
        set(cardRef, this.editCard)
          .then(() => {
            console.log(`Card for ${this.editCard.word} updated successfully!`);
            this.wordDataArray.splice(this.editCardIndex, 1, this.editCard); 
            this.cancelEdit();
          })
          .catch((error) => {
            console.error("Error updating card:", error);
          });
      },
      deleteCard(index) {
        console.log("clicked");
        const card = this.wordDataArray[index];
        const cardRef = ref(database, `users/${this.userId}/wordCards/${card.word}`);
        remove(cardRef)
          .then(() => {
            console.log(`Card for ${card.word} deleted successfully!`);
            this.wordDataArray.splice(index, 1); 
          })
          .catch((error) => {
            console.error("Error deleting card:", error);
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
    padding: 0 10px; /* Optional: Add padding for spacing */
    border-bottom: 1px solid #ddd; /* Optional: Add a separator line */
  }
  .word-card__title {
    margin: 0; /* Remove default margin */
    font-size: 1.5em; /* Adjust font size as needed */
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
  
  .loading-modal,
  .edit-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .edit-modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .edit-modal-content label {
    display: block;
    margin-bottom: 10px;
  }
  
  .edit-modal-content input,
  .edit-modal-content textarea {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
  
  .modal-actions {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
  }
  
  .input {
    margin-top: 30px;
  }
  
  button {
    cursor: pointer;
  }
  </style>