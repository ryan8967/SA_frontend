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
    },
    updatePetCollection(petCollection) {
      this.petCollection = petCollection;
    },
  },
});
