import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    virtualCoins: 0,
    diamonds: 50, // 初始鑽石屬性
    petLevel: 1,
    selectedPetIndex: 0, // 用來保存當前選中的寵物索引
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
    setVirtualCoins(coins) {
      this.virtualCoins = coins;
    },
    setDiamonds(diamonds) {
      this.diamonds = diamonds;
    },
    setPetLevel(level) {
      this.petLevel = level;
    },
    addCoins(amount) {
      this.virtualCoins += amount;
    },
    addDiamonds(amount) {
      this.diamonds += amount;
    },
    logout() {
      this.user = null;
      this.virtualCoins = 0;
      this.diamonds = 0; // 登出後清空鑽石
      this.petLevel = 1;
      this.selectedPetIndex = 0; // 重置選中寵物
    },
    setSelectedPet(index) {
      this.selectedPetIndex = index;
    },
  },
});
