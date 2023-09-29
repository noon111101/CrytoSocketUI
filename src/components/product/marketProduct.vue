<template>
  <div >
    <div class="position-relative">
      <h1>{{product.symbol}}</h1>
      <div>{{product.companyName}}</div>
      <span class="position-absolute top-50 end-0">Số dư : {{userBalance}}$</span>
    </div>

    <div class="d-flex flex-row">
      <div class="col mx-2 my-2">{{product.currentPrice*(100+product.change)/100 +'$'}}</div>
      <div class="col mx-2 my-2">{{product.currentPrice +'$'}}</div>
      <div class="col mx-2 my-2">{{product.marketCap}}</div>
      <div class="col mx-2 my-2">{{product.peRatio}}</div>
    </div>
    <h1 class="mt-4">Đơn giá</h1>

    <div class="d-flex flex-row mt-4">
      <el-table :data="tableBuy" stripe style="width: 100%">
        <el-table-column label="Khối lượng" width="180">
          <template #default="scope">
            <div style="display: flex; align-items: center ; float: left" >
              <div class="border-end">{{scope.$index +1}}</div>
              <div class="mx-2 my-2">{{scope.row.quantity}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Mua" header-align="right" align="right" >
          <template #default="scope">
              <div>{{scope.row.price + '$'}}</div>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="tableSell"  stripe style="width: 100%">
        <el-table-column  label="Bán">
        <template #default="scope">
            <div>{{scope.row.price + '$'}}</div>
        </template>
        </el-table-column>
        <el-table-column label="Khối lượng" width="180" header-align="right">
          <template #default="scope">
            <div style="display: flex; align-items: center;float: right">
              <div class="mx-2 my-2">{{scope.row.quantity}}</div>
              <div class="border-start">{{scope.$index +1}}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <h1 class="my-3">Khối lượng và thời gian</h1>
    <div class="d-flex flex-row">
      <div class="col mx-2 my-2">
        <div class="mx-2 my-2">Lịch sử khớp</div>
        <div class="mx-2 my-2" v-for="(l,index) in tableLog" :key="index">
          <div :style="{ color: l.typeClose === 'BUY' ? 'green' : 'red' }">
            <span class="mx-2">Người mua : {{l.buyUserName}}</span>
            <span class="mx-2">Thời gian : {{l.matchTime}}</span>
            <span class="mx-2 ">Giá : {{l.price}}$</span>
            <span class="mx-2 ">Khối lượng : {{l.quantity}}</span>
            <span class="mx-2 ">{{l.typeClose}}</span>
            <span class="mx-2">Người bán : {{l.sellUserName}}</span>
          </div>
        </div>
      </div>
  </div>
    <div class="mt-5">
      <el-button @click="showBuyPopup" round style="background-color:#04AA6D;color: white;width: 100px" size="large" >Mua</el-button>
      <el-button @click="showSellPopup" round style="background-color:#fc5252;color: white;width: 100px" size="large">Bán</el-button>
    </div>
    <el-dialog title="Mua" v-model="buyPopupVisible"  :before-close="closeBuyPopup">
      <form id="buyForm">
        <!-- Trường price -->
        <div class="form-group mb-3">
          <label for="priceBuy">Giá:</label>
          <input type="number" class="form-control" v-model="buyPrice" >
        </div>


        <!-- Trường số lượng -->
        <div class="form-group mb-3">
          <label for="quantityBuy">Số lượng:</label>
          <input type="number" class="form-control" v-model="buyQuantity">
        </div>

        <!-- Nút Submit -->
        <button type="button" @click="createOrder(2)" class="btn btn-primary">Đặt hàng</button>
      </form>
    </el-dialog>
    <el-dialog title="Bán" v-model="sellPopupVisible"  :before-close="closeSellPopup">
      <form id="orderForm">
        <!-- Trường price -->
        <div class="form-group mb-3">
          <label for="price">Giá:</label>
          <input type="number" class="form-control" v-model="orderPrice">
        </div>



        <!-- Trường số lượng -->
        <div class="form-group mb-3">
          <label for="quantity">Số lượng:</label>
          <input type="number" class="form-control" v-model="orderQuantity">
        </div>

        <!-- Nút Submit -->
        <button type="button" @click="createOrder(1)" class="btn btn-primary">Đặt bán</button>
      </form>
    </el-dialog>
  </div>
</template>
<script>
import productService from "../../service/product-service.js";
import $ from "jquery";
import axios from "../../http-common.js";
import OrderService from "../../service/order-service.js";
import authenService from "../../service/authen-service.js";

export default {
  name : 'marketProduct',
  data(){
    return{
      product: [],
      connected: false,
      connectedLog: false,
      userBalance:null,
      username:null,
      tableBuy: [],
      tableSell: [],
      tableLog: [],
      buyPopupVisible: false,
      sellPopupVisible: false,
      orderPrice: '',
      orderName: '',
      orderQuantity: '',
      buyPrice: '',
      buyName: '',
      buyQuantity: '',
      productId: '',
      userId: '',
    }
  },
  methods: {
    async getProductsById() {
      productService.get(this.$route.params.id)
        .then((response) => {
          this.product = response.data;
          console.log(this.product)
        })
        .catch((e) => {
          console.log(e);
        });
    },
    connectOrderSocket() {
      if (!this.connected) {
        const name = this.username;
        const socket = new WebSocket(`ws://localhost:8080/order/${name}`);

        // Xử lý sự kiện khi kết nối thành công
        socket.onopen = () => {
          this.connected = true;
        };

        // Xử lý sự kiện khi nhận tin nhắn từ server
        socket.onmessage = (event) => {
          const parsedData = JSON.parse(event.data);
          console.log(parsedData);
          const data = {
            price: parsedData.price,
            quantity: parsedData.quantity,
            type: parsedData.type
          }
          if(parsedData.type === 'BUY'){
            if(this.tableBuy.length < 3)
              this.tableBuy.push(data)
            else {
              this.tableBuy.pop()
              this.tableBuy.push(data)
            }
          }
          else {
            if(this.tableSell.length < 3)
              this.tableSell.push(data)
            else {
              this.tableSell.pop()
              this.tableSell.push(data)
            }
          }
        }
      }
    },
    connectLogSocket() {
      if (!this.connected) {
        const name = this.username;
        const socket = new WebSocket(`ws://localhost:8080/orderLog/${name}`);

        // Xử lý sự kiện khi kết nối thành công
        socket.onopen = () => {
          this.connectedLog = true;
        };

        // Xử lý sự kiện khi nhận tin nhắn từ server
        socket.onmessage = async (event) => {
          const parsedData = JSON.parse(event.data);
          console.log(parsedData);
          await this.tableLog.push(parsedData);
          this.loadTableOrder()
          this.getCurrentUser()
        }
      }
    },
    showBuyPopup() {
      this.buyPopupVisible = true;
    },
    closeBuyPopup() {
      this.buyPopupVisible = false;
    },
    showSellPopup() {
      this.sellPopupVisible = true;
    },
    closeSellPopup() {
      this.sellPopupVisible = false;
    },
    createOrder(type) {
      let price;
      let quantity;
      if (type === 1) {
        price = this.orderPrice;
        quantity = this.orderQuantity;
      } else {
        price = this.buyPrice;
        quantity = this.buyQuantity;
      }
      const orderRequest = {
        price,
        userId: this.userId,
        status: 'OPEN',
        quantity,
        productId : Number(this.productId),
        type: type === 1 ? 'SELL' : 'BUY',
      };

      axios.post('/order/create', orderRequest) // Sử dụng Axios để tạo đơn hàng
          .then((response) => {
            this.$notify.success({
              title: 'Thành công',
              message: 'Tạo đơn hàng thành công',
            });
            if (type === 1) {
              this.orderPrice = '';
              this.orderQuantity = '';
            } else {
              this.buyPrice = '';
              this.buyQuantity = '';
            }
            this.closeBuyPopup()
            this.closeSellPopup()
          })
          .catch((error) => {
            this.$notify.error({
              title: 'Lỗi',
              message: 'Tạo đơn hàng thất bại',
            })
            console.error('Lỗi đăng nhập: ' + error.message);
          });
    },
    loadTableOrder(){
      OrderService.findListBuyOrderOpenByProductId(this.productId).then((response) => {
        this.tableBuy = response.data;
      })
      OrderService.findListSellOrderOpenByProductId(this.productId).then((response) => {
        this.tableSell = response.data;
      })
    },
    loadLogOrder(){
      OrderService.orderMatchLog(this.productId).then((response) => {
        this.tableLog = response.data;
      })
    },
    getCurrentUser(){
      this.userId= localStorage.getItem('userId');
      authenService.getDetailUser(this.userId).then((response) => {
        this.userBalance = response.data.balance;
      });
    }

  },
  mounted() {
    this.getCurrentUser()
    this.username = localStorage.getItem('username');
    this.$nextTick(() => {
      this.connectOrderSocket();
      this.connectLogSocket();
    });
    this.getProductsById();
    this.productId = this.$route.params.id;
    this.loadTableOrder()
    this.loadLogOrder()
  }
}
</script>
<style scoped>
.green{
  color: green;
}
.red{
  color: red;
}
</style>