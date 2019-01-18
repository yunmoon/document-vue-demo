<template>
    <div></div>
</template>

<script>
export default {
  name: 'Oauth',
  created () {
    const query = this.$route.query
    const token = query.access_token
    if (!token) {
      this.$message.error('登录认证失败')
      return false
    }
    this.$store.commit('user/setToken', token)
    this.$router.push({ name: 'documentList' })
  }
}
</script>
