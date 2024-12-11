import { defineStore } from "pinia";

export const usePetStore = defineStore("petStore", {
  state: () => ({
    petCollection: [
      {
        src: "pet/pet3.png",
        owned: true,
        level: 1,
        currentExperience: 0,
        experienceNeeded: 100,
      },
      {
        src: "pet/pet5.png",
        owned: true,
        level: 1,
        currentExperience: 0,
        experienceNeeded: 100,
      },
      {
        src: "pet/pet1.png",
        owned: false,
        level: 1,
        currentExperience: 0,
        experienceNeeded: 100,
      },
      {
        src: "pet/pet2.png",
        owned: false,
        level: 1,
        currentExperience: 0,
        experienceNeeded: 100,
      },
      {
        src: "pet/pet4.png",
        owned: false,
        level: 1,
        currentExperience: 0,
        experienceNeeded: 100,
      },
      {
        src: "pet/pet6.png",
        owned: false,
        level: 1,
        currentExperience: 0,
        experienceNeeded: 100,
      },
    ],
    selectedPetIndex: 0, // 跟踪當前選中的寵物
    hasBrokenThrough: false, // 新增全域變數，紀錄是否突破
  }),
  getters: {
    selectedPet(state) {
      return state.petCollection[state.selectedPetIndex];
    },
  },
  actions: {
    selectPet(index) {
      if (this.petCollection[index].owned) {
        this.selectedPetIndex = index;
      }
    },
    addExperience(amount) {
      const selectedPet = this.selectedPet;
      selectedPet.currentExperience += amount;
      if (selectedPet.currentExperience >= selectedPet.experienceNeeded) {
        this.levelUp();
      }
    },
    levelUp() {
      const selectedPet = this.selectedPet;
      selectedPet.level += 1;
      selectedPet.currentExperience = 0;
      selectedPet.experienceNeeded += 50;
      this.checkBreakthrough(); // 每次升級檢查是否達到突破條件
    },
    checkBreakthrough() {
      // 設定一個突破條件，例如當寵物達到 10 級時算作突破
      const breakthroughLevel = 10;
      const hasAnyPetBrokenThrough = this.petCollection.some(
        (pet) => pet.level >= breakthroughLevel
      );

      if (hasAnyPetBrokenThrough && !this.hasBrokenThrough) {
        // 如果有寵物達到突破條件，且還沒標記突破過，更新變數
        this.hasBrokenThrough = true;
      }
    },
    updatePetCollection(petCollection) {
      this.petCollection = petCollection;
    },
  },
});
