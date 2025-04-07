<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>设备总数</span>
            </div>
          </template>
          <div class="card-content">
            <el-statistic :value="deviceCount">
              <template #prefix>
                <el-icon><Monitor /></el-icon>
              </template>
            </el-statistic>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>今日错误数</span>
            </div>
          </template>
          <div class="card-content">
            <el-statistic :value="todayErrorCount">
              <template #prefix>
                <el-icon><Warning /></el-icon>
              </template>
            </el-statistic>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>在线设备数</span>
            </div>
          </template>
          <div class="card-content">
            <el-statistic :value="onlineDeviceCount">
              <template #prefix>
                <el-icon><Connection /></el-icon>
              </template>
            </el-statistic>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Monitor, Warning, Connection } from '@element-plus/icons-vue'

const deviceCount = ref(100)
const todayErrorCount = ref(5)
const onlineDeviceCount = ref(80)
</script>

<style scoped>
.home {
  padding: 20px;
}

.box-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  text-align: center;
  padding: 20px 0;
}

.el-statistic {
  font-size: 24px;
}
</style> 