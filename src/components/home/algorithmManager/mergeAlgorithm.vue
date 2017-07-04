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
        <div class="list-item" v-for="item in items" >
          <div class="methods-name">{{item.name}}</div>
          <div class="description"><el-tooltip placement="top">
            <div slot="content">{{item.description}}</div>
            <div>说明</div>
          </el-tooltip></div>
          <div class="state">
            <el-switch
              v-model="item.state"
              on-color="#13ce66"
              off-color="#ff4949"
              on-text="启用"
              off-text="禁用"
              on-value="1"
              @change ="changeState"
              off-value="0">>
            </el-switch></div>
          <div class="operations">
            <i class="el-icon-delete" title="删除" @click="deleteMethod" ></i>
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
        items: [{
          "id":"12345",
          "state": 1,
          "parameters":
            [
              {"type":"Double","key":"relativeToBestThreshold","name":"相对频度阈值","description":"相对频度阈值des","defaultVal":0.9,"maxVal":1.0,"minVal":0.0},
              {"type":"Double","key":"dependencyThreshold","name":"依赖度阈值","description":"依赖度阈值des","defaultVal":0.9,"maxVal":1.0,"minVal":0.0},
              {"type":"Double","key":"l1lThreshold","name":"一元循环阈值","description":"一元循环阈值des","defaultVal":0.9,"maxVal":1.0,"minVal":0.0},
              {"type":"Double","key":"l2lThreshold","name":"二元循环阈值","description":"二元循环阈值des","defaultVal":0.9,"maxVal":1.0,"minVal":0.0},
              {"type":"Enum","key":"isLoop","name":"是否循环","description":"是否循环des","defaultVal":"FALSE","values":["TRUE","FALSE"]}
            ],
          "name":"启发式算法",
          "description":"这是启发式算法的描述",
          "key":"heuristics"
        },
          {
            "id":"12345",
            "state": 1,
            "parameters":[
              {"type":"Double","key":"crossRate","name":"交叉率","description":"交叉率des","defaultVal":0.8,"maxVal":1.0,"minVal":0.0},
              {"type":"Double","key":"mutationRate","name":"变异率","description":"变异率des","defaultVal":0.2,"maxVal":1.0,"minVal":0.0},
              {"type":"Double","key":"endFitness","name":"终止适应度值","description":"终止适应度值des","defaultVal":0.9,"maxVal":1.0,"minVal":0.0},
              {"type":"Integer","key":"populationSize","name":"种群规模","description":"种群规模des","defaultVal":10,"maxVal":1000,"minVal":0},
              {"type":"Integer","key":"maxGeneration","name":"最大遗传代数","description":"最大遗传代数des","defaultVal":10,"maxVal":1000,"minVal":0}],
            "name":"遗传算法",
            "description":"这是遗传算法的描述",
            "key":"genetic"
          }
        ]
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
      changeState(val){
        console.log(val)
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
