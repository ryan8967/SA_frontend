<template>
    <div class="flashcard-wrapper">
        <div class="title">All the cards!</div>
        <div v-if="flashcards.length > 0">
            <div class="flashcard" v-for="(card, index) in flashcards" :key="index">
                <div class="content" @click="flipCard(card)">
                    <p v-if="!card.flipped" class="question">{{ card.word }}</p>
                    <div v-else class="answer">
                        <p>{{ card.translation }}</p>
                        <hr/>
                        <p class="part-of-speech"><strong>詞性：</strong>{{ card.partOfSpeech }}</p>
                        <p class="example"><strong>例句：</strong>{{ card.exampleSentence }}</p>
                    </div>
                </div>
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
        };
    },
    mounted() {
        this.fetchFlashcards();

    },
    methods: {
        async fetchFlashcards() {
            const db = getDatabase();
            const userId = JSON.parse(localStorage.getItem("user")).uid;
            //const userId = 'testUserId';
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
    margin-top: 100px;
    font-size: 45px;
    text-align: center;
}

.flashcard-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    margin-top: 100px;
    margin-bottom: 100px;
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

.part-of-speech,
.example {
    text-align: left;
    font-size: 20px;
}

.end {
    margin-top: 100px;
}

</style>