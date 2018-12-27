/**
 * Created by meiyun1 on 2017/8/9.
 */
import Vue from 'vue'
import params from '../configs/parameter'

export default {
  getOssUploadConfig (search) {
    return Vue.http.get(`${params.apiBaseUrl}/v1/web/oss/upload/config`, { params: search })
  },
  createFile (data) {
    return Vue.http.post(`${params.apiBaseUrl}/v1/file/create`, data)
  }
}
