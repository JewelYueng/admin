<template>
  <div class="users">
    <div class="head">
      <!--<el-button @click="deleteSome" icon="delete">删除</el-button>
      <el-button @click="changeSome" icon="edit">状态改变</el-button>-->
    </div>
    <div class='title'>所有用户已加载，共{{items.length}}个</div>
    <div id="user-list">
      <div class="list-head" style="border-bottom: 0.8px solid #324157">
        <div class="userID">
         <!-- <input type="checkbox" v-model="checkAll" id="用户ID" value="用户ID">
          <span>-->用户ID</div>
        <div class="userName">用户名</div>
        <div class="email">注册邮箱</div>
        <div class="state">状态</div>
        <div class="operations"></div>
      </div>
      <div class="list-body">
      <div class="list-item" v-for="item in items">
        <div class="userID">
          <!--<input type="checkbox" v-model="checked" :value="item.users.id" @click="currClick(item,index)">
          <span>-->{{item.id}}</div>
        <div class="userName">{{item.name}}</div>
        <div class="email">{{item.email}}</div>
        <div class="state">
          <el-switch
            v-model="item.state"
            on-color="#13ce66"
            off-color="#ff4949"
            on-text="激活"
            off-text="冻结"
            on-value="1"
            off-value="0"
            @change ="changeState">
          </el-switch></div>
        <div class="operations">
          <i class="el-icon-delete" title="删除" @click="deleteUser"></i>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<style lang="less" scoped rel="stylesheet/less">
  @import '~assets/colors.less';
  @import "~assets/layout.less";

  .head {
    display: flex;
    flex-direction: row;
    justify-content: left;
    padding: 30px;
  }

  .title {
    position: absolute;
    right: 55px;
    font-size: 14px;
    color: #b5b5b5;
  }

  .list:hover {
    background-color: @logList_Choose;
  }

  .too-long-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  #user-list {
    padding-top: 20px;
    margin-left: 10px;
    margin-right: 10px;
    font-size: 14px;
    .list-head , .list-item {
      display: flex;
      flex-direction: row;
      width: 100%;
      padding: 10px 0px 10px 0px;
      border-bottom: 0.5px solid @light_theme;
      .userID{
        flex: 0 0 300px;
      }
      .userName {
        width: 300px;
        .too-long-text;
      }
      .state{
        flex: 0 0 300px;
      }
      .email{
        flex: 0 0 300px;
      }
      .operations {
        flex: 0 0 300px;
        color: @dark_theme;
        i {
          margin: 0 5px;
          cursor: pointer;
          font-size: 18px;
        }
      }
    }
    .selectedItem {
      background-color: #cbd7ea;
    }
  }

</style>

<script>
  import {mapActions} from 'vuex'
  export default{
    data(){
      return {
        items: [
              {"id":"1","name":"1","email":"1@1.com", "password":"6666","state":1},
            {"id":"2","name":"2","email":"2@2.com", "password":"2","state":0},
            {"id":"3","name":"3", "email":"3@3.com","password":"3","state":1},
            {"id":"4","name":"4","email":"4@4.com", "password":"4","state":0},
            {"id":"53c3a18c-8148-4226-aaf9-fbcc0365a621", "name":"myUserName","email":"574335078@qq.com", "password":"12354","state":1},
            {"id":"c8a9a6c1-a2ac-4b6a-8490-ee78a61187f3","name":"myName", "email":"5@5.com","password":"123456","state":1}
        ]
      }
    },
    created(){
//      this.getTotalItems()
    },
    computed: {
      /*amount: function (item, index) {
        return this.checked.length;
      },
      checkAll: {
        get: function () {
          return this.checkedCount === this.items.length;
        },
        set: function (value) {
          let _this = this;
          if (value) {
            this.totalAmount = [];
            this.checked = this.items.map(function (item) {
              item.checked = true;
              let total = item.eventLog.id;
              _this.totalAmount.push(total);
              return item.eventLog.id;
            })
          } else {
            this.checked = [];
            this.totalAmount = [];
            this.items.forEach(function (item, index) {
              item.checked = false;
            });
          }
        }
      },
      checkedCount: {
        get: function () {
          return this.checked.length;
        }
      }*/
    },
    methods:{

      changeState(val){
        console.log(val)
      },

      getTotalItems(){
        const _this = this
        this.$api({method: 'getUsers'}).then((res) => {
          console.log(res)
          _this.items = res.data.users
        })
      },

      deleteUser: function (index) {

        this.$api({
          method: 'deleteUser',
          opts: {body: {idList: [this.items[index].methods.id]}}
        }).then((res) => {

          console.log(res.data)
          if (res.data.code === 1) {
            this.$hint('删除成功', 'success')
            this.getTotalItems()
            this.checked = [];
            this.totalAmount = [];
            this.items.forEach(function (item, index) {
              item.checked = false;
            });
          } else {
            this.$hint('不明原因失败，建议刷新', 'error')
          }
        }, err => {
          console.log(err)
          this.$hint(err.data.msg,'error')
        })

      },

    }

  }
</script>
