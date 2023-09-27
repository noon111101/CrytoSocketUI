<template>
  <button class="open-button" @click="openForm">Chat</button>
  <div class="chat-popup" id="myForm">
    <div id="chat" ref="chat"></div>
    <form class="form-container">
      <h1>Chat</h1>
      <label for="msg"><b>Message</b></label>
      <input placeholder="Type message.." name="msg" v-model="message" required>
      <button type="button" @click="sendMessage" class="btn" :disabled="!connected">Send</button>
      <button type="button" class="btn cancel" @click="closeForm">Close</button>
    </form>
  </div>
</template>
<script>
import $ from "jquery";
import axios from "../http-common.js";

export default {
  name: 'Chat',
  data() {
    return {
      username: localStorage.getItem('username') || '',
      userId: localStorage.getItem('userId') || '',
      connected: false,
      message:null
    };
  },
  methods:{
    openForm() {
      document.getElementById("myForm").style.display = "block";
    },
    closeForm() {
      document.getElementById("myForm").style.display = "none";
    },
    connect() {
      if (!this.connected) {
        const name = this.username;
        const socket = new WebSocket(`ws://localhost:8081/chat/${name}`);

        // Xử lý sự kiện khi kết nối thành công
        socket.onopen = () => {
          this.connected = true;
          this.message = ''; // Xóa nội dung tin nhắn sau khi kết nối thành công
          $("#msg").focus();
        };

        // Xử lý sự kiện khi nhận tin nhắn từ server
        socket.onmessage = (event) => {
          const data = event.data;
          if (!data.includes('{')) {
            $("#chat").append(data + "<br>");
            this.scrollToBottom();
          } else {
            const colonIndex = data.indexOf(':');
            if (colonIndex !== -1) {
              const jsonPart = data.substr(colonIndex + 1).trim();
              const parsedData = JSON.parse(jsonPart);
              console.log(parsedData);
              const { name, price, status, quantity, type } = parsedData;

              // Tạo một đối tượng DOM div mới để hiển thị thông tin phiếu
              const $orderDiv = document.createElement('div');
              $orderDiv.classList.add('order');
              $orderDiv.innerHTML = `
            <h2>Phiếu ${type} </h2>
            <p><strong>Tên hàng:</strong> ${name}</p>
            <p><strong>Giá:</strong> ${price} $</p>
            <p><strong>Trạng thái:</strong> ${status}</p>
            <p><strong>Số lượng:</strong> ${quantity}</p>
          `;

              // Thêm div phiếu vào vùng hiển thị cuộc trò chuyện
              $("#chat").append($orderDiv);
              this.scrollToBottom();
            }
          }
        };
      }
    },

    sendMessage() {
      if (this.connected) {
        const value = this.message;
        const username = this.username;
        const message = {
          message: value,
          username,
        };
        axios.post('/send/request', message) // Sử dụng Axios để gửi tin nhắn đến Kafka
            .then((response) => {
              this.message = ''; // Xóa nội dung tin nhắn sau khi gửi
            })
            .catch((error) => {
              console.error('Lỗi khi gửi tin nhắn: ' + error.message);
            });
      }
    },
  },
  mounted() {
    this.username = localStorage.getItem('username');
    this.$nextTick(() => {
      this.connect();
    });
  }
}
</script>
<style scoped>
/* Button used to open the chat form - fixed at the bottom of the page */
.open-button {
  background-color: #555;
  color: white;
  padding: 16px 20px;
  border: none;
  cursor: pointer;
  opacity: 0.8;
  position: fixed;
  bottom: 23px;
  right: 28px;
  width: 280px;
}

/* The popup chat - hidden by default */
.chat-popup {
  display: none;
  position: fixed;
  bottom: 0;
  right: 15px;
  border: 3px solid #f1f1f1;
  z-index: 9;
}

/* Add styles to the form container */
.form-container {
  max-width: 300px;
  padding: 10px;
  background-color: white;
}

/* Full-width textarea */
.form-container textarea {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  border: none;
  background: #f1f1f1;
  resize: none;
  min-height: 200px;
}

/* When the textarea gets focus, do something */
.form-container textarea:focus {
  background-color: #ddd;
  outline: none;
}

/* Set a style for the submit/send button */
.form-container .btn {
  background-color: #04AA6D;
  color: white;
  padding: 16px 20px;
  border: none;
  cursor: pointer;
  width: 100%;
  margin-bottom:10px;
  opacity: 0.8;
}

/* Add a red background color to the cancel button */
.form-container .cancel {
  background-color: red;
}

/* Add some hover effects to buttons */
.form-container .btn:hover, .open-button:hover {
  opacity: 1;
}
</style>