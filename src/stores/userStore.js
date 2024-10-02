import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    virtualCoins: 0,
    petLevel: 1,
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
    setVirtualCoins(coins) {
      this.virtualCoins = coins;
    },
    setPetLevel(level) {
      this.petLevel = level;
    },
    addCoins(amount) {
      this.virtualCoins += amount;
    },
    logout() {
      this.user = null;
      this.virtualCoins = 0;
      this.petLevel = 1;
    },
  },
});
