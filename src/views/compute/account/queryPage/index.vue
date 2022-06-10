<template>
  <div class="app-container">
    <div class="filter-container">
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

          <el-table-column
            align="center"
            label="direction"
            prop="direction"
            :filters="[{text: 'Receive', value: 'Receive'}, {text: 'Send', value: 'Send'}]"
            :filter-method="filterHandler"
          >
            <template slot-scope="{ row }">
              <span>{{ row.direction }}</span>
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

          <el-table-column align="center" label="amount">
            <template slot-scope="{ row }">
              <span>{{ row.amount }}</span>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </div>
  </div></template>

<script>
import { queryAccountBlockList, queryAccountBalance } from '@/api/compute'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'Account',
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
    this.$bus.$on('send_account', this.getAccount)
    this.$bus.$on('query_record', this.getList)
  },
  methods: {
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
<style>
.app-container {
  padding: 10px;
}
</style>
