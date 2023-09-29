<template>
  <div>
    <chat/>
    <list-product/>
  </div>

</template>

<script>
import Chat from "../components/MessageChat.vue";
import ListProduct from "../components/product/listProduct.vue";

export default {
  name: 'Market',
  components: {ListProduct, Chat},
  data() {
    return {

    };
  },
  methods: {

  },
};
</script>
<style>
</style>
