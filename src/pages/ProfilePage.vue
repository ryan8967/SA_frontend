<template>
    <div class="profile-page">
        <div style="margin-top: 100px;"></div>
        <div v-show="achievements.length > 0" style="margin-top: 850px;"></div>

        <h1 class="title">個人資料頁面</h1>

        <!-- 初始化成就按鈕 -->
        <button @click="initializeAchievements" class="initialize-btn">Reset</button>

        <!-- 員工資訊區域，包含頭像和更改頭像功能 -->
        <div class="employee-info">
            <h2>員工資訊</h2>

            <!-- 頭像與更改頭像功能 -->
            <div class="avatar-section">
                <label for="avatar-upload" class="avatar-label">
                    <img :src="userAvatar" alt="User Avatar" class="avatar-image" />
                    <span>更改頭像</span>
                </label>
                <input type="file" id="avatar-upload" @change="uploadAvatar" accept="image/*" class="avatar-input" />
            </div>

            <!-- 員工詳細資料 -->
            <p><strong>員工 ID：</strong> {{ employeeId }}</p>
            <p><strong>姓名：</strong> {{ name }}</p>
            <p><strong>聘用日期：</strong> {{ hiringDate }}</p>
            <p><strong>職位：</strong>
                <span v-if="position">{{ position }}</span>
                <span v-else>
                    <select v-model="selectedPosition" class="pos-select">
                        <option value="">請選擇職位</option>
                        <option v-for="pos in allPositions" :key="pos" :value="pos">{{ pos }}</option>
                    </select>
                    <button class="pos-save-btn" @click="pushPosition">儲存</button>
                </span>
            </p>
            <p><strong>生日：</strong> {{ birthdate }}</p>

            <!-- 直屬-->
            <p><strong>直屬：</strong> {{ mentor }}</p>

            <!-- 新增請心理假的按鈕 -->
            <button @click="openLeaveCalendar" class="leave-btn">💔 申請心理假 💔</button>
        </div>

        <div class="achievements">
            <h2>Achievements</h2>

            <!-- 已完成成就區塊 -->
            <div class="achievements-completed">
                <h3>已完成</h3>
                <div v-for="achievement in completedAchievements" :key="achievement.id"
                    class="achievement-item completed" @click="showAchievementDetails(achievement)">
                    <img :src="achievement.icon" :alt="achievement.description" class="achievement-icon" />
                    <p>{{ achievement.name }}</p>
                    <p>{{ achievement.description }}</p>
                </div>
                <hr />
            </div>

            <!-- 未完成成就區塊 -->
            <div class="achievements-incomplete">
                <h3>未完成</h3>
                <div v-for="achievement in incompleteAchievements" :key="achievement.id" class="achievement-item"
                    @click="completeAchievement(achievement)">
                    <img :src="achievement.icon" :alt="achievement.description"
                        :class="{ 'incomplete-icon': !achievement.completed }" class="achievement-icon" />
                    <p>{{ achievement.name }}</p>
                    <p>{{ achievement.description }}</p>
                </div>
                <hr />
            </div>
        </div>
        <AchievementPopup v-if="isPopupVisible" :title="popupTitle" :description="popupDescription" :image="popupImage"
            @close="isPopupVisible = false" />
        <div v-if="showDialog" class="dialog-overlay">
            <div class="dialog">
                <p>{{ dialogContent }}</p>
                <button @click="closeDialog">關閉</button>
            </div>
        </div>

        <!-- 心理假日期選擇彈窗 -->
        <div v-if="showCalendar" class="calendar-overlay">
            <div class="calendar-dialog">
                <input type="date" v-model="leaveDate" class="calendar-input" />
                <button @click="submitLeaveRequest" class="calendar-submit-btn">送出申請</button>
                <button @click="closeCalendar" class="calendar-close-btn">取消</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'; // 確保引入 onMounted
