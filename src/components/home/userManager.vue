<template>
  <div class="users">
    <div class="head">
      <el-button @click="shareSome" icon="share">恢复</el-button>
      <el-button @click="deleteSome" icon="delete">删除</el-button>
    </div>
    <div class='title'>所有用户已加载，共{{count}}个</div>
    <div id="user-list">
      <div class="list-head" style="border-bottom: 0.8px solid #324157">
        <div><input type="checkbox" v-model="checkAll" id="用户" value="用户"></div>
        <div class="userID">用户ID</div>
        <div class="userName">用户名</div>
        <div class="email">注册邮箱</div>
        <div class="state">状态</div>
        <div class="operations">操作</div>
      </div>
      <div class="list-body">
        <div class="list-item" v-for="(item,index) in items">
          <div><input type="checkbox" v-model="checked" :value="item.id" @click="currClick(item,index)">
          </div>
          <div class="userID">{{item.id}}</div>
          <div class="userName">{{item.name}}</div>
          <div class="email">{{item.email}}</div>
          <div class="state">
            <i class="el-icon-circle-check" v-show="item.state==3" title="恢复" @click="changeState(index)" ></i>
            <i class="el-icon-circle-close" v-show="item.state==1" title="冻结" @click="changeState(index)"></i>
          </div>
          <div class="operations">
            <i class="el-icon-delete" title="删除" @click="deleteUser(index)"></i>
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

  .list-item:hover {
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
    .list-head, .list-item {
      display: flex;
      flex-direction: row;
      width: 100%;
      padding: 10px 0px 10px 0px;
      border-bottom: 0.5px solid @light_theme;
      justify-content: flex-start;
      align-items: center;
      .userID {
        flex: 0 0 30%;
        min-width: 250px;
        .too-long-text;
      }
      .userName {
        flex: 0 0 20%;
        min-width: 200px;
        .too-long-text;
      }
      .state {
        flex: 0 0 10%;
        min-width: 80px;
        cursor: pointer;
        .el-icon-circle-check{
          color: #13CE66
        }
        .el-icon-circle-close{
          color: #F7BA2A;
        }
      }
      .email {
        flex: 0 0 25%;
        min-width: 200px;
        .too-long-text
      }
      .operations {
        flex: 0 0 10%;
        min-width: 100px;
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
        items: [],
        checked: [],
        totalAmount: []
      }
    },
    created(){
      this.getTotalItems()
      this.changeHomePath('/users')
    },
    computed: {

      count: function (item, index) {
        let sum = this.items.length;
        return sum;
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
              let total = item.id;
              _this.totalAmount.push(total);
              return item.id;
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
      }

    },
    methods: {
      ...mapActions(['changeHomePath']),
      currClick: function (item, index) {
        let _this = this;
        if (typeof item.checked === 'undefined') {
          this.$set(item, 'checked', true);
          let total = item.id;
          this.totalAmount.push(total);
          console.log(this.totalAmount);
        } else {
          item.checked = !item.checked;
          if (item.checked) {
            this.totalAmount = [];
            this.items.map(function (item, index) {
              if (item.checked) {
                let total = item.id;
                _this.totalAmount.push(total);
              }
            });
          } else {
            this.totalAmount = [];
            this.items.forEach(function (item, index) {
              if (item.checked) {
                let total = item.id;
                _this.totalAmount.push(total);
              }
            });
          }
        }
      },
      deleteSome: function () {
        if(this.checked.length==0){
          this.$hint('请至少删除一个用户', 'error')
        }
        else{
        this.$api({
          method: 'deleteUser',
          opts: {body: {idList: this.checked}}
        }).then((res) => {
          console.log(res.data)
          if (parseInt(res.data.code) === 200) {
            this.$hint('批量删除成功', 'success')
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
          this.$hint(err.data.msg, 'error')
        })}

      },

      shareSome(){
        if(this.checked.length==0){
          this.$hint('请至少恢复一个用户', 'error')
        }
        else{
        this.$api({method: 'activeUser', body: {idList: this.checked}}).then(res => {
          if (parseInt(res.data.code) === 200) {
            this.$hint('批量恢复成功', 'success')
            this.getTotalItems()
          } else {
            this.$hint('不明原因失败，建议刷新', 'warn')
          }
        }, err => {
          console.log(err)
          this.$hint(err.data.msg, 'error')
        })}

      },
      changeState(index){

        if (parseInt(this.items[index].state) === 3) {
          this.$api({method: 'activeUser', body: {idList: [this.items[index].id]}}).then(res => {
            if (parseInt(res.data.code) === 200) {
              this.$hint('恢复成功', 'success')
              this.getTotalItems()
            } else {
              this.$hint('不明原因失败，建议刷新', 'error')
            }
          }, err => {
            console.log(err)
            this.$hint(err.data.msg, 'error')
          })
        } else {
          this.$api({method: 'forbidUser', body: {idList: [this.items[index].id]}}).then(res => {
            if (parseInt(res.data.code) === 200) {
              this.$hint('冻结成功', 'success')
              this.getTotalItems()
            } else {
              this.$hint('不明原因失败，建议刷新', 'error')
            }
          }, err => {
            console.log(err)
            this.$hint(err.data.msg, 'error')
          })
        }


      },

      getTotalItems(){
        const _this = this
        this.$api({method: 'getUsers'}).then((res) => {
          console.log(res)
          _this.items = res.data.users;
        })
      },

      deleteUser: function (index) {

        this.$api({
          method: 'deleteUser',
          opts: {body: {idList: [this.items[index].id]}}
        }).then((res) => {

          console.log(res.data)
          if (parseInt(res.data.code) === 200) {
            this.$hint('删除成功', 'success')
            this.getTotalItems();
//            this.checked = [];
//            this.totalAmount = [];
//            this.items.forEach(function (item, index) {
//              item.checked = false;
//            });
          } else {
            this.$hint('不明原因失败，建议刷新', 'error')
          }
        }, err => {
          console.log(err)
          this.$hint(err.data.msg, 'error')
        })

      }

    }

  }
</script>
