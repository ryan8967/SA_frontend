import { createRouter, createWebHistory } from "vue-router";
import WelcomePage from "@/pages/WelcomePage.vue";
import MainPage from "@/pages/MainPage.vue";
import PetPage from "@/pages/PetPage.vue";
import ShopPage from "@/pages/ShopPage.vue";
import TaskPage from "@/pages/TaskPage.vue";
import ProfilePage from "@/pages/ProfilePage.vue";
import New1TaskPage from "@/pages/New1TaskPage.vue";
import Testing1Page from "@/pages/Testing1Page.vue";
import TestPopup from "@/pages/TestPopup.vue";
import SocialPage from "@/pages/SocialPage.vue";

import New2TaskPage from "@/pages/New2TaskPage.vue";
import RenderTest from "@/pages/RenderTest.vue";

import FlashcardPage from "@/pages/FlashcardPage.vue";

import CardAddPage from "@/pages/CardAddPage.vue";
import GetAllCards from "@/pages/GetAllCards.vue";

import ChatBot from "@/pages/ChatBot.vue";


const routes = [
  {
    path: "/",
    name: "Welcome",
    component: WelcomePage,
  },
  {
    path: "/main",
    name: "Main",
    component: MainPage,
    meta: { requiresAuth: true }, // 需要登入的頁面
  },
  {
    path: "/pet",
    name: "Pet",
    component: PetPage,
    meta: { requiresAuth: true }, // 需要登入的頁面
  },
  {
    path: "/shop",
    name: "Shop",
    component: ShopPage,
    meta: { requiresAuth: true }, // 需要登入的頁面
  },
  {
    path: "/task",
    name: "Task",
    component: TaskPage,
    meta: { requiresAuth: true }, // 需要登入的頁面
  },
  {
    path: "/newtask",
    name: "NewTask",
    component: New1TaskPage,
    meta: { requiresAuth: true }, // 需要登入的頁面
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfilePage,
    meta: { requiresAuth: true }, // 需要登入的頁面
  },
  {
    path: "/test",
    name: "test",
    component: Testing1Page,
    meta: { requiresAuth: true }, // 需要登入的頁面
  },
  {
    path: "/test2",
    name: "test2",
    component: New2TaskPage,
    meta: { requiresAuth: true }, // 需要登入的頁面
  },
  {
    path: "/testpopup",
    name: "testpopup",
    component: TestPopup,
    meta: { requiresAuth: true },
  },
  {
    path: "/social",
    name: "Social",
    component: SocialPage,
    meta: { requiresAuth: true }, // 需要登入的頁面
  },
  {
    path: "/render",
    name: "Render",
    component: RenderTest,
    //meta: { requiresAuth: true }, // 需要登入的頁面
  },
  {
    path: "/learn",
    name: "learn",
    component: FlashcardPage,
    //meta: { requiresAuth: true }, // 需要登入的頁面
  },
  {
    path: "/card",
    name: "Card",
    component: CardAddPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/all",
    name: "All",
    component: GetAllCards,
    //meta: { requiresAuth: true },
  },
  {
    path: "/chatbot",
    name: "All",
    component: ChatBot,
    //meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守衛：未登入時重定向到歡迎頁面
// router.beforeEach((to, from, next) => {
//   const user = JSON.parse(localStorage.getItem("user")); // 簡單模擬驗證
//   if (to.matched.some((record) => record.meta.requiresAuth) && !user) {
//     next("/");
//   } else {
//     next();
//   }
// });

export default router;
