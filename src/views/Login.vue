<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>文档管理系统</span>
        </div>
        <el-radio-group v-model="loginMethod" size="mini" class="radio-group">
            <el-radio-button label="password">密码登录</el-radio-button>
            <el-radio-button label="qrcode">扫码登录</el-radio-button>
        </el-radio-group>
        <el-form ref="form" :model="form" :rules="rules" label-width="60px" v-if="loginMethod === 'password'">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label-width="0">
                <el-button type="primary" @click="onSubmit" :loading="loginLoading">立即登录</el-button>
            </el-form-item>
        </el-form>
        <div class="qrcode-container" v-else>
            <div id="qrcode" ref="qrcode"></div>
            <p>扫一扫登录</p>
        </div>
    </el-card>
</template>

<script>
import QrcodeLogin from 'qrcode-login-sdk'
import authApi from '../api/auth'
export default {
  name: 'Login',
  data () {
    const checkUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入用户名'))
      }
      callback()
    }
    const checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入登录密码'))
      }
      callback()
    }
    return {
      form: {
        username: '',
        password: ''
      },
      loginLoading: false,
      qrClient: null,
      loginMethod: 'password',
      rules: {
        username: [
          { validator: checkUsername, trigger: 'blur' }
        ],
        password: [
          { validator: checkPassword, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loginLoading = true
          this.$store.dispatch('user/doLogin', this.form).then(() => {
            this.$notify.success({
              title: '提示',
              message: '登录成功'
            })
            this.loginLoading = false
            this.$router.push({ name: 'documentList' })
          }).catch(error => {
            this.loginLoading = false
            this.$notify.error({
              title: '提示',
              message: error.message
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    reloadQr () {
      authApi.getQrcodeLoginConfig().then(response => {
        this.qrClient.reloadQrcode(response.data.data)
      })
    }
  },
  watch: {
    loginMethod () {
      if (this.loginMethod === 'qrcode') {
        const self = this
        if (!this.qrClient) {
          authApi.getQrcodeLoginConfig().then(response => {
            const options = Object.assign(response.data.data, {
              reloadCallback () {
                self.reloadQr()
              },
              loginCallback (data) {
                if (data.action === 'confirm') {
                  self.$store.commit('user/setToken', data.loginData.token)
                  self.$notify.success({
                    title: '提示',
                    message: '登录成功'
                  })
                  self.qrClient.destroy()
                  self.$router.push({ name: 'documentList' })
                }
              }
            })
            options.apiHost = 'http://127.0.0.1:8087'
            this.qrClient = new QrcodeLogin(`#${this.$refs['qrcode'].getAttribute('id')}`, options)
          })
        } else {
          this.reloadQr()
        }
      }
    }
  }
}
</script>

<style scoped>
    .box-card {
        width: 540px;
        margin: 200px auto auto auto;
    }
    .clearfix{
        font-size: 24px;
    }
    .radio-group {
        margin-bottom: 10px;
    }
    #qrcode {
        margin-top: 20px;
    }
</style>
