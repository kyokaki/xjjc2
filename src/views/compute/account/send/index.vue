<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="form" label-width="200px" size="mini" :rules="rules">
        <el-form-item label="keystore" prop="keystore">
          <el-input v-model="form.keystore" type="textarea" rows="3"/>
        </el-form-item>
        <el-form-item label="password" prop="password">
          <el-input v-model="form.password" type="password"/>
        </el-form-item>

        <el-form-item label="sendToAndAmount" prop="sendToAndAmount">
          <el-input v-model="form.sendToAndAmount" type="textarea" rows="5"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">GO</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Mcp from 'mcp.js'

export default {
  name: 'Send',
  directives: {waves},
  data() {
    return {
      rules: {
        keystore: [{required: true, trigger: 'blur'}],
        password: [{required: true, trigger: 'blur'}],
        sendToAndAmount: [{required: true, trigger: 'blur'}]
      },
      form: {
        keystore: undefined,
        password: undefined,
        sendToAndAmount: undefined
      },
      mcp: undefined,
      separator: '::,::',
      gasParams: {
        from: undefined,
        to: undefined,
        amount: undefined,
        data: '',
        mci: '838'
      },
      sendParams: {
        from: undefined,
        to: undefined,
        amount: undefined,
        password: undefined,
        gas: undefined,
        gas_price: '1000000000',
        data: ''
      }
    }
  },
  watch: {
    'form.keystore': {
      handler(newVal, oldVal) {
        try {
          const account = JSON.parse(newVal).account
          this.$bus.$emit('send_account', account)
        } catch (error) {
          return this.$message.error('keystore wrong format ')
        }
      },
      deep: true
    }
  },
  created() {
    this.mcp = new Mcp('https://huygens.computecoin.network/')
  },
  methods: {
    handleSubmit() {
      this.$refs['form'].validate(vali => {
        if (vali) {
          this.onSubmit()
        }
      })
    },
    async onSubmit() {
      let importResult = {}
      try {
        importResult = await this.accountImport()
        console.log('#importResult# ' + JSON.stringify(importResult))
        if (importResult.code != 0) {
          return this.$message.error('fail: ' + importResult.msg)
        }
        this.gasParams.from = importResult.account
      } catch (e) {
        return this.$message.error('accountImport fail ')
      }
      let sendObjList = []
      try {
        sendObjList = this.getSendObjList()
        console.log('######sendObjList# ' + sendObjList)
        console.log('#sendObjList# ' + JSON.stringify(sendObjList))
      } catch (error) {
        return this.$message.error('getSendObjList fail ')
      }
      let count = 0
      const hashs = new Set()
      const maxCount = sendObjList.length
      sendObjList.forEach(async (item) => {
        // 1.查询gas
        let gas = ''
        try {
          const gasResult = await this.estimateGas(item)
          console.log('#gas# ' + JSON.stringify(gasResult))
          if (gasResult.code != 0) {
            return this.$message.error('fail: ' + gasResult.msg)
          }
          gas = gasResult.gas;
        } catch (error) {
          return this.$message.error('estimateGas fail ' + JSON.stringify(item))
        }
        // 2.开始转账
        try {
          this.sendParams.from = importResult.account
          this.sendParams.to = item.to
          this.sendParams.amount = item.amount
          this.sendParams.gas = gas
          this.sendParams.password = this.form.password
          const sendResult = await this.sendBlock()
          console.log('#sendResult# ' + JSON.stringify(sendResult))
          if (sendResult.code != 0) {
            return this.$message.error('fail: ' + sendResult.msg)
          }
          if (sendResult && sendResult.code === 0) {
            hashs.add(sendResult.hash)
            count++
          } else if (sendResult && sendResult.code === 11) {
            return this.$message.error('sendBlock fail ' + sendResult.msg)
          }
        } catch (error) {
          return this.$message.error('sendBlock fail ' + JSON.stringify(this.sendParams))
        }
      })
      const timer = setInterval(() => {
        if (count >= maxCount) {
          clearInterval(timer)
          setTimeout(() => {
            this.$bus.$emit('query_record', [...hashs])
          }, 1000)
        }
      }, 1000)
    },
    sendBlock() {
      return this.mcp.request.sendBlock(this.sendParams)
    },
    estimateGas(req) {
      this.gasParams.to = req.to
      this.gasParams.amount = req.amount + ''
      console.log('#this.gasParams#' + JSON.stringify(this.gasParams))
      return this.mcp.request.estimateGas(this.gasParams)
    },
    getSendObjList() {
      return this.form.sendToAndAmount.split(/\s+/).map((item) => {
        const list = item.split(this.separator)
        return {
          to: list[0],
          amount: list[1] * Math.pow(10, 18)
        }
      })
    },
    accountImport() {
      const jsonFile = this.form.keystore
      return this.mcp.request.accountImport(jsonFile)
    }
  }
}
</script>
