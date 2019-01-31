const documentServer = 'http://192.168.0.179:8089'
const parallelServer = 'http://127.0.0.1'
module.exports = {
  lintOnSave: undefined,
  devServer: {
    proxy: {
      '/v1': {
        target: parallelServer,
        changeOrigin: true
      },
      '/user/documents': {
        target: documentServer,
        changeOrigin: true
      },
      '/document/config': {
        target: documentServer,
        changeOrigin: true
      },
      '/document': {
        target: documentServer,
        changeOrigin: true
      },
      '/qrlogin/config': {
        target: documentServer,
        changeOrigin: true
      }
    }
  }
}
