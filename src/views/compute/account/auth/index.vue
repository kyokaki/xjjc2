<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Account Authentication</span>
        </div>
        <el-form ref="form" :model="form" size="mini" :rules="rules" label-position="left" :disabled="disabledFlag">

          <el-form-item>
            <el-button type="primary" @click="handleKeyStoreTemplate">Template</el-button>
          </el-form-item>
          <el-form-item label="keystore" prop="keystore">
            <el-input v-model="form.keystore" type="textarea" rows="4" :placeholder="keystorePlaceholder" />
          </el-form-item>

          <el-form-item label="keystore password" prop="password">
            <el-input v-model="form.password" type="password" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleCheck">Check</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card v-if="showKeystoreTemplate" class="box-card">
        <div slot="header" class="clearfix">
          <span>Keystore Template</span>
        </div>
        <div>
          <el-table
            v-loading="listLoading"
            :data="keystoreList"
            border
            fit
            highlight-current-row
            style="width: 100%"
            size="mini"
            empty-text="No data"
          >
            <el-table-column align="center" label="name">
              <template slot-scope="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="keystore">
              <template slot-scope="{ row }">
                <span>{{ row.keystore }}</span>
              </template>
            </el-table-column>

            <el-table-column
              fixed="right"
              label="operate"
              width="140"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click.native.prevent="handleUse(scope.$index, scope.row)"
                >
                  Use
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click.native.prevent="handleDelete(scope.$index, scope.row)"
                >
                  Del
                </el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>

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
      keystoreList: [],
      listLoading: false,
      showKeystoreTemplate: false,
      keystoreHistoryKey: 'KEYSTORE_HISTORY_KEY',
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
    handleUse(index, rows) {
      this.form.keystore = rows.keystore
    },
    handleDelete(index, rows) {
      this.$confirm('This operation will permanently delete the keystore, whether to continue?', 'warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.deleteKeystore(rows.name)
        this.$message({
          type: 'success',
          message: 'Successfully deleted!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Undeleted!'
        })
      })
    },
    handleKeyStoreTemplate() {
      this.getKeystoreList()
      this.showKeystoreTemplate = !this.showKeystoreTemplate
    },
    openSaveMessageBox() {
      this.$prompt('Please enter keystore template name', 'Keystore Template', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      }).then(({ value }) => {
        this.keepKeystore(value, this.form.keystore)
        this.$message({
          type: 'success',
          message: 'New Keystore Template: ' + value
        })
        this.getKeystoreList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Cancel Created'
        })
      })
    },
    getKeystoreList() {
      const keystoreStr = localStorage.getItem(this.keystoreHistoryKey)
      this.keystoreList = keystoreStr ? JSON.parse(keystoreStr) : []
    },
    deleteKeystore(name) {
      const keystoreStr = localStorage.getItem(this.keystoreHistoryKey)
      let keystoreArray = []
      if (keystoreStr) {
        keystoreArray = JSON.parse(keystoreStr)
        keystoreArray = keystoreArray.filter(item => {
          return item.name !== name
        })
      }
      localStorage.setItem(this.keystoreHistoryKey, JSON.stringify(keystoreArray))
      this.getKeystoreList()
    },
    keepKeystore(name, keystore) {
      keystore = typeof keystore === 'string' ? keystore : JSON.stringify(keystore)
      const keystoreStr = localStorage.getItem(this.keystoreHistoryKey)
      let keystoreArray = []
      if (keystoreStr) {
        keystoreArray = JSON.parse(keystoreStr)
      }
      keystoreArray.push({ name, keystore })
      debugger
      keystoreArray = [...new Set(keystoreArray.map(item => JSON.stringify(item)))].map(item => JSON.parse(item))
      localStorage.setItem(this.keystoreHistoryKey, JSON.stringify(keystoreArray))
    },
    handleClose(done) {
      this.$confirm('Confirm to close?', '', {
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm'
      })
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
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
        this.$message.success('CHECK Account Authentication: ' + unlockResult.msg)
        return this.askForTemplate()
      } else {
        return this.$message.error('CHECK Account Authentication: ' + unlockResult.msg)
      }
    },
    askForTemplate() {
      setTimeout(() => {
        this.$confirm('Do you need to save the keystore as a template?', '', {
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Confirm'
        })
          .then(_ => {
            this.openSaveMessageBox()
          })
          .catch(_ => {})
      }, 300)
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
.filter-container {
  display: flex;
}
.box-card {
  width: 50%;
  min-height: 350px;
  flex:1;
}
</style>
