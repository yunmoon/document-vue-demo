<template>
    <div>
        <el-upload
                :action="uploadAction"
                class="upload-demo"
                :drag="drag"
                :on-error="handleUploadError"
                :on-success="handleUploadSuccess"
                :on-progress="handleUploadProgress"
                name="file"
                :file-list="fileList"
                :show-file-list="showFileList"
                :data="uploadParams"
                :on-remove="handleRemove"
                :before-upload="beforeAvatarUpload"
                :multiple="isMultiple"
                :disabled="disabled"
                :on-preview="handlePreview">
            <slot name="show"></slot>
            <div class="el-upload__tip" slot="tip" v-if="tips">{{tips}}</div>
        </el-upload>
    </div>

</template>
<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import commonApi from '@/api/common'
export default {
  props: {
    maxCount: {},
    fileList: {
      type: Array,
      default () {
        return []
      }
    },
    drag: {
      type: Boolean,
      default: false
    },
    showFileList: {
      type: Boolean,
      default: false
    },
    isUploadToTemp: {
      type: Boolean,
      default: true
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    tips: {
      default: '支持png，jpg，mp4，word，excel，ppt，pdf，rar，zip等'
    },
    allowedTypes: {
      type: Array,
      default () {
        return []
      }
    },
    disabled: {
      default: false
    }
  },
  data () {
    return {
      fileCount: 0,
      uploadParams: {
      },
      uploadAction: ''
    }
  },
  computed: {
    ...mapGetters('user', [
      'token'
    ])
  },
  methods: {
    getOssUploadConfig (file, resolve, reject) {
      commonApi.getOssUploadConfig({
        type: 'file',
        temp: this.isUploadToTemp ? 1 : 0,
        suffix: this.get_suffix(file.name)
      }).then(response => {
        const res = response.data.data
        this.uploadAction = res.host
        const fileName = res.file_dir + new Date().getTime() + '_' + this.random_string(5) + '.' + this.get_suffix(file.name)
        file.uploadKey = fileName
        this.uploadParams = {
          key: fileName,
          policy: res.policy,
          OSSAccessKeyId: res.access_id,
          success_action_status: '200',
          signature: res.signature
        }
        resolve()
      }, response => {
        reject()
        this.$message.error(response.data.message)
      })
    },
    beforeAvatarUpload (file) {
      this.fileCount++
      if (this.fileCount > this.maxCount) {
        this.fileCount--
        this.$message.warning(`文件数量超过${this.maxCount}个`)
        return false
      }
      const self = this
      const nameArr = file.name && file.name.split('.')
      if (nameArr && nameArr[nameArr.length - 1] === 'rar') {
        file.fileType = 'rar'
      }
      if (this.allowedTypes.length) {
        if (this.allowedTypes.indexOf(file.type) === -1 && this.allowedTypes.indexOf(file.fileType) === -1) {
          this.$message.error('不允许上传的文件类型')
          return false
        }
      }
      return new Promise((resolve, reject) => {
        self.getOssUploadConfig(file, resolve, reject)
      })
    },
    get_suffix (filename) {
      const pos = filename.lastIndexOf('.')
      let suffix = ''
      if (pos !== -1) {
        suffix = filename.substring(pos + 1)
      }
      return suffix
    },
    random_string (len) {
      len = len || 32
      const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      const maxPos = chars.length
      let pwd = ''
      for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd
    },
    handleUploadError () {
      this.$message.error('文件上传失败，请检测文件大小或类型是否合格')
    },
    handleUploadProgress (event, file, fileList) {
      this.$emit('upload-progress', { event, file, fileList })
    },
    handleUploadSuccess (response, file, fileList) {
      if (!this.isMultiple) {
        _.remove(fileList, obj => {
          return obj.uid !== file.uid
        })
      }
      commonApi.createFile(
        {
          driver: 'oss',
          path: file.raw.uploadKey,
          file_name: file.name,
          type: 'file'
        }
      ).then(response => {
        file.response = response.data
        this.$emit('upload-success', response.data)
      }, response => {
        this.fileCount--
        this.$message.error(response.body.message)
        _.remove(fileList, obj => {
          return obj.uid === file.uid
        })
      })
    },
    handleRemove (file) {
      if (file.id) {
        this.$emit('remove-file', file)
      }
      if (file.response) {
        this.fileCount--
        this.$emit('remove-file', file.response)
      }
    },
    handlePreview (file) {
      file.id && window.open('/file/download/' + file.id)
      file.response && window.open('/file/download/' + file.response.data.id)
    }
  }
}
</script>
<style scoped>

</style>
