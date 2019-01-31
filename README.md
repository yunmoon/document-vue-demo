# document-vue-demo 在线编写文档demo
对接云平台账号体系，登录成功后可以上传文档，新建文档

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 文件配置
- src/configs/parameter.js  
```javascript
export default {
  apiBaseUrl: '',
  saveCallbackUrl: 'http://192.168.0.179:8081/document/callback' //保存文件到自己服务器的回调地址
}
```

- vue.config.js  
```js
const documentServer = 'http://192.168.0.179:8089' // document-server 服务器地址
const parallelServer = 'http://127.0.0.1' // 众望云平台后台地址（账号登录时需要调用相关接口）
```
