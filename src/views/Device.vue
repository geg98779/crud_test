<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>设备管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入设备名称" v-model="queryInfo.query" clearable @clear="getDeviceList">
            <template #append>
              <el-button icon="el-icon-search" @click="getDeviceList"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加设备</el-button>
        </el-col>
      </el-row>

      <!-- 设备列表区域 -->
      <el-table :data="deviceList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="设备名称" prop="name"></el-table-column>
        <el-table-column label="设备类型" prop="type"></el-table-column>
        <el-table-column label="设备状态" prop="status">
          <template #default="scope">
            <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'">
              {{scope.row.status === '1' ? '正常' : '故障'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template #default="scope">
            <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="removeDevice(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加设备的对话框 -->
    <el-dialog title="添加设备" v-model="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-input v-model="addForm.type"></el-input>
        </el-form-item>
        <el-form-item label="设备状态" prop="status">
          <el-select v-model="addForm.status" placeholder="请选择">
            <el-option label="正常" value="1"></el-option>
            <el-option label="故障" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDevice">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改设备的对话框 -->
    <el-dialog title="修改设备" v-model="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-input v-model="editForm.type"></el-input>
        </el-form-item>
        <el-form-item label="设备状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择">
            <el-option label="正常" value="1"></el-option>
            <el-option label="故障" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDevice">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取设备列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      deviceList: [],
      total: 0,
      // 控制添加设备对话框的显示与隐藏
      addDialogVisible: false,
      // 添加设备的表单数据
      addForm: {
        name: '',
        type: '',
        status: '1'
      },
      // 添加表单的验证规则对象
      addFormRules: {
        name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入设备类型', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择设备状态', trigger: 'change' }
        ]
      },
      // 控制修改设备对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的设备信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入设备类型', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择设备状态', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getDeviceList()
  },
  methods: {
    // 获取设备列表
    async getDeviceList() {
      const { data: res } = await this.$http.get('devices', {
        params: this.queryInfo
      })
      if (res.status !== 0) {
        return this.$message.error('获取设备列表失败！')
      }
      this.deviceList = res.data
      this.total = res.total
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getDeviceList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getDeviceList()
    },
    // 监听添加设备对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新设备
    addDevice() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('devices', this.addForm)
        if (res.status !== 0) {
          return this.$message.error('添加设备失败！')
        }
        this.$message.success('添加设备成功！')
        this.addDialogVisible = false
        this.getDeviceList()
      })
    },
    // 展示编辑设备的对话框
    showEditDialog(device) {
      this.editForm = JSON.parse(JSON.stringify(device))
      this.editDialogVisible = true
    },
    // 监听修改设备对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改设备信息并提交
    editDevice() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'devices/' + this.editForm.id,
          this.editForm
        )
        if (res.status !== 0) {
          return this.$message.error('更新设备信息失败！')
        }
        this.$message.success('更新设备信息成功！')
        this.editDialogVisible = false
        this.getDeviceList()
      })
    },
    // 根据Id删除对应的设备信息
    async removeDevice(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该设备, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('devices/' + id)
      if (res.status !== 0) {
        return this.$message.error('删除设备失败！')
      }
      this.$message.success('删除设备成功！')
      this.getDeviceList()
    }
  }
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}

.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}

.el-table {
  margin-top: 15px;
  font-size: 12px;
}

.el-pagination {
  margin-top: 15px;
}
</style> 