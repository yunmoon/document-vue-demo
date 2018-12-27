<template>
    <div class="documents-wrap">
        <el-row class="toolbars">
            <file-upload :tips="false" class="document-upload" @upload-success="uploadSuccessHandle" @upload-progress="uploadProgressHandle">
                <el-button type="primary" slot="show" :loading="subLoading">上传文档</el-button>
            </file-upload>
            <el-button type="primary" @click="createDocument('word')">新建Word</el-button>
            <el-button type="primary" @click="createDocument('excel')">新建表格</el-button>
            <el-button type="primary" @click="createDocument('ppt')">新建幻灯片</el-button>
        </el-row>
        <el-table
                :data="documents"
                style="width: 100%">
            <el-table-column
                    prop="name"
                    label="文档">
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-button @click="editDocument(scope.row, 'edit')" type="text" size="small">编辑</el-button>
                    <el-button @click="editDocument(scope.row, 'review')" type="text" size="small">审查</el-button>
                    <el-button @click="editDocument(scope.row, 'view')" type="text" size="small">预览</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-wrap">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import documentApi from '@/api/document'
import fileUpload from '@/components/FileUpload'
import { mapGetters } from 'vuex'
export default {
  name: 'Document',
  components: {
    fileUpload
  },
  computed: {
    ...mapGetters('user', {
      userInfo: 'user'
    })
  },
  data () {
    return {
      limit: 10,
      page: 1,
      total: 0,
      documents: [],
      subLoading: false
    }
  },
  created () {
    this.getUserDocuments()
  },
  methods: {
    handleSizeChange (val) {
      this.limit = val
    },
    handleCurrentChange (val) {
      this.page = val
    },
    getUserDocuments () {
      documentApi.getDocuments(this.userInfo.id, this.limit, this.page).then(response => {
        // console.log(this.documents)
        this.documents = response.data.data.rows
        this.total = response.data.data.total
        // console.log(this.documents)
      })
    },
    editDocument (document, mode) {
      this.$router.push({
        path: `/document/editor/${document.fileId}`,
        query: {
          mode,
          type: 'desktop'
        }
      })
    },
    uploadProgressHandle () {
      this.subLoading = true
    },
    uploadSuccessHandle (file) {
      documentApi.createDocument({
        url: file.data.fullPath,
        uid: this.userInfo.id,
        nickname: this.userInfo.name,
        fileId: file.data.id,
        name: file.data.name
      }).then((response) => {
        this.subLoading = false
        const document = response.data.data
        this.$router.push({
          path: `/document/editor/${document.fileId}`,
          query: {
            mode: 'edit',
            type: 'desktop'
          }
        })
      }).catch(error => {
        this.subLoading = false
        if (error.response) {
          this.$message.error(error.response.data.message)
        } else {
          this.$message.error('上传失败')
        }
      })
    },
    createDocument (type) {
      this.$prompt('请输入文件名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator (val) {
          if (!val) {
            return '请输入文档名称'
          }
          return true
        }
      }).then(({ value }) => {
        documentApi.createNewDocument(type, {
          uid: this.userInfo.id,
          nickname: this.userInfo.name,
          fileName: value
        }).then(response => {
          const document = response.data.data
          this.$router.push({
            path: `/document/editor/${document.fileId}`,
            query: {
              mode: 'edit',
              type: 'desktop'
            }
          })
        }).catch(error => {
          if (error.response) {
            this.$message.error(error.response.data.message)
          } else {
            this.$message.error('创建失败')
          }
        })
      })
    }
  },
  watch: {
    limit () {
      this.getUserDocuments()
    },
    page () {
      this.getUserDocuments()
    }
  }
}
</script>

<style scoped>
    .documents-wrap{
        margin: 50px auto auto auto;
        width: 1200px;
    }
    .toolbars {
        text-align: left;
        margin-bottom: 10px;
    }
    .document-upload {
        display: inline-block;
        margin-right: 10px;
    }
    .pagination-wrap {
        margin-top: 10px;
        text-align: left;
    }
</style>
