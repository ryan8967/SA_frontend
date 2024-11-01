<template>
    <div class="flashcard-wrapper">
        <div class="header">
            <div class="title">All the cards!</div>
            <router-link to="/learn">
                <button class="back-button">Back to learning</button>
            </router-link>
        </div>
        <div v-if="flashcards.length > 0">
            <div class="flashcard" v-for="(card, index) in paginatedFlashcards" :key="index">
                <div class="content" @click="flipCard(card)">
                    <p v-if="!card.flipped" class="question">{{ card.word }}</p>
                    <div v-else class="answer">
                        <p>{{ card.translation }}</p>
                        <hr />
                        <p class="part-of-speech"><strong>詞性：</strong>{{ card.partOfSpeech }}</p>
                        <p class="example"><strong>例句：</strong>{{ card.exampleSentence }}</p>
                    </div>
                </div>
            </div>
            <div class="pagination">
                <button class="previous-page-button" @click="prevPage" :disabled="currentPage === 1">
                    Previous
                </button>
                <span>Page {{ currentPage }} of {{ totalPages }}</span>
                <button class="next-page-button" @click="nextPage" :disabled="currentPage === totalPages">
                    Next
                </button>
            </div>
            <div class="end"></div>
        </div>
        <div v-else>
            <p>No flashcards available.</p>
        </div>
    </div>
</template>

<script>
import { ref, getDatabase, get } from "firebase/database";

export default {
    data() {
        return {
            flashcards: [],
            currentPage: 1,
            cardsPerPage: 4,
        };
    },
    mounted() {
        this.fetchFlashcards();
    },
    computed: {
        totalPages() {
            return Math.ceil(this.flashcards.length / this.cardsPerPage);
        },
        paginatedFlashcards() {
            const start = (this.currentPage - 1) * this.cardsPerPage;
            return this.flashcards.slice(start, start + this.cardsPerPage);
        },
    },
    methods: {
        async fetchFlashcards() {
            const db = getDatabase();
            const userId = 'testUserId';
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
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        addCard() {
            console.log("Add card button clicked!");
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
    margin-top: 100px;
    gap: 50px;
}

.title {
    font-size: 35px;
    text-align: center;
    margin: 0;
}

.back-button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 10px;
    background-color: #ff6f61;
    color: white;
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
  font-size: 30px;
}

.content {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
}

.part-of-speech,
.example {
    text-align: left;
    font-size: 20px;
}

.end {
    margin-top: 100px;
}

.pagination {
    display: flex;
    align-items: center;
    margin-top: 20px;
    justify-content: center;

}

.previous-page-button {
    padding: 10px 15px;
    margin: 0 10px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 10px;
    background-color: #ff6f61;
    color: white;
}

.next-page-button {
    padding: 10px 30px;
    margin: 0 10px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 10px;
    background-color: #ff6f61;
    color: white;
}

.previous-page-button:disabled,
.next-page-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.answer {
  width: 100%;
}

.example {
  margin-top: 1rem;
}

button:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

</style>