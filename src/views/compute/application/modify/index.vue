<template>
  <div class="app-container">
    <div>
      <el-form ref="form" :rules="rules" :model="form" label-width="120px">

        <el-form-item label="应用名" prop="appName">
          <el-input v-model="form.appName" :disabled="true" />
        </el-form-item>
        <el-form-item label="应用中文名" prop="appNameZh">
          <el-input v-model="form.appNameZh" />
        </el-form-item>
        <el-form-item label="应用owner" prop="owner">
          <el-input v-model="form.owner" />
        </el-form-item>
        <el-form-item label="开发语言" prop="language">
          <el-input v-model="form.language" />
        </el-form-item>
        <el-form-item label="git地址" prop="gitAddress">
          <el-input v-model="form.gitAddress" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" round="round" icon="el-icon-edit" @click="handleCreate">修改</el-button>
          <el-button type="primary" round="round" icon="el-icon-refresh-left" @click="onReset">重置</el-button>
          <el-button type="primary" round="round" icon="el-icon-s-platform" @click="onBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-dialog width="20%" :title="dialogTitle" :visible.sync="dialogFormVisible">
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" icon="el-icon-close" @click="onCancel">
            取消
          </el-button>
          <el-button type="danger" icon="el-icon-check" :loading="confirmLoading" @click="onSubmit()">
            确认
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { modifyApplication } from '@/api/compute'

export default {
  data() {
    return {
      confirmLoading: false,
      dialogFormVisible: false,
      dialogTitle: '提示，请确认是否提交修改？',
      rules: {
        appName: [{ required: true, message: '应用名称不允许为空', trigger: 'change' }],
        appNameZh: [{ required: true, message: '应用中文名称不允许为空', trigger: 'change' }],
        owner: [{ required: true, message: '应用owner不允许为空', trigger: 'change' }],
        language: [{ required: true, message: '开发语言不允许为空', trigger: 'change' }],
        gitAddress: [{ required: true, message: 'git地址不允许为空', trigger: 'change' }]
      },
      form: this.$route.query,
      editRow: Object.assign({}, this.$route.query) // copy obj
    }
  },
  methods: {
    onReset() {
      console.log('reset before form:', this.form)
      this.form = this.editRow
      this.editRow = Object.assign({}, this.form)
      console.log('reset after form:', this.form)
      this.$message({
        message: '重置!',
        type: 'info'
      })
    },
    onBack() {
      this.$router.back()
    },
    handleCreate() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = true
        }
      })
    },
    onCancel() {
      this.dialogFormVisible = false
      this.confirmLoading = false
    },
    onSubmit() {
      this.$message('提交')
      this.confirmLoading = true
      modifyApplication(this.form).then(response => {
        const { data } = response
        console.log('response.data=', data)
        this.dialogFormVisible = false
        if (data) {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.$router.back()
        }
      })
    }
  }
}
</script>

