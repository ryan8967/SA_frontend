<template>
    <div class="card-create">
        <div class="card-create__header">
            <h2 class="card-create__title">Create a new card</h2>
            <button class="card-create__close" @click="closeCard">
                <font-awesome-icon :icon="['fas', 'times']" class="icon" />
            </button>
        </div>
        <div class="card-create__content">
            <input
                type="text"
                class="card-create__input"
                placeholder="Enter a title..."
                v-model="title"
            />
            <textarea
                class="card-create__textarea"
                placeholder="Enter a description..."
                v-model="description"
            ></textarea>
            <button class="card-create__button" @click="createCard">
                Create
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            word: "",
            description: "",
        };
    },
    methods: {
        closeCard() {
            this.$emit("close");
        },
        createCard() {
            this.$emit("create", {
                title: this.title,
                description: this.description,
            });
            this.title = "";
            this.description = "";
        },
    },
};
</script>
