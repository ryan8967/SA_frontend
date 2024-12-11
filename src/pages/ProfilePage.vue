<template>
    <div class="profile-page">
        <div style="margin-top: 100px;"></div>
        <div v-show="achievements.length > 0" style="margin-top: 850px;"></div>

        <h1 class="title">個人資料頁面</h1>

        <!-- 初始化成就按鈕 -->
        <button @click="initializeAchievements" class="initialize-btn">Reset</button>

        <!-- 員工資訊區域 -->
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
                    <button class="pos-save-btn" @click="savePosition">儲存</button>
                </span>
            </p>
            <p><strong>生日：</strong> {{ birthdate }}</p>
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
    </div>
</template>

<script>
// import { ref, computed } from 'vue';
import AchievementPopup from '../components/AchievementPopup.vue';

export default {
    components: {
        AchievementPopup,
    },
    data() {
        return {
            userAvatar: "/default-avatar.png", // 預設頭像
            achievements: [], // 用來存儲成就資料
            diamonds: 0, // 紀錄用戶的鑽石數量
            employeeId: "123456",
            hiringDate: "2020-05-01",
            name: "catfish",
            birthdate: "1990-01-15",
            mentor: "Mentor Name",
            selectedPosition: '',
            position: null,
            allPositions: [
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
            ],
            isPopupVisible: false,
            popupTitle: '',
            popupDescription: '',
            popupImage: '',
        };
    },
    computed: {
        completedAchievements() {
            return this.achievements.filter(achievement => achievement.completed);
        },
        incompleteAchievements() {
            return this.achievements.filter(achievement => !achievement.completed);
        },
    },
    methods: {
        uploadAvatar(event) {
            const file = event.target.files[0];
            if (file) {
                this.userAvatar = URL.createObjectURL(file);
                const firstAvatarChange = this.achievements.find(ach => ach.id === 'first-avatar-change');
                if (firstAvatarChange && !firstAvatarChange.completed) {
                    this.completeAchievement(firstAvatarChange);
                }
            }
        },
        completeAchievement(achievement) {
            achievement.completed = true;
            this.diamonds += 300;
            this.isPopupVisible = true;
            this.popupTitle = `成就完成：${achievement.name}`;
            this.popupDescription = `你獲得了 300 鑽石，當前鑽石總數為：${this.diamonds}`;
            this.popupImage = achievement.icon;
        },
        initializeAchievements() {
            this.achievements = [
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
        },
        savePosition() {
            this.position = this.selectedPosition;
        },
        openLeaveCalendar() {
            alert("心理假申請的模擬窗口");
        },
    },
    mounted() {
        this.initializeAchievements();
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
    background-color: #ff5349;
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
    background-color: #ff958f;
}

.pos-save-btn:active {
    background-color: #fa9a95;
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
    padding-bottom: 40px;
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
    background-color: #ff5349;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 20px;
}

.initialize-btn:hover {
    background-color: #ec9591;
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
    background-color: #ef8a84;
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
