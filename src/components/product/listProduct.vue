<template>
  <div style="width: 1000px">
    <h1>Product</h1>
    <div v-for="(p,index) in products" :key="index">
      <el-card shadow="hover" class="my-4">
        <router-link class="d-flex flex-row" :to="`/product/${p.id}`">
        <div class="col-3">
            <div>{{p.symbol}}</div>
            <div>{{p.companyName}}</div>
        </div>
        <div class="col-2">
sd
        </div>
        <div class="col-2">
sd
        </div>
        <div class="col-2">
sd
        </div>
        </router-link>
      </el-card>
    </div>
  </div>
</template>
<script>
import productService from "../../service/product-service.js";

export default {
  name: 'ListProduct',
  data(){
    return{
      products: [],
    }
  },
  methods: {
    async getProducts() {
      productService.getAll()
        .then((response) => {
          this.products = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.getProducts();
  },
}
</script>
<style scoped>

</style>