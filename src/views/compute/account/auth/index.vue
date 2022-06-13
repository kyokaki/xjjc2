<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Account Authentication</span>
        </div>
        <el-form ref="form" :model="form" size="mini" :rules="rules" label-position="left" :disabled="disabledFlag">
          <el-form-item label="keystore" prop="keystore">
            <el-input v-model="form.keystore" type="textarea" rows="3" :placeholder="keystorePlaceholder" />
          </el-form-item>
          <el-form-item label="keystore password" prop="password">
            <el-input v-model="form.password" type="password" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleCheck">Check</el-button>
          </el-form-item>
        </el-form>
      </el-card>

    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Mcp from 'mcp.js'
import { mapActions } from 'vuex'
export default {
  name: 'Auth',
  directives: { waves },
  data() {
    return {
      rules: {
        keystore: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }]
      },
      form: {
        keystore: undefined,
        password: undefined
      },
      mcp: undefined,
      disabledFlag: false,
      keystorePlaceholder: '{"account":"0x2A6959d2eB8210D6E90Fcf4B8D734946A8xxxxxx","kdf_salt":"43DE10873AF07430E58C7A9300xxxxxx","iv":"F0016405DEB5FE645C8C4AE33Exxxxxx","ciphertext":"06D9CBC5EE7F486264A4F841525A701A85F9DA53A0EE2CAFA0C998E7ACxxxxxx"}'
    }
  },
  created() {
    this.mcp = new Mcp('https://huygens.computecoin.network/')
  },
  methods: {
    ...mapActions({
      setCompute: 'compute/setCompute'
    }),
    handleCheck() {
      this.$refs['form'].validate(vali => {
        if (vali) {
          this.onCheck()
        }
      })
    },
    async onCheck() {
      const importResult = await this.accountImport()
      console.log('#importResult# ' + JSON.stringify(importResult))
      if (importResult.code !== 0) {
        return this.$message.error('fail: ' + importResult.msg)
      }
      const unlockResult = await this.accountUnlock(importResult)
      if (unlockResult.code === 0) {
        this.keepContent()
        return this.$message.success('CHECK Account Authentication: ' + unlockResult.msg)
      } else {
        return this.$message.error('CHECK Account Authentication: ' + unlockResult.msg)
      }
    },
    keepContent() {
      this.setCompute({
        key: 'keystore',
        value: this.form.keystore
      })
      this.setCompute({
        key: 'keystorePwd',
        value: this.form.password
      })
      this.disabledFlag = true
    },
    accountUnlock(importResult) {
      try {
        const { account } = importResult
        const pwd = this.form.password
        return this.mcp.request.accountUnlock(account, pwd)
      } catch (e) {
        return this.$message.error('accountImport fail ')
      }
    },
    accountImport() {
      try {
        const jsonFile = this.form.keystore
        return this.mcp.request.accountImport(jsonFile)
      } catch (e) {
        return this.$message.error('accountImport fail ')
      }
    }
  }
}
</script>
<style scoped>

</style>
