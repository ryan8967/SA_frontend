import { createApp } from "vue";
import App from "./App.vue";
import "./firebase"; // 確保你的 Firebase 初始化檔案被載入
import router from "./router"; // 引入 router
import { createPinia } from "pinia";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPaw,
  faTasks,
  faHome,
  faStore,
  faUser,
  faCoins, // 新增金錢圖標
  faGem, // 新增鑽石圖標
  faPlus,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// 將圖標添加到庫中
// library.add(
//   faPaw,
//   faTasks,
//   faHome,
//   faStore,
//   faUser,
//   faCoins,
//   faGem,
//   faUsers, // 如果偏向社群
//   faComments, // 如果偏向互動
//   faHandshake, // 如果偏向合作活動
//   faCalendarCheck, // 如果代表已計劃的活動
//   faBullhorn, // 如果偏向公告活動
//   faEnvelope, // 用於邀請或通知
//   faPlus,
// );
library.add(faPaw, faTasks, faHome, faStore, faUser, faCoins, faGem, faUsers,faPlus);

const app = createApp(App);
const pinia = createPinia();
// 全局註冊 FontAwesomeIcon 組件
app.component("font-awesome-icon", FontAwesomeIcon);

// 使用 router
app.use(router);
app.use(pinia);
// 最後一次 mount 應用
app.mount("#app");
