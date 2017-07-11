<template>
  <div class="upload">
    <button @click="cancel" style="position: absolute;right: 0px;top: 5px;
       color: #324157;background-color: white;border: none;cursor: pointer">
      <i class="el-icon-close"></i>
    </button>
    <div class="userdefined-file">
      　　<label class="button" for="files">选择文件</label>
      <label class="text" name="userdefinedFile" id="userdefinedFile">{{fileName}}</label>
    </div>
    <form id="uploadForm" ref="upload">
      <input type="file" name="files" id="files" v-on:change="fileChange" multiple ref="files" accept=".jar">
    </form>
    <div slot="tip" class="el-upload__tip" id="jar-tip">只能上传一个或多个jar包</div>
    <el-progress :percentage="progress" v-show="progress !== 0"></el-progress>
    <div class="btns">
      <el-button type="primary" v-on:click="upload">上传</el-button>
      <el-button v-on:click="cancel">取消</el-button>
    </div>
  </div>
</template>

<style scoped lang="less" rel="stylesheet/less">
  .upload {
    display: flex;
    flex-flow: column;
    justify-content: center;
    position: relative;
    background-color: white;
    width: 500px;
    box-shadow: 0 0 3px 0 #324157;
    border-radius: 5px;
    padding: 20px;
  }

  #jar-tip{
    margin: 10px;
  }
  .userdefined-file {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: flex-start;
    z-index: 2;
    width: 100%;
    line-height: 30px;
    font-size: 0; /*应对子元素为 inline-block 引起的外边距*/
  }

  .text {
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    line-height: 40px;
    font-size: 14px;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    border: none;
  }

  .button {
    display: inline-block;
    vertical-align: middle;
    width: 80px;
    border-radius: 5px;
    text-align: center;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    background-color: #20A0FF;
    border: none;
    color: white;
    cursor: pointer;
  }

  input[type="file"] {
    position: absolute;
    top: 0;
    left: 60px;
    z-index: 3;
    opacity: 0;
    visibility: hidden;
    width: 300px;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
  }

</style>

<script>
  import BaseBox from './BaseBox'
  import _ from 'lodash'
  const base_url = 'http://116.56.129.93:8088/AssWeCan/admin'
  //  const base_url = ""
  //  const base_url = "http://192.168.0.100:8080"
  const type_map = {
    'merge': base_url + '/merge/add',
    'mining': base_url + '/mining/add'
  }
  export default {
    data(){
      return {
        file: new FormData(),
        progress: 0,
        fileName: '未选择任何文件',
        is_uploading: false,
      }
    },
    computed: {
      action_url(){
        return type_map[this.data.type]
      }
    },
    mixins: [BaseBox],
    methods: {
      fileChange(){
        this.fileName = ""
        for (let i in this.$refs.files.files) {
          if (i === 'length') {
            break
          }
          this.fileName += this.$refs.files.files[i].name
          this.fileName += " "

        }
        console.log(this.fileName)
      },
      upload(){
        if(this.fileName=='未选择任何文件'){
          this.commit(false);
        }
        else{
        let file_info = new FormData(this.$refs.upload)
        console.log(file_info)
        const _this = this
        this.is_uploading = true
        this.$http.post(type_map[this.data.type], file_info, {
          'Content-Type': 'multipart/form-data',
          'processData': false,
          progress(e) {
            if (e.lengthComputable) {
              _this.progress = parseInt(e.loaded / e.total * 100);
            }
          }
        }).then(res => {
//          this.totalAmount=[]
//          this.checkedAll=false
//          this.checked=[]
          console.log('success', res)
          if (res.body.state === 1) {
            this.commit(true)
          }
        }, err => {
          console.log(err)
          this.$hint(err.data.msg, 'error')
        })}
      },
      cancel(){
        this.commit(true)
      },
    }
  }
</script>