import { ref as firebaseRef, update, onValue, set } from 'firebase/database'; // 引入 Firebase 相關 API
import { database } from '@/firebase'; // 引入初始化的 Firebase 服務
import AchievementPopup from '../components/AchievementPopup.vue';
export default {
    components: {
        AchievementPopup,
    },
    data() {
        return {
            selectedPosition: '', // 用來暫存選擇的職位
            position: null, // 用來顯示職位
        };
    },
    mounted() {
        const userId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).uid : null;
        if (userId) {
            const userPosRef = firebaseRef(database, `users/${userId}/position`);
            onValue(userPosRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    this.position = data;
                    this.selectedPosition = data;
                }
                // console.log('職位資料已載入：', data);
            });
        }
    },
    setup() {
        const userAvatar = ref("/default-avatar.png"); // 預設頭像
        const achievements = ref([]); // 用來存儲成就資料
        const diamonds = ref(0); // 紀錄用戶的鑽石數量
        const position = ref(null); // 用戶的職位
        const popupTitle = ref('');
        const popupDescription = ref('');
        const popupImage = ref('');
        const isPopupVisible = ref(false);
        // 員工資料，寫死在前端
        const employeeId = ref("123456"); // 6 位數的員工ID
        const hiringDate = ref("2020-05-01"); // 聘用日期
        const name = ref("John Doe"); // 員工姓名
        const birthdate = ref("1990-01-15"); // 員工生日

        const allPositions = [
            'Software Engineer',
            'Frontend Engineer',
            'Backend Engineer',
            'Full Stack Engineer',
            'DevOps Engineer',
            'Data Engineer',
            'Machine Learning Engineer',
            'AI Engineer',
            'Cloud Engineer',
            'Security Engineer'
        ];
        // 新增直屬
        const mentor = ref("Mentor Name"); // 直屬姓名

        const completedAchievements = computed(() =>
            achievements.value.filter(achievement => achievement.completed)
        );
        const incompleteAchievements = computed(() =>
            achievements.value.filter(achievement => !achievement.completed)
        );

        const showDialog = ref(false);
        const dialogContent = ref("");

        // 心理假相關狀態
        const showCalendar = ref(false);
        const leaveDate = ref(null);

        // 初始化 Firebase 上的用戶數據，包含鑽石數量
        const initializeUserData = (userId) => {
            const userRef = firebaseRef(database, `users/${userId}`);
            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    diamonds.value = data.diamonds || 0; // 獲取當前鑽石數量
                    position.value = data.position || null; // 獲取職位資料
                }
            });
        };

        // 更換頭像及完成成就
        const uploadAvatar = async (event) => {
            const file = event.target.files[0];
            if (file) {
                userAvatar.value = URL.createObjectURL(file);
                const firstAvatarChange = achievements.value.find((achievement) => achievement.id === 'first-avatar-change');
                if (firstAvatarChange && !firstAvatarChange.completed) {
                    firstAvatarChange.completed = true;
                    completeAchievement(firstAvatarChange); // 完成成就
                }
            }
        };

        // 完成成就後，增加 300 鑽石
        const completeAchievement = async (achievement) => {
            achievement.completed = true;
            updateAchievements(); // 更新成就狀態

            // 在現有鑽石基礎上增加 300 鑽石
            diamonds.value += 300;
            await updateFirebaseDiamonds(); // 將變更同步至 Firebase
            // alert(`成就完成！你獲得了 300 鑽石，當前鑽石總數為：${diamonds.value}`);
            popupTitle.value = "成就完成：" + achievement.name;
            popupDescription.value = "你獲得了 300 鑽石，當前鑽石總數為：" + diamonds.value;
            popupImage.value = achievement.icon;
            isPopupVisible.value = true;

        };

        // 更新 Firebase 上的鑽石數量
        const updateFirebaseDiamonds = async () => {
            const userId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).uid : null;
            if (userId) {
                const userRef = firebaseRef(database, `users/${userId}`);
                await update(userRef, {
                    diamonds: diamonds.value, // 更新鑽石數量
                });
                console.log('鑽石數量已更新至 Firebase:', diamonds.value);
            }
        };

        // 更新成就資料
        const updateAchievements = () => {
            achievements.value = [...achievements.value];
        };

        // 初始化按鈕：初始化成就
        const initializeAchievements = () => {
            const defaultAchievements = [
                {
                    id: 'login-three-times',
                    name: '登入三次',
                    description: '登入三次的成就',
                    completed: false,
                    icon: 'badge/login-three-times-badge.png',
                },
                {
                    id: 'first-avatar-change',
                    name: '第一次換頭像',
                    description: '首次更換頭像的成就',
                    completed: false,
                    icon: 'badge/firstTime.webp',
                },
                {
                    id: 'employee-of-the-year',
                    name: '年度最佳員工',
                    description: '獲得年度最佳員工的成就',
                    completed: false,
                    icon: 'badge/employOfTheYear.png',
                }
            ];

            achievements.value = defaultAchievements;
            alert("成就資料初始化完成！");
        };

        const showAchievementDetails = (achievement) => {
            dialogContent.value = (achievement.description || achievement.name) + '\n可兌換300鑽石';
            showDialog.value = true;
        };

        const closeDialog = () => {
            showDialog.value = false;
        };

        // 申請心理假功能
        const openLeaveCalendar = () => {
            showCalendar.value = true;
        };

        const closeCalendar = () => {
            showCalendar.value = false;
        };

        const submitLeaveRequest = () => {
            if (leaveDate.value) {
                alert(`心理假申請已送出，選擇的日期為：${leaveDate.value}，請等待管理員批准。`);
                showCalendar.value = false;
            } else {
                alert("請選擇一個日期。");
            }
        };

        // 初始化用戶數據，獲取當前的鑽石數量
        onMounted(() => {
            const userId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).uid : null;
            if (userId) {
                initializeUserData(userId);
            }
        });

        return {

            userAvatar,
            employeeId,
            hiringDate,
            name,
            birthdate,
            mentor, // 新增直屬
            allPositions, // 新增職位選項
            achievements,
            completedAchievements,
            incompleteAchievements,
            diamonds,
            uploadAvatar,
            showDialog,
            dialogContent,
            showAchievementDetails,
            closeDialog,
            initializeAchievements,
            completeAchievement,
            openLeaveCalendar, // 開啟心理假日曆選擇
            closeCalendar, // 關閉心理假日曆選擇
            submitLeaveRequest, // 提交心理假申請
            showCalendar,
            leaveDate,
            isPopupVisible,
            popupTitle,
            popupDescription,
            popupImage,

        };
    },
    methods: {
        pushPosition() {
            const userId = JSON.parse(localStorage.getItem("user")).uid;
            if (userId) {
                const userPosRef = firebaseRef(database, `users/${userId}/position`);
                this.selectedPosition;
                set(userPosRef, this.selectedPosition)
                    .then(() => {
                        console.log("Position updated successfully!");
                        this.position = this.selectedPosition;
                    })
                    .catch((error) => {
                        console.error("Error updating position:", error);
                        alert("Error updating position. Please try again later.");
                    });
            }
        },
    },
};
</script>

