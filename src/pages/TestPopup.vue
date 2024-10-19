<template>
    <div>
        <button @click="showPopup">顯示成就</button>
        <AchievementPopup
        v-if="isPopupVisible"
        :title="'成就解鎖：超級冒險者！'"
        :description="'你已經完成了所有挑戰，獲得了獨特的獎勵！'"
        :image="'./pet/pet1.png'"
        @close="isPopupVisible = false"
        />
    </div>
</template>
  
  <script>
  import AchievementPopup from '../components/AchievementPopup.vue';
  
  export default {
    components: {
      AchievementPopup,
    },
    data() {
      return {
        isPopupVisible: false,
      };
    },
    methods: {
      showPopup() {
        this.isPopupVisible = true;
      },
    },
  };
  </script>
  