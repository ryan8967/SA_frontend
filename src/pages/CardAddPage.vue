<template>
    <div class="test-page">
        <CardCreate></CardCreate>
    </div>
</template>

<script>
import CardCreate from '@/components/CardCreate.vue';
export default{
    components: {
        CardCreate,
    },
    data() {
        return {
            show: false,
        }
    },
    methods: {
        showScreen() {
            this.show = !this.show;
        }
    }
}
</script>