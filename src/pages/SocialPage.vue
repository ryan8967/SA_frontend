<template>
    <div class="club-list">
        <div v-for="(club, index) in clubs" :key="index" class="club-item">
            <h2>{{ club.title }}</h2>
            <p>{{ club.description }}</p>

            <button @click="joinClub(club)">
                <p><font-awesome-icon :icon="['fas', 'user']" class="icon" /> {{ club.members }}</p>加入
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            clubs: [
                {
                    title: "設計社",
                    description: "設計愛好者的社團，專注於平面設計、UI設計等。",
                    members: 120,
                },
                {
                    title: "程式設計社",
                    description: "為程式開發者提供討論和學習的平台。",
                    members: 200,
                },
                {
                    title: "攝影社",
                    description: "攝影愛好者的聚集地，分享攝影技巧與作品。",
                    members: 85,
                },
                {
                    title: "音樂社",
                    description: "熱愛音樂的人們可以在這裡分享和學習音樂。",
                    members: 150,
                },
                {
                    title: "書法社",
                    description: "專注於書法藝術的傳統社團。",
                    members: 70,
                },
                {
                    title: "籃球社",
                    description: "喜愛籃球運動的成員們可以在此進行交流和比賽。",
                    members: 110,
                },
                {
                    title: "舞蹈社",
                    description: "舞蹈愛好者的聚集地，分享舞蹈表演和技巧。",
                    members: 95,
                },
                {
                    title: "登山社",
                    description: "為喜歡登山和探險的人們提供活動和分享。",
                    members: 50,
                },
                {
                    title: "劇社",
                    description: "熱愛戲劇表演的人們在這裡學習和創作。",
                    members: 65,
                },
                {
                    title: "讀書會",
                    description: "書籍愛好者的社團，共同閱讀和討論各類書籍。",
                    members: 130,
                },
            ],
        };
    },
    methods: {
        joinClub(club) {
            alert(`你已經加入了 ${club.title}`);
        },
    },
};
</script>

<style scoped>
.club-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 10px;
    background-color: #f9f9f9;
    /* 背景保持淡雅 */
}

.club-item {
    padding: 20px;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    /* 加入陰影讓卡片浮現 */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.club-item:hover {
    transform: translateY(-5px);
    /* 鼠標懸停時微微提升 */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    /* 提升陰影強度 */
}

h2 {
    font-size: 1.6em;
    color: #333;
    /* 加強標題顏色對比 */
    margin-bottom: 10px;
    font-weight: bold;
}

p {
    font-size: 1em;
    color: #666;
    /* 描述文字保持輕盈的灰色 */
    margin-bottom: 10px;
    line-height: 1.5;
}

/* 按鈕樣式 */
button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #ff6f61;
    /* 使用柔和且醒目的按鈕顏色 */
    color: #fff;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s ease;
    width: 100%;
    text-align: center;
}

button:hover {
    background-color: #ff3d30;
    /* 懸停時按鈕顏色加深 */
}

button p {
    margin: 0;
    display: flex;
    align-items: center;
    font-size: 1em;
    color: #fff;
    /* 設置人數為白色 */
}

button p .icon {
    margin-right: 8px;
    color: #fff;
    /* 設置圖標為白色 */
}

button span {
    font-weight: bold;
}

@media (max-width: 600px) {
    .club-item {
        padding: 15px;
    }

    h2 {
        font-size: 1.4em;
    }

    p {
        font-size: 0.9em;
    }

    button {
        padding: 8px 16px;
    }
}
</style>