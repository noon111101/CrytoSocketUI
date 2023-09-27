import axios from "../http-common.js";
class ProductService {
    getAll() {
        return axios.get("/product");
    }
    get(id) {
        return axios.get(`/product/${id}`);
    }
    create(data) {
        return axios.post("/product", data);
    }
    update(id, data) {
        return axios.put(`/product/${id}`, data);
    }
    delete(id) {
        return axios.delete(`/product/${id}`);
    }
}
export default new ProductService();