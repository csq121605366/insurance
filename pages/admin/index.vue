<template>
  <div>
      登录成功
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Toast } from "mint-ui";
export default {
  middleware: "auth",
  layout: "admin",
  head() {
    return {
      title: "后台管理页面"
    };
  },
  data() {
    Toast("435");
    return {
      user: {}
    };
  },
  computed: {
    ...mapState(["user"])
  }
};
</script>

<style>

</style>
