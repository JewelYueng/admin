<template>
  <div class="algorithm">
    <div class="head">
      <el-button type="primary" icon="plus" @click="addMethods">添加</el-button>
      <el-button @click="shareSome" icon="share">启用</el-button>
      <el-button @click="deleteSome" icon="delete">删除</el-button>
      <el-button @click="unshareSome" icon="minus">禁用</el-button>
    </div>
    <div class='title'>所有算法已加载，共{{count}}个</div>
    <div id="algorithm-list">
      <div class="list-head" style="border-bottom: 0.8px solid #324157">
        <div><input type="checkbox" v-model="checkAll" id="算法名" value="算法名"></div>

        <div class="methods-name">算法名</div>
        <div class="description">说明</div>
        <div class="state">状态</div>
        <div class="operations"></div>
      </div>
      <div class="list-body">
        <div class="list-item" v-for="(item,index) in items">
          <div><input type="checkbox" v-model="checked" :value="item.id" @click="currClick(item,index)">
          </div>
          <div class="methods-name">{{item.name}}</div>
          <div class="description">{{item.description}}
          </div>
          <div class="state">
            <i class="el-icon-circle-check" v-show="item.state==0" title="启用" @click="changeState(index)"></i>
            <i class="el-icon-circle-close" v-show="item.state!=0" title="禁用" @click="changeState(index)"></i>
          </div>
          <div class="operations">
            <i class="el-icon-delete" title="删除" @click="deleteMethod(index)"></i>
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

  #algorithm-list {
    padding-top: 20px;
    margin-left: 10px;
    margin-right: 10px;
    font-size: 14px;
    justify-content: flex-start;
    align-items: center;
    .list-head, .list-item {
      display: flex;
      flex-direction: row;
      width: 100%;
      padding: 10px 0px 10px 0px;
      border-bottom: 0.5px solid @light_theme;
      align-items: center;
      .methods-name {
        flex: 0 0 300px;
        .too-long-text;
      }
      .state {
        flex: 0 0 300px;
        cursor: pointer;
        .el-icon-circle-check{
          color: #13CE66
        }
        .el-icon-circle-close{
          color: #F7BA2A;
        }
      }
      .description {
        flex: 0 0 300px;
        text-align: left;
        //overflow:hidden;
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
        //methodState: "state",
        items: [],
        checked: [],
        totalAmount: []
      }
    },
    created(){
      this.getTotalItems()
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
      deleteSome: function () {
        if(this.checked.length==0){
          this.$hint('请至少删除一个算法', 'error')
        }
        else{
        this.$api({
          method: 'deleteMining',
          opts: {body: {idList: this.checked}}
        }).then((res) => {
          console.log(res.data)
          if (res.data.code === 1) {
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
          this.$hint('请至少启用一个算法', 'error')
        }
        else{
        this.$api({method: 'activeMining', body: {idList: this.checked}}).then(res => {
          if (res.data.code === 1) {
            this.$hint('批量启用成功', 'success')
            this.getTotalItems()
          } else {
            this.$hint('不明原因失败，建议刷新', 'warn')
          }
        }, err => {
          console.log(err)
          this.$hint(err.data.msg, 'error')
        })}

      },
      unshareSome(){
        if(this.checked.length==0){
          this.$hint('请至少选择一个算法禁用', 'error')
        }
        else{
        this.$api({method: 'freezeMining', body: {idList: this.checked}}).then(res => {
          if (res.data.code === 1) {
            this.$hint('禁用成功', 'success')
            this.getTotalItems()
          } else {
            this.$hint('不明原因失败，建议刷新', 'error')
          }
        }, err => {
          console.log(err)
          this.$hint(err.data.msg, 'error')
        })}
      },
      changeState(index){
        if (parseInt(this.items[index].state) === 0) {
          this.$api({method: 'activeMining', body: {idList: [this.items[index].id]}}).then(res => {
            if (res.data.code === 1) {
              this.$hint('启用成功', 'success')
              this.getTotalItems()
            } else {
              this.$hint('不明原因失败，建议刷新', 'error')
            }
          }, err => {
            console.log(err)
            this.$hint(err.data.msg, 'error')
          })
        } else {
          this.$api({method: 'freezeMining', body: {idList: [this.items[index].id]}}).then(res => {
            if (res.data.code === 1) {
              this.$hint('禁用成功', 'success')
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
        this.$api({method: 'miningMethod'}).then((res) => {
          console.log(res)
          _this.items = res.data.methods
        })
      },

      deleteMethod: function (index) {

        this.$api({
          method: 'deleteMining',
          opts: {body: {idList: [this.items[index].id]}}
        }).then((res) => {

          console.log(res.data)
          if (res.data.code === 1) {
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

      },
      addMethods(){
        this.$modal({type: 'upload', data: {type: 'mining'}}).then((res) => {
          console.log(res)
          if(res===false){
            this.$hint('没有选择任何jar包', 'warn')
          }
          this.getTotalItems()
        })
      },
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
      }

    }

  }
</script>