<style scoped>
.profile-page {
    padding: 20px;
    margin-top: 40px;
    /* 加入 margin-top，確保整個頁面向下平移 */
}

.employee-info p {
    text-align: left;
}

/* button 樣式 */
.pos-save-btn {
    background-color: #3498db;
    color: #fff;
    border: none;
    padding: 3px 15px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.pos-save-btn:hover {
    background-color: #2980b9;
}

.pos-save-btn:active {
    background-color: #217dbb;
    transform: scale(0.98);
}

.pos-save-btn:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
}

.avatar-section {
    margin-bottom: 20px;
}

.avatar-label {
    cursor: pointer;
}

.avatar-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ccc;
}

.achievements {
    margin-top: 20px;
}

.achievements-completed,
.achievements-incomplete {
    margin-bottom: 20px;
}

.achievements-list {
    display: flex;
    flex-wrap: wrap;
}

.achievement-item {
    margin: 10px;
    text-align: center;
    cursor: pointer;
}

.achievement-icon {
    width: 150px;
    height: 150px;
}

.completed {
    opacity: 1;
}

.incomplete-icon {
    opacity: 0.4;
    /* 未完成成就的圖標顏色較淺 */
}

.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.dialog {
    background: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.initialize-btn {
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 20px;
}

.initialize-btn:hover {
    background-color: #2980b9;
}

/* 員工資料樣式 */
.employee-info {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
    text-align: center;
    /* 中心對齊員工資訊 */
}

.employee-info .avatar-section {
    margin-bottom: 10px;
}

.leave-btn {
    padding: 10px 20px;
    background-color: #3f1510;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 15px;
}

.leave-btn:hover {
    background-color: #c0392b;
}

.calendar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.calendar-dialog {
    background: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    text-align: center;
}

.calendar-input {
    margin-bottom: 15px;
    padding: 10px;
    font-size: 16px;
}

.calendar-submit-btn {
    padding: 10px 20px;
    background-color: #27ae60;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-right: 10px;
}

.calendar-submit-btn:hover {
    background-color: #219150;
}

.calendar-close-btn {
    padding: 10px 20px;
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

.calendar-close-btn:hover {
    background-color: #c0392b;
}
</style>
