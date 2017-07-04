<template>
  <div class="files-list">
    <div class="left-side">
      <el-menu :default-active="current_index" class="el-menu-vertical-demo" @select="handleSelect">
        <el-menu-item index="1"><i class="el-icon-setting"></i>挖掘算法管理</el-menu-item>
        <el-menu-item index="2"><i class="el-icon-setting"></i>融合算法管理</el-menu-item>
      </el-menu>
    </div>
    <div id="right-window">
      <component :is="current_view"></component>
    </div>
  </div>
</template>

<style lang="less" rel="stylesheet/less">
  @import '~assets/colors.less';
  @import "~assets/layout.less";

  .left-side {
    background-color: @light_theme;
    width: @left_side_width;
    height: @main_height;
    box-sizing: border-box;
  }

  .files-list {
    display: flex;
    flex-direction: row;
  }

  #right-window {
    width: @right_side_width;
    height: @main_height - 30px;
    box-sizing: border-box;
    padding: 30px 30px 0 30px;
    overflow: auto;
  }
  .relation-logs{
    cursor: pointer;
  }
  input[type='checkbox']{
    width: 20px;
    position: relative;
    height: 20px;
    top: 2px;
  }

</style>

<script>
  import Mining from 'components/home/algorithmManager/algorithmManager'
  import Merge from 'components/home/algorithmManager/mergeAlgorithm'
  import {mapActions} from 'vuex'

  export default{
    data(){
      return {
        msg: 'leftSide',
        active_index: '1',
        view_dict: {
          "1": Mining,
          "2": Merge,
        }
      }
    },
    components: {
      Mining,
      Merge
    },
    created(){
      this.changeHomePath('/')
    },
    methods: {
      ...mapActions(['changeHomePath','changeFilePath', 'selectLog']),
      handleSelect(key, keyPath) {
        this.active_index = key
        this.changeFilePath(key)
      }
    },
    computed: {
      current_view() {
        return this.view_dict[this.$store.getters.file_path || '1']
      },
      current_index(){
        return this.$store.getters.file_path
      }
    }
  }
</script>
