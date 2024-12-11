<script>
export default {
    data() {
        return {
            newTaskDescription: "", // 新任務描述
            newTaskUsername: "", // 用戶名稱
            newTaskTitle: "", // 任務標題
            tasks: [], // 任務列表
            showPopup: false // 控制是否顯示新增彈窗
        };
    },
    methods: {
        addTask() {
            // 建立新任務物件
            const newTask = {
                id: Date.now(), // 使用當前時間戳作為唯一 ID
                description: this.newTaskDescription,
                username: this.newTaskUsername || "Anonymous", // 如果未提供用戶名稱，使用 "Anonymous"
                published_time: new Date().toISOString().split('T')[0], // yyyy-mm-dd 格式的日期
                status: "not started"
            };

            // 將新任務加入本地任務列表
            this.tasks.push(newTask);

            // 清空輸入欄位並隱藏彈窗
            this.newTaskDescription = "";
            this.newTaskUsername = "";
            this.showPopup = false;
        },
        loadTasks() {
            // 假設從本地存儲中載入任務
            const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
            this.tasks = storedTasks;
        }
    },
    mounted() {
        this.loadTasks(); // 頁面載入時載入任務
    },
    watch: {
        // 監控 tasks 變化並同步到本地存儲
        tasks: {
            deep: true,
            handler(newTasks) {
                localStorage.setItem("tasks", JSON.stringify(newTasks));
            }
        }
    }
};
</script>
