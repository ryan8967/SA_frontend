<template>
  <div class="flashcard-wrapper">
    <div class="header">
      <div class="title">Learn!</div>
      <router-link to="/all">
        <button class="all-cards-button" @click="viewAllCards">
          View all my cards!
        </button>
      </router-link>
    </div>
    <div v-if="flashcards.length > 0">
      <div class="flashcard">
        <div class="content" @click="flipCard(currentCard)">
          <p v-if="!currentCard.flipped" class="question">
            {{ currentCard.word }}
          </p>
          <div v-else class="answer">
            <p>{{ currentCard.translation }}</p>
            <hr />
            <p class="part-of-speech">
              <strong>詞性：</strong>{{ currentCard.partOfSpeech }}
            </p>
            <p class="example">
              <strong>例句：</strong>{{ currentCard.exampleSentence }}
            </p>
          </div>
        </div>
      </div>
      <div class="controls">
        <button @click.stop="rateCard('good')">記起來了</button>
        <button @click.stop="rateCard('again')">再試一次</button>
      </div>
    </div>
    <div v-else>
      <p>No flashcards available.</p>
      <button @click="tryAgain()">Try Again</button>
    </div>
  </div>
</template>

<script>
import { ref, getDatabase, get } from "firebase/database";

export default {
  data() {
    return {
      flashcards: [],
      currentCardIndex: 0,
      cardsToRepeat: [],
    };
  },
  computed: {
    currentCard() {
      return this.flashcards[this.currentCardIndex];
    },
  },
  mounted() {
    this.fetchFlashcards();
  },
  methods: {
    async fetchFlashcards() {
      const db = getDatabase();
      //const userId = JSON.parse(localStorage.getItem("user")).uid;
      const userId = "testUserId";
      const flashcardsRef = ref(db, `users/${userId}/wordCards`);

      try {
        const snapshot = await get(flashcardsRef);
        if (snapshot.exists()) {
          this.flashcards = Object.values(snapshot.val()).map((card) => ({
            ...card,
            flipped: false,
          }));
        } else {
          console.log("No flashcards found.");
        }
      } catch (error) {
        console.error("Error fetching flashcards: ", error);
      }
    },
    flipCard(card) {
      card.flipped = !card.flipped;
    },
    rateCard(rating) {
      const currentCard = this.flashcards[this.currentCardIndex];

      if (rating === "again") {
        this.cardsToRepeat.push({ ...currentCard, flipped: false });
      }

      if (this.currentCardIndex < this.flashcards.length - 1) {
        this.currentCardIndex++;
      } else if (this.cardsToRepeat.length > 0) {
        this.flashcards = this.cardsToRepeat;
        this.cardsToRepeat = [];
        this.currentCardIndex = 0;
      } else {
        this.flashcards = [];
      }
    },
    async tryAgain() {
      window.location.reload();
    },
  },
};
</script>


<style scoped>
.header {
  display: flex;                
  justify-content: space-between; 
  align-items: center;        
  padding: 10px;             
  margin-top: 150px;
  gap: 50px;
}

.title {
  font-size: 35px;
  text-align: center;
  margin-top: 4px;
}

.flashcard-wrapper {
  position: relative;
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
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

.content {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
}

button:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

button {
  background-color: #ff6f61;
  padding: 10px 25px;
  border-radius: 10px;
  font-size: 15px;
  border: none;
  color: white;
  cursor: pointer;
}

.controls {
  display: flex;
  gap: 10px;
  justify-content: center;
  gap: 15px;
}

.allcards {
  position: absolute;
  top: 20px;
  right: 20px;
}

.allcards button {
  margin-top: 10px;
  background-color: #ff6f61;
  padding: 10px 25px;
  border-radius: 10px;
  font-size: 15px;
  border: none;
  color: white;
  cursor: pointer;
}

.part-of-speech,
.example {
  font-size: 20px;
  text-align: left;
}

.answer {
  width: 100%;
}

.example {
  margin-top: 1rem;
}

.all-cards-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 10px;
  background-color: #ff6f61;
  color: white;
  margin-top: 4px;
}

</style>