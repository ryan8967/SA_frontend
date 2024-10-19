<script>
import { ref, push, onValue } from "firebase/database";
import { database } from "../firebase";
import { useUserStore } from "@/stores/userStore";

export default {
    setup() {
        const userStore = useUserStore();

        // Using computed to make the data reactive
        const user = userStore.user;

        return {
            user,
        };
    },
    data() {
        return {
            newTaskDescription: "",
            newTaskUsername: "",
            newTaskTitle,
            tasks: [],
            showPopup: false // Controls the visibility of the popup modal
        };
    },
    mounted() {
        this.loadTasks();
    },
    methods: {
        addTask() {
            //const userId = JSON.parse(localStorage.getItem("user")).uid;
            //const tasksRef = ref(database, `users/${userId}/tasks`);
            const newTask = {
                
                description: this.newTaskDescription,
                username: this.user.displayName,
                published_time: new Date().toISOString().split('T')[0], // Gets the current date in yyyy-mm-dd format
                status: "not started"
            };

            // Push new task to Firebase
            push(tasksRef, newTask)
                .then(() => {
                    this.newTaskDescription = "";
                    this.newTaskUsername = "";
                    this.showPopup = false; // Hide the popup after adding task
                })
                .catch((error) => {
                    console.error("Error adding task:", error);
                });
        },
        loadTasks() {
            const userId = JSON.parse(localStorage.getItem("user")).uid;
            const tasksRef = ref(database, `users/${userId}/tasks`);

            onValue(tasksRef, (snapshot) => {
                const data = snapshot.val();
                const tasksArray = [];

                for (const key in data) {
                    tasksArray.push({
                        id: key,
                        ...data[key]
                    });
                }

                this.tasks = tasksArray;
            });
        }
    }
};
</script>