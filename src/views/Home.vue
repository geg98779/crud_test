<template>
  <el-container class="home-container">
    <!-- 侧边栏 -->
    <el-aside width="200px">
      <el-menu
        :default-active="activePath"
        class="el-menu-vertical"
        background-color="#333744"
        text-color="#fff"
        active-text-color="#409EFF"
        unique-opened
        router>
        <el-menu-item index="/welcome">
          <i class="el-icon-menu"></i>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/device">
          <i class="el-icon-s-platform"></i>
          <span>设备管理</span>
        </el-menu-item>
        <el-menu-item index="/device-error">
          <i class="el-icon-warning"></i>
          <span>设备错误信息</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 右侧内容区 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>
          <span>设备管理系统</span>
        </div>
      </el-header>
      <!-- 主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      activePath: this.$route.path
    }
  },
  watch: {
    $route: {
      handler(newVal) {
        this.activePath = newVal.path
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}

.el-menu {
  border-right: none;
}
</style> 