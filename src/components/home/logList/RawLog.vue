<template>
  <div class="raw-log">
    <div class="share-head">
      <div class="bash-btns">
        <el-button @click="deleteSome" icon="delete">删除</el-button>
      </div>
      <div class="search">
        <input type="text" placeholder="请输入关键字" v-model="keyWord">
        <div v-show="isSearching" class="img-button close-btn" @click="close_search">
          <i class="el-icon-circle-cross"></i>
        </div>
        <div v-show="!isSearching" class="search-button" @click="searchLog"><i class="el-icon-search"></i></div>
      </div>
    </div>
    <div class='title'>所有文件已加载，共{{items.length}}个</div>
    <div id="log-list">
      <div class="list-head" style="border-bottom: 0.8px solid #324157">
        <div class="log-head">
          <input type="checkbox" v-model="checkAll" id="文件名" value="文件名">
          <div class="log-name">文件名</div>
        </div>
        <div class="uploader">上传者</div>
        <div class="date">日期</div>
        <div class="normal-log">规范化日志</div>
        <div class="event-log">事件日志</div>
      </div>
      <div class="list">
        <div class="list-item" v-for="(item,index) in items" :class="{selectedItem: isSelected(index)}">
          <div class="log-head">
            <input type="checkbox" v-model="checked" :value="item.rawLog.id" @click="currClick(item,index)">
            <div class="log-name" :title="item.rawLog.logName">{{item.rawLog.logName}}</div>
          </div>
          <div class="uploader">{{item.user.name}}</div>
          <div class="date">
            {{`${new Date(item.rawLog.createDate).getFullYear()}-${new Date(item.rawLog.createDate).getMonth() + 1}-${new Date(item.rawLog.createDate).getDate()}`}}
          </div>
          <div @click="jumpToNormal(index)" class="normal-log relation-logs"
               :title="item.normalLog ? item.normalLog.logName : '无'">
            {{item.normalLog ? item.normalLog.logName : '无'}}
          </div>
          <div @click="jumpToEvent(index)" class="event-log relation-logs"
               :title="item.eventLog ? item.eventLog.logName : '无'">
            {{item.eventLog ? item.eventLog.logName : '无'}}
          </div>
          <div class="operations">
            <i class="el-icon-delete" title="删除" @click="deleteLog(index)"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="block pageDiv">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        layout=" prev, pager, next, jumper"
        :total="total_items_num">
      </el-pagination>
    </div>
  </div>
</template>

<style lang="less" scoped rel="stylesheet/less">
  @import '~assets/colors.less';
  @import "~assets/layout.less";

  .share-head {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    padding-bottom: 30px;
  }

  .title {
    position: absolute;
    right: 55px;
    font-size: 14px;
    color: #b5b5b5;
  }

  .download_button {
    cursor: pointer;
  }

  .list-item:hover {
    background-color: @logList_Choose;
  }

  .too-long-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  #log-list {
    padding-top: 20px;
    margin-left: 10px;
    margin-right: 10px;
    font-size: 14px;
    .list {
      height: 530px;
      overflow: auto;
    }
    .list-item, .list-head {
      img {
        width: 12px;
        height: 12px;
        margin-right: 10px;
      }
      display: flex;
      flex-direction: row;
      width: 100%;
      padding: 10px 0px 10px 0px;
      border-bottom: 0.5px solid @light_theme;
      .log-head{
        flex: 0 0 25%;
        text-align: left;
        display: flex;
        flex-direction: row;
        min-width: 220px;
        .log-name {
          cursor: pointer;
          min-width: 200px;
          flex: 0 0 25%;
          .too-long-text;
          text-align: left;
        }
      }
      .operations {
        flex: 0 0 5%;
        min-width: 40px;
        img {
          width: 18px;
          height: 18px;
          position: relative;
          top: 2px;
        }
      }
      .uploader {
        flex: 0 0 8%;
        min-width: 80px;
      }
      .date {
        flex: 0 0 10%;
        min-width: 90px;
        .too-long-text;
      }
      .normal-log {
        flex: 0 0 25%;
        min-width: 250px;
        .too-long-text;
      }
      .event-log {
        flex: 0 0 25%;
        min-width: 250px;
        .too-long-text;
      }
    }
  }

</style>

<script>
  import {mapActions} from 'vuex'
  export default{
    data(){
      return {
        checked: [],
        totalAmount: [],
        isSearching: false,
        items: [],
        keyWord: '',
        currentPage: 1,
        total_items_num: 10
      }
    },
    created(){
      if (this.$store.getters.selectedLog.type === 3) {
        this.currentPage = parseInt(this.$store.getters.selectedLog.page)
      }
      this.getTotalItems()
    },
    computed: {
      amount: function (item, index) {
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
              let total = item.rawLog.id;
              _this.totalAmount.push(total);
              return item.rawLog.id;
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
      ...mapActions(['selectLog', 'changeFilePath']),
      handleCurrentChange(val) {
        this.currentPage = val
        if (this.isSearching) {
          this.searchLog()
        } else {
          this.getTotalItems()
        }

      },
      isSelected(index){
        return this.$store.getters.selectedLog.type === 0 && this.items[index].rawLog.id === this.$store.getters.selectedLog.id
      },
      jumpToNormal(index){
        if (this.items[index].normalLog) {
          this.$api({method: 'getNormalLogPage', query: {id: this.items[index].normalLog.id}}).then(res => {
            this.selectLog({type: 1, id: this.items[index].normalLog.id, page: res.data.page})
            this.changeFilePath('1-2')
          }, err => {
            this.$hint('网络出错', 'error')
          })

        }
      },
      jumpToEvent(index){
        if (this.items[index].eventLog) {
          this.$api({method: 'getEventLogPage', query: {id: this.items[index].eventLog.id}}).then(res => {
            this.selectLog({type: 2, id: this.items[index].eventLog.id, page: res.data.page})
            this.changeFilePath('1-3')
          }, err => {
            this.$hint('网络出错', 'error')
          })
        }
      },

      getTotalItems(){
        const _this = this
        this.$api({method: 'getRawLog', query: {page: this.currentPage}}).then((res) => {
          console.log(res.data.pageNum)
          _this.items = res.data.logGroups
          _this.total_items_num = parseInt(res.data.pageNum) * 10
        })
      },

      searchLog: function () {
        this.totalAmount = []
        this.checkedAll = false
        this.checked = []
        this.$api({method: 'searchRawLog', query: {keyWord: this.keyWord, page: this.currentPage}}).then(res => {
          this.items = res.data.logGroups
          this.total_items_num = res.data.pageNum * 10
          this.isSearching = true
        })
      },

      close_search(){
        this.isSearching = false
        this.items = this.getTotalItems()
        this.keyWord = ''
      },
      deleteLog: function (index) {

        this.$api({method: 'deleteRawLog', opts: {body: {idList: [this.items[index].rawLog.id]}}}).then((res) => {
          if (parseInt(res.data.code) === 1) {
            this.$hint('删除成功', 'success');
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
        })
      },
      deleteSome: function () {
        this.$api({
          method: 'deleteRawLog',
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
      },

    },
    watch: {
      checked: function () {
        this.amount = this.items.length;
      }
    }
  }
</script>
