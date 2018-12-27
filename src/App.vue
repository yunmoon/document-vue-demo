<template>
  <div id="app">
    <div class="app-header" v-if="userInfo">
      <el-row :gutter="20">
        <el-col :span="16" class="left"><el-button type="text">{{userInfo.name}}您好，欢迎使用在线文档系统</el-button></el-col>
        <el-col :span="8" class="right"><el-button type="text" @click="loginOut">用户注销</el-button></el-col>
      </el-row>
    </div>
    <router-view/>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('user', {
      userInfo: 'user'
    })
  },
  methods: {
    loginOut () {
      this.$confirm('是否注销该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('user/loginOut')
        this.$router.push({ path: '/login' })
      })
    }
  }
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
body {
  margin: 0;
}
  .app-header{
    width: 1200px;
    margin: auto;
  }
  .app-header .left {
    text-align: left;
  }
.app-header .left .el-button--text {
  color: #909399;
}
.app-header .right {
  text-align: right;
}
</style>
