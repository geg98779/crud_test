<template>
  <div class="device">
    <div class="header">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>添加设备
      </el-button>
    </div>

    <el-table :data="deviceList" style="width: 100%">
      <el-table-column prop="id" label="设备ID" width="180" />
      <el-table-column prop="name" label="设备名称" width="180" />
      <el-table-column prop="type" label="设备类型" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'online' ? 'success' : 'danger'">
            {{ scope.row.status === 'online' ? '在线' : '离线' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastUpdate" label="最后更新时间" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑设备对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加设备' : '编辑设备'"
      width="500px"
    >
      <el-form :model="deviceForm" label-width="100px">
        <el-form-item label="设备名称">
          <el-input v-model="deviceForm.name" />
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="deviceForm.type" placeholder="请选择设备类型">
            <el-option label="传感器" value="sensor" />
            <el-option label="控制器" value="controller" />
            <el-option label="摄像头" value="camera" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="deviceForm.status" placeholder="请选择状态">
            <el-option label="在线" value="online" />
            <el-option label="离线" value="offline" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const deviceList = ref([
  {
    id: '001',
    name: '温度传感器1',
    type: 'sensor',
    status: 'online',
    lastUpdate: '2024-04-07 10:00:00'
  },
  {
    id: '002',
    name: '控制器A',
    type: 'controller',
    status: 'offline',
    lastUpdate: '2024-04-07 09:30:00'
  }
])

const dialogVisible = ref(false)
const dialogType = ref('add')
const deviceForm = reactive({
  name: '',
  type: '',
  status: 'online'
})

const handleAdd = () => {
  dialogType.value = 'add'
  deviceForm.name = ''
  deviceForm.type = ''
  deviceForm.status = 'online'
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.assign(deviceForm, row)
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该设备吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = deviceList.value.findIndex(item => item.id === row.id)
    deviceList.value.splice(index, 1)
    ElMessage.success('删除成功')
  })
}

const handleSubmit = () => {
  if (dialogType.value === 'add') {
    deviceList.value.push({
      id: String(deviceList.value.length + 1).padStart(3, '0'),
      ...deviceForm,
      lastUpdate: new Date().toLocaleString()
    })
    ElMessage.success('添加成功')
  } else {
    const index = deviceList.value.findIndex(item => item.id === deviceForm.id)
    deviceList.value[index] = {
      ...deviceList.value[index],
      ...deviceForm,
      lastUpdate: new Date().toLocaleString()
    }
    ElMessage.success('更新成功')
  }
  dialogVisible.value = false
}
</script>

<style scoped>
.device {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 