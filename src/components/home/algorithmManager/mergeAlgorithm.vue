<template>
  <div class="algorithm">
    <div class="head">
      <el-button type="primary" icon="plus" @click="upload">添加</el-button>
    </div>
    <div class='title'>所有算法已加载，共{{count}}个</div>
    <div id="algorithm-list">
      <div class="list-head" style="border-bottom: 0.8px solid #324157">
        <div class="methods-name">算法名</div>
        <div class="description">说明</div>
        <div class="state">状态</div>
        <div class="operations"></div>
      </div>
      <div class="list-body">
        <div class="list-item" v-for="(item,index) in items" >
          <div class="methods-name">{{item.name}}</div>
          <div class="description"><el-tooltip placement="top">
            <div slot="content">{{item.description}}</div>
            <div>说明</div>
          </el-tooltip></div>
          <i class="el-icon-share" v-show="item.state==0" title="启用" @click="changeState(index)"></i>
          <i class="el-icon-minus" v-show="item.state!=0" title="禁用" @click="changeState(index)"></i>
          <div class="operations">
            <i class="el-icon-delete" title="删除" @click="deleteMethod(index)" ></i>
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
    .list-head , .list-item {
      display: flex;
      flex-direction: row;
      width: 100%;
      padding: 10px 0px 10px 0px;
      border-bottom: 0.5px solid @light_theme;
      .methods-name {
        flex: 0 0 300px;
        .too-long-text;
      }
      .state{
        flex: 0 0 300px;
      }
      .description{
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
        //methodState: "state",
        items: []
      }
    },
    created(){
      this.getTotalItems()
    },
    computed: {
      count: function (item, index) {
        let sum = this.items.length;
        return sum;
      }
      },
    methods:{
      changeState(index){
        if (parseInt(this.items[index].state)=== 0) {
          this.$api({method: 'activeMerge', body: {idList: [this.items[index].id]}}).then(res => {
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
          this.$api({method: 'freezeMerge', body: {idList: [this.items[index].id]}}).then(res => {
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

      upload(){
        this.$modal({type: 'upload', data: {type: 'addMerge'}}).then((res) => {
          console.log(res)
          this.getTotalItems()
        })
      },

      getTotalItems(){
        const _this = this
        this.$api({method: 'mergeMethod'}).then((res) => {
          console.log(res)
          _this.items = res.data.methods
        })
      },

      deleteMethod: function (index) {

        this.$api({
          method: 'deleteMerge',
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
          this.$hint(err.data.msg,'error')
        })

      }

    }

  }
</script>
