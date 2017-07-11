<template>
  <div id="home">
    <div class="header">
      <div class="nav">
        <div class="logo">
          <img src="/AssWeCan/static/img/logo.png" alt="K2" title="K2流程挖掘平台">
        </div>
        <el-menu theme="dark" :default-active="active_index" class="el-menu-demo" mode="horizontal" router>
          <el-menu-item index="/">日志文件管理</el-menu-item>
          <el-menu-item index="/users">用户管理</el-menu-item>
          <el-menu-item index="/methods">算法管理</el-menu-item>
        </el-menu>
      </div>
      <div class="logout" @click="logout">退出</div>
    </div>
    <router-view></router-view>
  </div>
</template>

<style rel="stylesheet/less" lang="less" scoped>
  @import "~assets/layout.less";
  @import "~assets/colors.less";

  #home {
    width: @major_width;
    margin: 0 auto;
  }

  .header {
    background-color: @dark_theme;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .nav{
      display: flex;
      flex-direction: row;
    }
    .logout{
      cursor: pointer;
      color: whitesmoke;
      text-decoration: underline;
      margin: 0 20px;
      font-size: 14px;
    }
  }

  .logo {
    padding: 4px;
    min-width: 200px;
    img {
      width: 60px;
    }
  }


</style>

<script>

  export default{
    data(){
      return {
        msg: 'leftSide',
        admin: null
      }
    },
    created(){
      this.$api({method: 'getAdmin'}).then(res => {
        if (res.data.code === "200") {
          this.admin = res.data.admin
        } else {
          this.$hint(res.data.message, 'error')
        }
      })

    },
    methods: {
      logout(){
        this.$api({method: 'logout'}).then(res => {
          if (res.data.code === "200") {
            this.admin = null
            this.$hint('登出成功', 'success')
            window.location.href = '/AssWeCan/admin/loginPage'
          } else {
            this.$hint(res.data.message, 'error')
          }
        })
      }
    },
    components: {},
    computed: {
      active_index: function () {
        return this.$store.getters.home_path || '/'
      }
    }
  }
</script>
