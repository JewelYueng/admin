<template>
  <div class="upload">
    <button @click="cancel" style="position: absolute;right: 0px;top: 5px;
       color: #324157;background-color: white;border: none;cursor: pointer">
      <i class="el-icon-close"></i>
    </button>
    <el-upload
      class="upload-demo"
      ref="upload"
      name="files"
      multiple
      accept=".jar"
      headers="header"
      :action="action_url"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>

      <div slot="tip" class="el-upload__tip">只能上传一个或多个jar包</div>
    </el-upload>
    <div>
      <el-button type="primary" v-on:click="upload">上传</el-button>
      <el-button v-on:click="cancel">取消</el-button>
    </div>
  </div>
</template>

<style scoped lang="less" rel="stylesheet/less">
  .upload {
    position: relative;
    background-color: white;
    width: 500px;
    box-shadow: 0 0 3px 0 #324157;
    border-radius: 5px;
    padding: 20px;
    div {
      margin: 20px;
    }
  }

  .file {
    position: relative;
    height: 40px;
    line-height: 40px;
  }

  .file label {
    display: inline-block;
  }

  .userdefined-file {
    position: absolute;
    top: 0;
    left: 20px;
    z-index: 2;
    width: 380px;
    height: 30px;
    line-height: 30px;
    font-size: 0; /*应对子元素为 inline-block 引起的外边距*/
  }

  .userdefined-file input[type="text"] {
    display: inline-block;
    vertical-align: middle;
    padding-right: 14px;
    padding-left: 14px;
    width: 300px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .userdefined-file label {
    display: inline-block;
    vertical-align: middle;
    width: 80px;
    text-align: center;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    background-color: #20A0FF;
    border: none;
    color: white;
    cursor: pointer;
  }

  .file input[type="file"] {
    position: absolute;
    top: 0;
    left: 60px;
    z-index: 3;
    opacity: 0;
    width: 300px;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
  }

</style>

<script>
  import BaseBox from './BaseBox'
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
        fileList: [],
        header: {
          'Content-Type' : 'multipart/form-data'
        }
      }
    },
    computed: {
      action_url(){
        return type_map[this.data.type]
      }
    },
    mixins: [BaseBox],
    methods: {
      upload(){
        this.$refs.upload.submit();
//        let file_info = new FormData()
//        file_info.append('isShare', Number(this.share_status))
//        file_info.append('file', this.$refs.file.files[0])
//        file_info.append('format', this.$refs.file.files[0].name.split('.').pop())
//        const _this = this
//        this.is_uploading = true
//        this.$http.post(type_map[this.data.type], file_info, {
//          contentType: 'multipart/form-data',
//          progress(e) {
//            if (e.lengthComputable) {
//              _this.progress = parseInt(e.loaded / e.total * 100);
//            }
//          }
//
//        }).then(res => {
////          this.totalAmount=[]
////          this.checkedAll=false
////          this.checked=[]
//          console.log('success', res)
//          if (res.body.code === 1) {
//            this.commit(true)
//          }
//        }, err => {
//          console.log(err)
//          this.$hint(err.data.msg, 'error')
//        })
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      cancel(){
        this.commit(true)
      },
    }
  }
</script>
