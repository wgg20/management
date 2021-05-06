<template>
  <div class="login">
    <div class="login_box">
      <!-- 图像图标 -->
      <div class="login_logo">
        <img src="../assets/img/logo.png" alt="" />
      </div>
      <!-- 表单input -->
      <el-form
        label-width="0px"
        class="login_input"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- button按钮 -->
        <el-form-item class="login_btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="loginReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  props: {},
  components: {},
  data() {
    return {
      //表单input输入框默认输入的值
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      //为表单绑定校验规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
            //我是你爸爸
          },
        ],
      },
    };
  },
  methods: {
    //重置表单  但是表单内容不会清空  因为表单内的内容是双向绑定的 而是将input中的内容回归到默认值
    loginReset() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      //登录前对表单填写的信息进行验证，传入的是回调函数，如果表单填写符合要求返回值true，错误返回false
      this.$refs.loginFormRef.validate(async (valid) => {
        //如果值为false返回值
        if (!valid) return;
        //{data:res}:解构赋值，将返回的data对象赋值给res
        //‘login’是路径接口，this.loginForm是后面跟的参数
        const { data: res } = await this.$http.post('login', this.loginForm);
        if (res.meta.status != 200)
          return this.$message.error('信息错误，登录失败！');
        this.$message.success('恭喜你，登录成功！');
        // console.log(res);
        //将登录成功之后的token，保存到客户端的sessionStorage中
        //   1.1项目中除了登录外的其他API接口，必须在登陆后才能访问
        //   1.2token只应该在当前网站打开期间生效，所以将token保存在seesionStorage中
        window.sessionStorage.setItem('token', res.data.token);
        //2.通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push('/home');
      });
    },
  },
};
</script>
<style lang="less" scoped>
.login {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .login_logo {
    width: 130px;
    height: 130px;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    // 位移图像本身的长宽度的50%
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;
    img {
      width: 1005;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_input {
  width: 100%;
  position: absolute;
  bottom: 0px;
  padding: 0 20px;
  box-sizing: border-box;
}
.login_btn {
  display: flex;
  justify-content: flex-end;
}
</style>
