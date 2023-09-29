import axios from "../http-common.js";
class OrderService {
getAll() {
        return axios.get("/order");
    }
    get(id) {
        return axios.get(`/order/${id}`);
    }
    create(data) {
        return axios.post("/order/create", data);
    }
    update(id, data) {
        return axios.put(`/order/${id}`, data);
    }
    delete(id) {
        return axios.delete(`/order/${id}`);
    }
    orderMatchLog(id) {
        return axios.get(`/order/match/${id}`);
    }
    findListBuyOrderOpenByProductId(id) {
        return axios.get(`/order/buy/${id}`);
    }
    findListSellOrderOpenByProductId(id) {
        return axios.get(`/order/sell/${id}`);
    }
}
export default new OrderService();