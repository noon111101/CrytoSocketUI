<template>
  <div>
    <h1>Đăng nhập</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="loginUsername">Tên đăng nhập:</label>
        <input v-model="loginUsername" type="text" id="loginUsername" name="loginUsername" class="form-control" required>
      </div>
      <div class="form-group">
        <label for="loginPassword">Mật khẩu:</label>
        <input v-model="loginPassword" type="password" id="loginPassword" name="loginPassword" class="form-control" required>
      </div>
      <button type="submit" class="btn btn-primary me-3 mt-4">Đăng nhập</button>
      <button @click="showRegisterPopup" class="btn btn-success mt-4">Đăng ký</button>

    </form>

    <!-- Form Đăng ký (popup) -->
    <el-dialog title="Đăng ký" v-model="registerPopupVisible"  :before-close="closeRegisterPopup">
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="registerUsername">Tên đăng nhập:</label>
          <input v-model="registerUsername" type="text" id="registerUsername" name="registerUsername" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="registerPassword">Mật khẩu:</label>
          <input v-model="registerPassword" type="password" id="registerPassword" name="registerPassword" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="registerEmail">Email:</label>
          <input v-model="registerEmail" type="text" id="registerEmail" name="registerEmail" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">Đăng ký</button>
      </form>
    </el-dialog>

    <div id="message">{{ message }}</div>
  </div>
</template>

<script>
import axios from "../http-common.js";

export default {
  data() {
    return {
      loginUsername: '',
      loginPassword: '',
      registerUsername: '',
      registerPassword: '',
      registerEmail: '',
      message: '',
      registerPopupVisible: false,

    };
  },
  methods: {
    async login() {
      try {
        const loginRequest = {
          username: this.loginUsername,
          password: this.loginPassword,
        };
        const response = await axios.post('/users/login', loginRequest);
        const token = response.data;
        if (token) {
          await this.getUser(token);
          this.$router.push('/market');
        } else {
          throw new Error('Không có mã token trong phản hồi');
        }
      } catch (error) {
        console.error('Lỗi đăng nhập: ' + error.message);
      }
    },
    async getUser(token) {
      try {
        const response = await axios.get('/hello/me', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        const data = response.data;
        localStorage.setItem('username', data.username);
        localStorage.setItem('userId', data.id);
      } catch (error) {
        console.error('Lỗi yêu cầu: ' + error.message);
      }
    },
    async register() {
      try {
        const registerRequest = {
          username: this.registerUsername,
          password: this.registerPassword,
          email: this.registerEmail,
        };
        const response = await axios.post('/users/register', registerRequest);
        // Xử lý kết quả đăng ký (nếu cần)
        console.log('Đăng ký thành công');
        this.closeRegisterPopup();
      } catch (error) {
        console.error('Lỗi đăng ký: ' + error.message);
      }
    },
    showRegisterPopup() {
      this.registerPopupVisible = true;
    },
    closeRegisterPopup() {
      this.registerPopupVisible = false;
    },
  },
};
</script>
