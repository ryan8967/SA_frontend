<template>
    <div class="wrapper">
        <div class="header">
            <div class="title">學習選單</div>
        </div>
        <router-link to="/all">
            <button class="all-cards-button" @click="navigateTo('AllCards')">
                查看字卡
            </button>
        </router-link>
        <button class="create-card-button" @click="navigateTo('createMenu')">創建字卡</button>
        <button class="create-card-button" @click="navigateTo('learn')">立即學習</button>
        <button class="create-card-button" @click="navigateTo('wrong')">錯題複習</button>

    </div>
</template>

<script>
//import { ref, getDatabase, get } from "firebase/database";

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
        navigateTo(page) {
            this.$router.push({ name: page });
        },
        async fetchFlashcards() {/*
            const db = getDatabase();
            const userId = JSON.parse(localStorage.getItem("user")).uid;
            //const userId = "testUserId";
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
            }*/
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

.options {
    vertical-align: middle;
}

.wrapper {
    position: relative;
    padding-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
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

.create-card-button {
    padding: 10px 20px;
    margin-top: 10px;
}
</style>