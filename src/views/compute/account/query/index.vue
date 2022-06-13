<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Split Record</span>
        </div>
        <el-form ref="form" :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item v-if="false" label="Account" size="mini" prop="account">
            <el-input
              v-model="listQuery.account"
              placeholder="Account"
              style="width: 400px"
              class="filter-item"
              :clearable="true"
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
        </el-form>
        <div style="margin-bottom:10px;font-size:16px">
          <el-tag>Account Balance: </el-tag> <span>{{ accountBalance }}</span>
        </div>

        <div>
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%"
            size="mini"
            :cell-style="cellStyle"
            empty-text="No data"
          >
            <el-table-column align="center" label="time">
              <template slot-scope="{ row }">
                <span>{{ row.mcTime }}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="from" prop="from">
              <template slot-scope="{ row }">
                <span>{{ row.from }}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="to">
              <template slot-scope="{ row }">
                <span>{{ row.to }}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="hash">
              <template slot-scope="{ row }">
                <span>{{ row.hash }}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="amount">
              <template slot-scope="{ row }">
                <span>{{ row.amount }}</span>
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
import moment from 'moment'

export default {
  name: 'Query',
  directives: { waves },
  data() {
    return {
      confirmLoading: false,
      tableKey: 0,
      list: null,
      listLoading: false,
      listQuery: {
        account: undefined
      },
      accountBalance: null
    }
  },
  created() {
    this.mcp = new Mcp('https://huygens.computecoin.network/')
    this.$bus.$on('send_account', this.getAccount)
    this.$bus.$on('query_record', this.queryRecord)
  },
  methods: {
    queryRecord(hashes) {
      this.getBlocks(hashes)
      this.getAccountBalance()
    },
    async getBlocks(hashes) {
      const result = []
      console.log('#receive hashes# ' + hashes)
      const { blocks } = await this.mcp.request.getBlocks(hashes)
      if (blocks?.length > 0) {
        blocks.forEach(async block => {
          const stateResult = await this.mcp.request.getBlockState(block.hash)
          console.log('#receive stateResult# ' + JSON.stringify(stateResult))
          const mc_timestamp = stateResult?.block_state?.stable_content?.mc_timestamp
          let time = ''
          if (mc_timestamp) {
            time = mc_timestamp ? moment.unix(mc_timestamp).utc().format() : ''
          }
          result.push({
            from: block.from,
            to: block?.content?.to,
            hash: block.hash,
            amount: block?.content?.amount,
            time
          })
        })
        console.log('#receive list#' + result)
        this.list = result
      }
    },
    async getAccountBalance() {
      const { balance } = await this.mcp.request.accountBalance(this.listQuery.account)
      if (balance) {
        this.accountBalance = balance
      }
    },
    getAccount(account) {
      console.log('#receive account# ' + account)
      this.listQuery.account = account
    },
    filterHandler(value, row, column) {
      return row['direction'] === value
    },
    cellStyle({ row, column }) {
      if (row.direction && row.direction === 'Send' && (column.property === 'from' || column.property === 'direction')) {
        return {
          'backgroundColor': '#67C23A',
          'color': 'white'
        }
      }
    }
  }
}
</script>
<style>
.app-container {
  padding: 10px;
}
</style>
