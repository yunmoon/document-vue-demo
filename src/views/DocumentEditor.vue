<template>
    <div class="editor-wrap" ref="editorWrap">
        <div ref="documentEditor" id="documentEditor"></div>
    </div>
</template>

<script>
import documentApi from '@/api/document'
import { mapGetters } from 'vuex'
export default {
  name: 'DocumentEditor',
  computed: {
    ...mapGetters('user', {
      userInfo: 'user',
      token: 'token'
    })
  },
  data () {
    return {
      editor: null,
      from: null
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.from = from
    })
  },
  created () {
    console.log(this.$route)
  },
  mounted () {
    const self = this
    self.getDocumentEditConfig().then(data => {
      data.config.events = {
        onReady () {
          console.log('ready')
        },
        onRequestHistory (event) {
          const historyObj = data.history.history || null
          self.editor.refreshHistory(
            {
              currentVersion: data.file.version,
              history: historyObj
            })
        },
        onRequestHistoryData (event) {
          const version = event.data
          const historyData = data.history.historyData || null
          let history = null
          console.log(historyData)
          if (historyData) {
            history = historyData.find(item => {
              return item.version === version
            })
          }
          console.log(event, history)
          self.editor.setHistoryData(history)
        },
        onRequestHistoryClose () {
          window.location.reload()
        },
        onError (event) {
          if (event) {
            console.log(event.data)
          }
        }
      }
      self.editor = new window.DocsAPI.DocEditor(this.$refs['documentEditor'].getAttribute('id'), data.config)
      this.fixSize()
      if (window.addEventListener) {
        window.addEventListener('resize', this.fixSize)
      } else if (window.attachEvent) {
        window.attachEvent('onresize', this.fixSize)
      }
    })
  },
  methods: {
    getDocumentEditConfig () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let mode = 'view'
          if (this.token) {
            mode = this.$route.query.mode || null
          }
          const params = {
            mode,
            type: this.$route.query.type || null,
            uid: this.userInfo ? this.userInfo.id : 0,
            nickname: this.userInfo ? this.userInfo.name : '游客',
            fileId: this.$route.params.fileId,
            backUrl: `${window.location.protocol}//${window.location.host}/#${this.from.path}`,
            documentCallback: encodeURIComponent('http://192.168.0.197:8082/document/callback')
          }
          documentApi.getDocumentEditConfig(params).then(response => {
            resolve(response.data.data)
          }).catch(error => {
            if (error.response) {
              reject(error.response.data.data)
            } else {
              reject(error)
            }
          })
        }, 200)
      })
    },
    fixSize () {
      const wrapEl = this.$refs['editorWrap']
      // console.log(wrapEl.style)
      if (wrapEl) {
        let height = window.screen.availHeight
        window.scrollTo(0, -1)
        height = window.innerHeight

        wrapEl.style.height = `${height - 40}px`
      }
    }
  }
}
</script>

<style scoped>

</style>
