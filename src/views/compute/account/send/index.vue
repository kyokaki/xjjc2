<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="form" label-width="200px" size="mini">
        <el-form-item label="keystore">
          <el-input v-model="form.keystore" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="password">
          <el-input v-model="form.password" type="password" />
        </el-form-item>

        <el-form-item label="sendToAndAmount">
          <el-input v-model="form.sendToAndAmount" type="textarea" rows="5" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">GO</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div></template>

<script>
import { queryAccountBlockList, queryAccountBalance } from '@/api/compute'
import waves from '@/directive/waves'
import Mcp from 'mcp.js'

export default {
  name: 'Send',
  directives: { waves },
  data() {
    return {
      form: {
        // keystore: undefined,
        //         password: undefined,
        // sendToAndAmount: undefined
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
        amount: undefined, // 1 CCN Token
        password: undefined,
        gas: undefined,
        gas_price: '1000000000',
        data: ''
      }
    }
  },
  created() {
    this.mcp = new Mcp('https://huygens.computecoin.network/')
  },
  methods: {
    async onSubmit() {
      const importResult = await this.accountImport()
      this.gasParams.from = importResult.account
      console.log('#importResult# ' + JSON.stringify(importResult))
      const sendObjList = this.getSendObjList()
      console.log('#sendObjList# ' + JSON.stringify(sendObjList))
      sendObjList.forEach(async(item) => {
        // 1.查询gas
        const gasResult = await this.estimateGas(item)
        console.log('#gas# ' + JSON.stringify(gasResult))
        const gas = gasResult.gas
        // 2.开始转账
        this.sendParams.from = importResult.account
        this.sendParams.to = item.to
        this.sendParams.amount = item.amount
        this.sendParams.gas = gas
        this.sendParams.password = this.form.password
        const sendResult = await this.sendBlock()
        console.log('#sendResult# ' + sendResult)
      })
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
    },
    getList() {
      this.listLoading = true
      queryAccountBlockList(this.listQuery).then((response) => {
        this.list = response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      queryAccountBalance(this.listQuery).then((response) => {
        this.accountBalance = response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    }
  }
}
</script>
