import { createRouter, createWebHistory } from "vue-router";

// 頁面組件導入
// import WelcomePage from "@/pages/WelcomePage.vue";
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
  { path: "/", name: "Main", component: MainPage },
  { path: "/main", name: "Main", component: MainPage },
  { path: "/pet", name: "Pet", component: PetPage },
  { path: "/shop", name: "Shop", component: ShopPage },
  { path: "/task", name: "Task", component: TaskPage },
  { path: "/newtask", name: "NewTask", component: New1TaskPage },
  { path: "/profile", name: "Profile", component: ProfilePage },
  { path: "/test", name: "Test", component: Testing1Page },
  { path: "/test2", name: "Test2", component: New2TaskPage },
  { path: "/testpopup", name: "TestPopup", component: TestPopup },
  { path: "/social", name: "Social", component: SocialPage },
  { path: "/render", name: "Render", component: RenderTest },
  { path: "/learn", name: "Learn", component: FlashcardPage },
  { path: "/card", name: "Card", component: CardAddPage },
  { path: "/all", name: "All", component: GetAllCards },
  { path: "/chatbot", name: "ChatBot", component: ChatBot },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 可選的簡單驗證守衛
// router.beforeEach((to, from, next) => {
//   const user = JSON.parse(localStorage.getItem("user")); // 使用 localStorage 模擬驗證
//   if (to.matched.some((record) => record.meta.requiresAuth) && !user) {
//     next("/");
//   } else {
//     next();
//   }
// });

export default router;
