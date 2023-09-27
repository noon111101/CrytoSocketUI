<template>
  <div>
    <input v-model="username" id="name" class="col-md-4" type="text" placeholder="your name">
    <button @click="connect" id="connect" class="col-md-1 btn btn-primary" type="button">connect</button>
    <br>
    <br>
  </div>
  <div class="row">
    <div class="col-md-8" id="chat" ref="chat"></div>
  </div>
  <div class="row">
    <input v-model="message" class="col-md-6" id="msg" type="text" placeholder="enter your message">
    <button @click="sendMessage" class="col-md-1 btn btn-primary" id="send" type="button" :disabled="!connected">send</button>
  </div>
  <h2>Đơn hàng cần bán</h2>
  <form id="orderForm">
    <!-- Trường price -->
    <div class="form-group">
      <label for="price">Giá:</label>
      <input type="number" class="form-control" v-model="orderPrice">
    </div>

    <!-- Trường name -->
    <div class="form-group">
      <label for="nameOrder">Tên sản phẩm:</label>
      <input type="text" class="form-control" v-model="orderName">
    </div>

    <!-- Trường số lượng -->
    <div class="form-group">
      <label for="quantity">Số lượng:</label>
      <input type="number" class="form-control" v-model="orderQuantity">
    </div>

    <!-- Nút Submit -->
    <button type="button" @click="createOrder(1)" class="btn btn-primary">Đặt bán</button>
  </form>
  <br/>
  <h2>Đơn hàng cần mua</h2>
  <form id="buyForm">
    <!-- Trường price -->
    <div class="form-group">
      <label for="priceBuy">Giá:</label>
      <input type="number" class="form-control" v-model="buyPrice" >
      <label>$</label>
    </div>

    <!-- Trường name -->
    <div class="form-group">
      <label for="nameBuy">Tên sản phẩm:</label>
      <input type="text" class="form-control" v-model="buyName" >
      <label>$</label>
    </div>

    <!-- Trường số lượng -->
    <div class="form-group">
      <label for="quantityBuy">Số lượng:</label>
      <input type="number" class="form-control" v-model="buyQuantity">
    </div>

    <!-- Nút Submit -->
    <button type="button" @click="createOrder(2)" class="btn btn-primary">Đặt hàng</button>
  </form>
</template>

<script>
import axios from '../http-common.js';
import $ from 'jquery';

export default {
  name: 'Chat',
  data() {
    return {
      username: localStorage.getItem('username') || '',
      userId: localStorage.getItem('userId') || '',
      connected: false,
      socket: null,
      chatMessages: '',
      message: '',
      orderPrice: '',
      orderName: '',
      orderQuantity: '',
      buyPrice: '',
      buyName: '',
      buyQuantity: '',
    };
  },
  methods: {
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

    createOrder(type) {
      let orderName;
      let price;
      let quantity;
      if (type === 1) {
        orderName = this.orderName;
        price = this.orderPrice;
        quantity = this.orderQuantity;
      } else {
        orderName = this.buyName;
        price = this.buyPrice;
        quantity = this.buyQuantity;
      }
      const orderRequest = {
        price,
        name: orderName,
        userId: this.userId,
        status: 'OPEN',
        quantity,
        type: type === 1 ? 'SELL' : 'BUY',
      };
      const socket = new WebSocket(`ws://localhost:8081/chat/${name}`);

      axios.post('/order/create', orderRequest) // Sử dụng Axios để tạo đơn hàng
          .then((response) => {
              if (this.connected) {
                socket.send(JSON.stringify(response.data)); // Gửi đơn hàng thông qua WebSocket
              }
              if (type === 1) {
                this.orderName = '';
                this.orderPrice = '';
                this.orderQuantity = '';
              } else {
                this.buyName = '';
                this.buyPrice = '';
                this.buyQuantity = '';
              }
          })
          .catch((error) => {
            console.error('Lỗi đăng nhập: ' + error.message);
          });
    },
    scrollToBottom() {
      $('#chat').scrollTop($('#chat')[0].scrollHeight);
    }
  },
  mounted() {
    this.username = localStorage.getItem('username');
    this.$nextTick(() => {
      this.connect();
    });
  }
};
</script>
<style>
#chat {
  resize: none;
  overflow: hidden;
  min-height: 300px;
  max-height: 300px;
}
</style>
