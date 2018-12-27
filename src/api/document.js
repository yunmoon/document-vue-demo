import axios from 'axios'
import parameter from '../configs/parameter'
export default {
  getDocuments (uid, limit, page) {
    return axios.get(`${parameter.apiBaseUrl}/user/documents`, { params: { uid, limit, page } })
  },
  getDocumentEditConfig (params) {
    return axios.get(`${parameter.apiBaseUrl}/document/config`, { params })
  },
  createDocument (data) {
    return axios.post(`${parameter.apiBaseUrl}/document`, data)
  },
  createNewDocument (type, data) {
    return axios.post(`${parameter.apiBaseUrl}/new/document/${type}`, data)
  }
}
