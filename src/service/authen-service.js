import axios from "../http-common.js";
class AuthService {
    login(user) {
        return axios.post("/authen/login", data)
    }
    logout() {
        localStorage.removeItem("user");
    }
    register(user) {
        return axios.post("/authen/register", data);
    }
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
    getDetailUser(id) {
        return axios.get(`/users/details/${id}`);
    }
}
export default new AuthService();
