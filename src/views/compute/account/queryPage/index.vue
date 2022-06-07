<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :inline="true" :model="listQuery" class="demo-form-inline" :rules="rules">
        <el-form-item label="账户地址" size="mini" prop="account">
          <el-input
            v-model="listQuery.account"
            placeholder="账户地址"
            style="width: 400px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <div>
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleFilter"
          >
            查询
          </el-button>
          <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            icon="el-icon-refresh-left"
            size="mini"
            @click="onReset"
          >
            重置
          </el-button>
        </div>
      </el-form>
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
      >
        <el-table-column width="300px" align="center" label="time">
          <template slot-scope="{ row }">
            <span>{{ row.mcTime }}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="100px"
          align="center"
          label="direction"
          prop="direction"
          :filters="[{text: 'Receive', value: 'Receive'}, {text: 'Send', value: 'Send'}]"
          :filter-method="filterHandler"
        >
          <template slot-scope="{ row }">
            <span>{{ row.from == listQuery.account ? "Send" : "Receive" }}</span>
          </template>
        </el-table-column>

        <el-table-column width="300px" align="center" label="from" prop="from">
          <template slot-scope="{ row }">
            <span>{{ row.from }}</span>
          </template>
        </el-table-column>

        <el-table-column width="300px" align="center" label="to">
          <template slot-scope="{ row }">
            <span>{{ row.content ? row.content.to : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column width="300px" align="center" label="amount">
          <template slot-scope="{ row }">
            <span>{{ row.content ? row.content.amount :'' }}</span>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>
import { queryAccountBlockList } from '@/api/compute'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'ComplexTable',
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
      rules: {
        account: [{ required: true, trigger: 'blur', message: 'account 必须填写' }]
      }
    }
  },
  created() {
  },
  methods: {
    filterHandler(value, row, column) {
      if (value === 'Receive') {
        return row['from'] !== this.listQuery.account
      } else if (value === 'Send') {
        return row['from'] === this.listQuery.account
      }
    },
    cellStyle({ row, column }) {
      if (row.from && row.from === this.listQuery.account && (column.property === 'from' || column.property === 'direction')) {
        return {
          'backgroundColor': '#67C23A',
          'color': 'white'
        }
      }
    },
    handleFilter() {
      this.$refs['form'].validate(vali => {
        if (vali) {
          this.getList()
        }
      })
    },
    getList() {
      this.listLoading = true
      queryAccountBlockList(this.listQuery).then((response) => {
        this.list = response.data.list
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    onReset() {
      this.listQuery = {}
      this.listQuery.currentPage = 1
      this.listQuery.pageSize = 5
    }
  }
}
</script>
