<template>
  <div class="welcome-container">
    <el-card class="welcome-card">
      <h1>欢迎使用设备管理系统</h1>
      <p>这是一个基于 Vue 3 + Element Plus 的设备管理系统</p>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Welcome'
}
</script>

<style scoped>
.welcome-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.welcome-card {
  width: 500px;
  text-align: center;
  padding: 20px;
}

.welcome-card h1 {
  margin-bottom: 20px;
}
</style> 