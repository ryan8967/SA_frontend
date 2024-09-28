import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; // 如果使用 Realtime Database
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // 引入 Google 登入相關方法

// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyBv5UlN_6wbxZBLZcP13UcwM6unIixKn6I",
  authDomain: "vue-http-demo-8773a.firebaseapp.com",
  databaseURL: "https://vue-http-demo-8773a-default-rtdb.firebaseio.com",
  projectId: "vue-http-demo-8773a",
  storageBucket: "vue-http-demo-8773a.appspot.com",
  messagingSenderId: "189657556660",
  appId: "1:189657556660:web:4650bcc6ad7106bdcc59e1",
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化 Firebase 服務
const db = getFirestore(app);
const database = getDatabase(app); // 如果使用 Realtime Database
const auth = getAuth(app);

// Google 登入方法
const provider = new GoogleAuthProvider();
function signInWithGoogle() {
  return signInWithPopup(auth, provider);
}

export { db, auth, database, signInWithGoogle };
