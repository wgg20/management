<template>
  <div class='home'>
    <el-button type="info" @click="loginOut">退出登录</el-button>
  </div>
</template>

<script>
export default {
  name:'Home',
  props: {},
  components: {},
  data () {
    return {}
  },
  methods: {
    loginOut(){
      //将sessionStorage中的token清空掉
      window.sessionStorage.clear()
      //将路由重定向到登录页
      this.$router.push('/login')
    }
  },
}
</script> 

<style scoped>

</style>