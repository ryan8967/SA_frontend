<template>
    <div class="popup-container" v-if="isVisible">
      <div class="popup-background" @click="closePopup"></div>
      <div class="popup-content" ref="popupContent">
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
        <img v-if="image" :src="image" alt="Achievement" class="achievement-image" />
        <br>
        <button class="close-button" @click="closePopup">完成</button>
      </div>
    </div>
  </template>
  
  <script>
  import { gsap } from "gsap";
  
  export default {
    props: {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        isVisible: true,
      };
    },
    mounted() {
      this.animatePopup();
    },
    methods: {
      animatePopup() {
        gsap.from(this.$refs.popupContent, {
          scale: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        });
        gsap.from(".popup-background", {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      },
      closePopup() {
        gsap.to(this.$refs.popupContent, {
          scale: 0,
          duration: 0.5,
          ease: "back.in(1.7)",
          onComplete: () => {
            this.isVisible = false;
            this.$emit("close");
          },
        });
        gsap.to(".popup-background", {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .popup-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .popup-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  
  .popup-content {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    z-index: 1001;
  }
  
  .achievement-image {
    max-width: 100%;
    height: auto;
    margin: 20px 0;
  }
  
  .close-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .close-button:hover {
    background-color: #0056b3;
  }
  </style>