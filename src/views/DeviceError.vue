<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>设备错误信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入设备名称" v-model="queryInfo.deviceName" clearable @clear="getErrorList">
            <template #append>
              <el-button icon="el-icon-search" @click="getErrorList"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleDateChange">
          </el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加错误信息</el-button>
        </el-col>
      </el-row>

      <!-- 错误信息列表区域 -->
      <el-table :data="errorList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="设备名称" prop="deviceName"></el-table-column>
        <el-table-column label="错误类型" prop="errorType"></el-table-column>
        <el-table-column label="错误描述" prop="description"></el-table-column>
        <el-table-column label="发生时间" prop="occurrenceTime"></el-table-column>
        <el-table-column label="状态" prop="status">
          <template #default="scope">
            <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'">
              {{scope.row.status === '1' ? '已解决' : '未解决'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template #default="scope">
            <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="removeError(scope.row.id)"></el-button>
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

    <!-- 添加错误信息的对话框 -->
    <el-dialog title="添加错误信息" v-model="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="addForm.deviceName"></el-input>
        </el-form-item>
        <el-form-item label="错误类型" prop="errorType">
          <el-input v-model="addForm.errorType"></el-input>
        </el-form-item>
        <el-form-item label="错误描述" prop="description">
          <el-input type="textarea" v-model="addForm.description"></el-input>
        </el-form-item>
        <el-form-item label="发生时间" prop="occurrenceTime">
          <el-date-picker
            v-model="addForm.occurrenceTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="addForm.status" placeholder="请选择">
            <el-option label="已解决" value="1"></el-option>
            <el-option label="未解决" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addError">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改错误信息的对话框 -->
    <el-dialog title="修改错误信息" v-model="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="editForm.deviceName"></el-input>
        </el-form-item>
        <el-form-item label="错误类型" prop="errorType">
          <el-input v-model="editForm.errorType"></el-input>
        </el-form-item>
        <el-form-item label="错误描述" prop="description">
          <el-input type="textarea" v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="发生时间" prop="occurrenceTime">
          <el-date-picker
            v-model="editForm.occurrenceTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择">
            <el-option label="已解决" value="1"></el-option>
            <el-option label="未解决" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editError">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取错误列表的参数对象
      queryInfo: {
        deviceName: '',
        startTime: '',
        endTime: '',
        pagenum: 1,
        pagesize: 2
      },
      dateRange: [],
      errorList: [],
      total: 0,
      // 控制添加错误信息对话框的显示与隐藏
      addDialogVisible: false,
      // 添加错误信息的表单数据
      addForm: {
        deviceName: '',
        errorType: '',
        description: '',
        occurrenceTime: '',
        status: '0'
      },
      // 添加表单的验证规则对象
      addFormRules: {
        deviceName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        errorType: [
          { required: true, message: '请输入错误类型', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入错误描述', trigger: 'blur' }
        ],
        occurrenceTime: [
          { required: true, message: '请选择发生时间', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      // 控制修改错误信息对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的错误信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        deviceName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        errorType: [
          { required: true, message: '请输入错误类型', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入错误描述', trigger: 'blur' }
        ],
        occurrenceTime: [
          { required: true, message: '请选择发生时间', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getErrorList()
  },
  methods: {
    // 获取错误列表
    async getErrorList() {
      const { data: res } = await this.$http.get('device-errors', {
        params: this.queryInfo
      })
      if (res.status !== 0) {
        return this.$message.error('获取错误列表失败！')
      }
      this.errorList = res.data
      this.total = res.total
    },
    // 监听日期选择器的变化
    handleDateChange() {
      if (this.dateRange) {
        this.queryInfo.startTime = this.dateRange[0]
        this.queryInfo.endTime = this.dateRange[1]
      } else {
        this.queryInfo.startTime = ''
        this.queryInfo.endTime = ''
      }
      this.getErrorList()
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getErrorList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getErrorList()
    },
    // 监听添加错误信息对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新错误信息
    addError() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('device-errors', this.addForm)
        if (res.status !== 0) {
          return this.$message.error('添加错误信息失败！')
        }
        this.$message.success('添加错误信息成功！')
        this.addDialogVisible = false
        this.getErrorList()
      })
    },
    // 展示编辑错误信息的对话框
    showEditDialog(error) {
      this.editForm = JSON.parse(JSON.stringify(error))
      this.editDialogVisible = true
    },
    // 监听修改错误信息对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改错误信息并提交
    editError() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'device-errors/' + this.editForm.id,
          this.editForm
        )
        if (res.status !== 0) {
          return this.$message.error('更新错误信息失败！')
        }
        this.$message.success('更新错误信息成功！')
        this.editDialogVisible = false
        this.getErrorList()
      })
    },
    // 根据Id删除对应的错误信息
    async removeError(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该错误信息, 是否继续?',
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
      const { data: res } = await this.$http.delete('device-errors/' + id)
      if (res.status !== 0) {
        return this.$message.error('删除错误信息失败！')
      }
      this.$message.success('删除错误信息成功！')
      this.getErrorList()
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