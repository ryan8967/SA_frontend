import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    virtualCoins: 0,
    diamonds: 50, // 新增鑽石屬性
    petLevel: 1,
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
    setVirtualCoins(coins) {
      this.virtualCoins = coins;
    },
    setDiamonds(diamonds) {
      // 設置鑽石
      this.diamonds = diamonds;
    },
    setPetLevel(level) {
      this.petLevel = level;
    },
    addCoins(amount) {
      this.virtualCoins += amount;
    },
    addDiamonds(amount) {
      // 增加鑽石的方法
      this.diamonds += amount;
    },
    logout() {
      this.user = null;
      this.virtualCoins = 0;
      this.diamonds = 0; // 登出後清空鑽石
      this.petLevel = 1;
    },
  },
});
