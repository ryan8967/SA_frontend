<template>
    <div class="chat-container">
      <h1 class="chat-header">AI助教</h1>
      <div class="chat-window">
        <div
          v-for="(message, index) in chatHistory"
          :key="index"
          :class="['message', message.role === 'user' ? 'user-message' : 'bot-message']"
          v-html="message.role === 'bot' ? parseMarkdown(message.content) : message.content"
        ></div>
      </div>
      <div class="input-container">
        <input
          type="text"
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="Type your message..."
          class="chat-input"
        />
        <button @click="sendMessage" class="send-button">Send</button>
      </div>
      <br>
      <div v-if="canDownload" class="button-container">
        <router-link :to="{ path: '/download', query: { formname: 'travelform', userid: 3, extra1: extra1 } }" class="button">
          <button class="send-button">Download PDF</button>
        </router-link>
      </div>
    </div>
    <button @click="canDownload = !canDownload">Toggle Download Button</button>
  </template>
  
  <script>
  import { OpenAI } from 'openai'; // Import OpenAI if required
  import { marked } from 'marked'; // Import the marked library
  
  export default {
    name: 'ChatBotView',
    data() {
      return {
        userInput: '',
        chatHistory: [],
        extra1: '若因天候因素無法出團，本公司將退部分費用',
        canDownload: false,
      };
    },
    methods: {
      async sendMessage() {
        if (this.userInput.trim() === '') return;
  
        this.chatHistory.push({ role: 'user', content: this.userInput });
        await this.getMessageFromChatGPT();
        this.userInput = '';
      },
  
      async getMessageFromChatGPT() {
        let kkk = "c2stM1VhNDUwUHhhdjNnVVNNLUNmSHVTQ25ySUI3YUZGZjU1d0RRaE92SEZSVDNCbGJrRkowUkVpazRGWmN3QnIwZXIyX2xUU1BsbWV5dFZzQWpnYmpNS1puLVRfNEE=";
        const decodedStr = atob(kkk);
  
        const openai = new OpenAI({
          apiKey: decodedStr,
          dangerouslyAllowBrowser: true,
        });
  
        try {
          const thread = await openai.beta.threads.create();
          let prompt = this.userInput;
          let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: "asst_zWOp5IfAxlTOJ61PQrcRLEQr",
            instructions: prompt
          });
  
          if (run.status === "completed") {
            const messages = await openai.beta.threads.messages.list(run.thread_id);
            const botResponse = messages.data.reverse()[0].content[0].text.value;
            this.chatHistory.push({ role: 'bot', content: botResponse });
          } else {
            this.chatHistory.push({ role: 'bot', content: 'Error: Unable to fetch response.' });
          }
        } catch (error) {
          console.error('Error fetching response:', error);
          this.chatHistory.push({ role: 'bot', content: 'Error: Unable to fetch response.' });
        }
      },
  
      parseMarkdown(content) {
        return marked(content);
      },
    },
  };
  </script>

<style>
.chat-container {
  display: flex;
  flex-direction: column;
  /*justify-content: center;*/
  align-items: center;
  height: 100vh;
  background-color: #ffffff;
  color: #ffffff;
  width: 100%;

  /* padding: 20px; */
}

.chat-header {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #221e1e;
}

.chat-window {
  width: 90%;
  /*max-width: 600px;*/
  height: 400px;
  border: 1px solid #c1c1c1;
  border-radius: 8px;
  background-color: #e9e4e4;
  padding: 15px;
  overflow-y: scroll;
  margin-bottom: 20px;
  
}

/* .message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
  max-width: 80%;
  word-wrap: break-word;
}

.user-message {
  align-self: flex-end;
  background-color: #4a90e2;
  color: #ffffff;
}

.bot-message {
  align-self: flex-start;
  background-color: #3b3b3b;
  color: #ffffff;
} */

.message {
  /* display: flex; */
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
  max-width: 80%;
  word-wrap: break-word;
}
/* 
.user-message {
  justify-content: flex-end;
  align-self: flex-end;
  background-color: #4a90e2;
  color: #ffffff;
  margin-left: auto; 
}
 */

.user-message {
  justify-content: flex-end;
  /* display: inline-block; */
  align-self: flex-end;
  background-color: #00bcd4;
  color: #ffffff;
  margin-left: auto; /* Aligns the message to the right */
  max-width: 60%; /* Limit the maximum width */
  padding: 10px;
  border-radius: 8px;
  word-break: break-word; /* Allows long words to wrap */
  white-space: normal; /* Normal white space handling */
}

.bot-message {
  justify-content: flex-start; 
  align-self: flex-start;
  background-color: #4a90e2;
  color: #ffffff;
  margin-right: auto; 
  /* white-space: pre-wrap;
  word-break: break-word;  */
}



.input-container {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 600px;
}

.chat-input {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #b5b5b5;
  background-color: #d2d2d2;
  color: #000000;
  margin-right: 10px;
}

.chat-input::placeholder {
  color: #676767;
}

.send-button {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background-color: #00bcd4;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.send-button:hover {
  background-color: #357ab7;
}

/* 保留之前的樣式並增加檔案上傳按鈕的樣式 */

</style>