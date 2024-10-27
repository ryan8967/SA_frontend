<template>
    <div class="title">All the cards!</div>
    <div class="flashcard-wrapper">
        <div v-if="flashcards.length > 0">
            <div class="flashcard" v-for="(card, index) in flashcards" :key="index">
                <div class="content" @click="flipCard(card)">
                    <p v-if="!card.flipped" class="question">{{ card.word }}</p>
                    <p v-else class="answer">{{ card.translation }}</p>
                </div>
            </div>
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
        };
    },
    mounted() {
        this.fetchFlashcards();

    },
    methods: {
        async fetchFlashcards() {
            const db = getDatabase();
            //const userId = JSON.parse(localStorage.getItem("user")).uid;
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
        rateCard(rating) {
            this.$emit("rate", rating);
            this.flashcards.forEach((card) => (card.flipped = false));
        },
    },
};
</script>

<style scoped>
.title {
    padding-top: 500px;
    font-size: 45px;
    text-align: center;
}

.flashcard-wrapper {
    padding-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
}

.flashcard {
    padding: 20px;
    border-radius: 12px;
    width: 600px;
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

</style>