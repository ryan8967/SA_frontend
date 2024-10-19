import { defineStore } from "pinia";
import { ref, update, onValue } from "firebase/database";
import { database } from "../firebase"; // 引入 Firebase Realtime Database

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
        this.saveSelectedPetIndex(); // 保存選中的寵物索引到 Firebase
      }
    },
    addExperience(amount) {
      const selectedPet = this.selectedPet;
      selectedPet.currentExperience += amount;
      if (selectedPet.currentExperience >= selectedPet.experienceNeeded) {
        this.levelUp();
      }
      this.syncPetDataToFirebase(); // 同步更新經驗值到 Firebase
    },
    levelUp() {
      const selectedPet = this.selectedPet;
      selectedPet.level += 1;
      selectedPet.currentExperience = 0;
      selectedPet.experienceNeeded += 50;
      this.checkBreakthrough(); // 每次升級檢查是否達到突破條件
      this.syncPetDataToFirebase(); // 升級後也要同步更新到 Firebase
    },
    checkBreakthrough() {
      // 設定一個突破條件，例如當寵物達到 10 級時算作突破
      const breakthroughLevel = 10;
      const hasAnyPetBrokenThrough = this.petCollection.some(
        (pet) => pet.level >= breakthroughLevel
      );

      if (hasAnyPetBrokenThrough && !this.hasBrokenThrough) {
        // 如果有寵物達到突破條件，且還沒標記突破過，更新變數並同步到 Firebase
        this.hasBrokenThrough = true;
        this.syncBreakthroughStatus(); // 同步突破狀態
      }
    },
    syncBreakthroughStatus() {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userId = JSON.parse(storedUser).uid;
        const userRef = ref(database, `users/${userId}/hasBrokenThrough`);

        // 同步突破狀態到 Firebase
        update(userRef, {
          hasBrokenThrough: this.hasBrokenThrough,
        });
      }
    },
    updatePetCollection(petCollection) {
      this.petCollection = petCollection;
    },
    syncPetDataToFirebase() {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userId = JSON.parse(storedUser).uid;
        const userRef = ref(database, `users/${userId}/pets`);

        // 同步整個寵物集合到 Firebase
        update(userRef, {
          petCollection: this.petCollection,
        });
      }
    },
    loadSelectedPetIndex() {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userId = JSON.parse(storedUser).uid;
        const userRef = ref(database, `users/${userId}/selectedPetIndex`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            this.selectedPetIndex = data;
          }
        });
      }
    },
    saveSelectedPetIndex() {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userId = JSON.parse(storedUser).uid;
        const userRef = ref(database, `users/${userId}/selectedPetIndex`);
        update(userRef, { selectedPetIndex: this.selectedPetIndex });
      }
    },
  },
});
