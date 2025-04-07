<template>
  <div class="error">
    <div class="search-container">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :default-time="[
              new Date(2000, 1, 1, 0, 0, 0),
              new Date(2000, 1, 1, 23, 59, 59),
            ]"
          />
        </el-form-item>
        <el-form-item label="错误类型">
          <el-select v-model="searchForm.errorType" placeholder="请选择错误类型">
            <el-option label="全部" value="" />
            <el-option label="连接错误" value="connection" />
            <el-option label="数据异常" value="data" />
            <el-option label="系统错误" value="system" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="errorList" style="width: 100%">
      <el-table-column prop="id" label="错误ID" width="180" />
      <el-table-column prop="deviceName" label="设备名称" width="180" />
      <el-table-column prop="errorType" label="错误类型">
        <template #default="scope">
          <el-tag :type="getErrorTypeTag(scope.row.errorType)">
            {{ getErrorTypeLabel(scope.row.errorType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="errorMessage" label="错误信息" />
      <el-table-column prop="timestamp" label="发生时间" width="180" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'resolved' ? 'success' : 'warning'">
            {{ scope.row.status === 'resolved' ? '已解决' : '未解决' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button 
            size="small" 
            type="primary" 
            @click="handleResolve(scope.row)"
            :disabled="scope.row.status === 'resolved'"
          >
            标记已解决
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({
  dateRange: [],
  errorType: ''
})

const errorList = ref([
  {
    id: 'ERR001',
    deviceName: '温度传感器1',
    errorType: 'connection',
    errorMessage: '设备连接超时',
    timestamp: '2024-04-07 10:00:00',
    status: 'unresolved'
  },
  {
    id: 'ERR002',
    deviceName: '控制器A',
    errorType: 'data',
    errorMessage: '数据异常：温度值超出范围',
    timestamp: '2024-04-07 09:30:00',
    status: 'resolved'
  }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const getErrorTypeTag = (type) => {
  const types = {
    connection: 'danger',
    data: 'warning',
    system: 'error'
  }
  return types[type] || 'info'
}

const getErrorTypeLabel = (type) => {
  const labels = {
    connection: '连接错误',
    data: '数据异常',
    system: '系统错误'
  }
  return labels[type] || '未知错误'
}

const handleSearch = () => {
  // 这里添加实际的搜索逻辑
  ElMessage.success('搜索条件已更新')
}

const handleReset = () => {
  searchForm.dateRange = []
  searchForm.errorType = ''
  handleSearch()
}

const handleResolve = (row) => {
  row.status = 'resolved'
  ElMessage.success('已标记为已解决')
}

const handleSizeChange = (val) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  handleSearch()
}
</script>

<style scoped>
.error {
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 