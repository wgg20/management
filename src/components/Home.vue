<template>
  <el-container class="home-container">
    <el-header>
      <div class="head">
        <img src="../assets/img/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="togglgbar" @click="collapseClick">|||</div>
        <el-menu
          background-color="#313743"
          text-color="#fff"
          active-text-color="#4E9AF3"
          unique-opened
          :collapse="iscollapse"
          :collapse-transition="false"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconObj[item.id]" class="iconfont"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="subitem.id + ''"
              v-for="subitem in item.children"
              :key="subitem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  props: {},
  components: {},
  data() {
    return {
      menulist: [],
      iconObj: {
        '125': 'icon-user',
        '103': 'icon-tijikongjian',
        '101': 'icon-shangpin',
        '102': 'icon-danju',
        '145': 'icon-baobiao',
      },
      iscollapse: false,
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    loginOut() {
      //将sessionStorage中的token清空掉
      window.sessionStorage.clear();
      //将路由重定向到登录页
      this.$router.push('/login');
    },
    collapseClick() {
      this.iscollapse = !this.iscollapse;
    },
    async getMenuList() {
      //请求左边菜单栏数据
      const { data: res } = await this.$http.get('menus');
      console.log(res);
      //请求失败弹出提示框
      if (res.meta.status != 200) return this.$message.error('res.meta.msg');
      //成功将数据传给menulist
      this.menulist = res.data;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #363d40;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  text-align: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #313743;
  .el-menu {
    border-right: none;
  }
  .togglgbar {
    background-color: #475163;
    height: 24px;
    line-height: 24px;
    text-align: center;
    font-size: 10px;
    color: #fff;
    letter-spacing: 0.2em;
  }
}
.el-main {
  background-color: #e9edf1;
}
.iconfont {
  margin-right: 10px;
}
</style>
