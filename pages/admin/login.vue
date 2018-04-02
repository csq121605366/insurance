<template>
  <div class="login">
      <form>
          <input type="text" name="username" placeholder="用户名">
          <input type="text" name="password" placeholder="密码">
          <button type="button" @click="login">登录</button>
      </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    async login() {
      let { username, password } = this.$data;
    }
  }
};
</script>

<style>

</style>
