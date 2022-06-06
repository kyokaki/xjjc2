<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="账户编号" size="mini">
          <el-input
            v-model="listQuery.account"
            placeholder="账户编号"
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
      >
        <el-table-column width="300px" align="center" label="from">
          <template slot-scope="{ row }">
            <span>{{ row.from }}</span>
          </template>
        </el-table-column>

        <el-table-column width="300px" align="center" label="hash">
          <template slot-scope="{ row }">
            <span>{{ row.hash }}</span>
          </template>
        </el-table-column>

        <el-table-column width="300px" align="center" label="signature">
          <template slot-scope="{ row }">
            <span>{{ row.signature }}</span>
          </template>
        </el-table-column>

        <el-table-column width="50px" align="center" label="type">
          <template slot-scope="{ row }">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>

        <el-table-column width="600px" align="center" label="content">
          <template slot-scope="{ row }">
            <span>{{ row.content }}</span>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>
import { queryAccountBlockList } from '@/api/compute'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      confirmLoading: false,
      tableKey: 0,
      list: null,
      listLoading: false,
      listQuery: {
        account: undefined
      }
    }
  },
  created() {
  },
  methods: {
    handleFilter() {
      this.getList()
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
    },
    handleCreate() {
      this.$router.push({
        path: '/cmdb/application/add',
        params: { title: '新增' }
      })
    },
    handleUpdate(row) {
      const editRow = Object.assign({}, row) // copy obj
      this.$router.push({
        path: '/cmdb/application/modify',
        query: editRow
      })
    },
    handleDelete(row, index) {
      this.dialogFormVisible = true
      this.deleteRow = Object.assign({}, row) // copy obj
      this.deleteIndex = index
    },
    onCancel() {
      this.dialogFormVisible = false
      this.deleteRow = {}
      this.deleteIndex = undefined
      this.confirmLoading = false
    },
    onRemove() {
      this.confirmLoading = true
      removeApplication(this.deleteRow).then((response) => {
        const { data } = response
        console.log('response.data=', data)
        this.dialogFormVisible = false
        if (data) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(this.deleteIndex, 1)
        }
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    }
  }
}
</script>
