<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { HomeFilled, Monitor, Warning } from '@element-plus/icons-vue'
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <el-menu
        router
        :default-active="$route.path"
        class="el-menu-vertical"
      >
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/device">
          <el-icon><Monitor /></el-icon>
          <span>设备管理</span>
        </el-menu-item>
        <el-menu-item index="/error">
          <el-icon><Warning /></el-icon>
          <span>错误查询</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <h2>设备管理系统</h2>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  height: 100vh;
}

.el-header {
  background-color: #409EFF;
  color: white;
  line-height: 60px;
  text-align: center;
}

.el-aside {
  background-color: #545c64;
}

.el-menu {
  border-right: none;
}

.el-menu-vertical {
  height: 100%;
  background-color: #545c64;
}

.el-menu-item {
  color: #fff;
}

.el-menu-item:hover {
  background-color: #409EFF;
}

.el-menu-item.is-active {
  background-color: #409EFF;
}
</style>
