<template>
  <div class="login">
      <form>
        <mt-field label="用户名" placeholder="请输入用户名" v-model="admin.username"></mt-field>
        <mt-field label="密码" placeholder="请输入密码" type="password" v-model="admin.password"></mt-field>
        <mt-button size="large" @click.prevent="login" type="default">登录</mt-button>
      </form>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      admin: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    async login() {
      let { username, password } = this.$data.admin;
      await this.$store.dispatch("login", this.admin);
    }
  }
};
</script>

<style>

</style>
