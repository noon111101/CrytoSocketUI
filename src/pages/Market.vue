<template>
  <div>
    <chat/>
    <list-product/>
    <div style="max-width: 400px">
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
    </div>

  </div>

</template>

<script>
import axios from '../http-common.js';
import $ from 'jquery';
import Chat from "../components/MessageChat.vue";
import ListProduct from "../components/product/listProduct.vue";

export default {
  name: 'Market',
  components: {ListProduct, Chat},
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
