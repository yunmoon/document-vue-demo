const documentServer = 'http://192.168.0.197:8089'
module.exports = {
  lintOnSave: undefined,
  devServer: {
    proxy: {
      '/v1': {
        target: 'http://192.168.0.197',
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
