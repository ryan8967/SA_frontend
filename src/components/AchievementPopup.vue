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
      <div id="particles-js"></div> <!-- 粒子效果的容器 -->
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
      this.startParticleEffect();
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
      startParticleEffect() {
        const interval = setInterval(() => {
          this.createParticlesAtRandomPosition();
        }, 100); // 每 200ms 觸發一次
  
        setTimeout(() => {
          clearInterval(interval);
        }, 5000); // 持續 5 秒
      },
      createParticlesAtRandomPosition() {
        const particlesCount = 50;
        const particlesContainer = document.getElementById('particles-js');
        if (!particlesContainer) {
          console.error('Particles container not found');
          return;
        }
  
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
  
        for (let i = 0; i < particlesCount; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.left = `${x}px`;
          particle.style.top = `${y}px`;
          particle.style.backgroundColor = this.getRandomColor(); // 設置隨機顏色
          particlesContainer.appendChild(particle);
  
          const randomX = Math.random() * 200 - 100;
          const randomY = Math.random() * 200 - 100;
  
          gsap.to(particle, {
            x: randomX,
            y: randomY,
            opacity: 0,
            duration: 2.5,
            onComplete: () => particle.remove(),
          });
        }
      },
      getRandomColor() {
            const hue = Math.floor(Math.random() * 360); // 隨機生成色相 (0-360 度)
            const saturation = 80 + Math.random() * 20; // 彩度範圍 (80%-100%)
            const lightness = 50 + Math.random() * 10; // 明度範圍 (50%-60%)
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        }

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
    max-width: 50%;
    height: auto;
    margin: 10px 10px;
  }
  
  .close-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #3498db;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .close-button:hover {
    background-color: #0056b3;
  }
  
  #particles-js {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
  }
  
  .particle {
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: #ffcc00; /* 這個會被隨機顏色覆蓋 */
    border-radius: 50%;
    pointer-events: none;
  }
  </style>
  