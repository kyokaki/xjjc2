<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="应用名称" size="mini">
          <el-input
            v-model="listQuery.appName"
            placeholder="应用名称"
            style="width: 200px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="应用owner" size="mini">
          <el-input
            v-model="listQuery.owner"
            placeholder="应用owner"
            style="width: 200px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="开发语言" size="mini">
          <el-select
            v-model="listQuery.language"
            style="width: 140px"
            class="filter-item"
            @change="handleFilter"
          >
            <el-option
              v-for="item in languageOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
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
            icon="el-icon-circle-plus"
            size="mini"
            @click="handleCreate"
          >
            新增
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
        <el-table-column width="190px" align="center" label="应用名">
          <template slot-scope="{ row }">
            <span>{{ row.appName }}</span>
          </template>
        </el-table-column>

        <el-table-column width="120px" align="center" label="应用中文名">
          <template slot-scope="{ row }">
            <span>{{ row.appNameZh }}</span>
          </template>
        </el-table-column>

        <el-table-column width="100px" align="center" label="应用owner">
          <template slot-scope="{ row }">
            <span>{{ row.owner }}</span>
          </template>
        </el-table-column>

        <el-table-column width="70px" align="center" label="开发语言">
          <template slot-scope="{ row }">
            <span>{{ row.language }}</span>
          </template>
        </el-table-column>

        <el-table-column width="150px" align="center" label="git地址">
          <template slot-scope="{ row }">
            <span>{{ row.gitAddress }}</span>
          </template>
        </el-table-column>

        <el-table-column width="100px" align="center" label="更新时间">
          <template slot-scope="{ row }">
            <span>{{ row.updatedAt }}</span>
          </template>
        </el-table-column>

        <el-table-column width="100px" align="center" label="最后更新人">
          <template slot-scope="{ row }">
            <span>{{ row.updatedBy }}</span>
          </template>
        </el-table-column>

        <el-table-column width="400px" align="center" label="备注">
          <template slot-scope="{ row }">
            <span>{{ row.remark }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          width="190"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row, $index }">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="handleUpdate(row)"
            >
              修改
            </el-button>
            <el-button
              v-if="row.status != 'deleted'"
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(row, $index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="totalCount > 0"
      :total="totalCount"
      :page.sync="listQuery.currentPage"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <div>
      <el-dialog
        width="50%"
        :title="dialogTitle"
        :visible.sync="dialogFormVisible"
      >
        <el-form ref="form" :model="deleteRow" label-width="10%">
          <el-form-item label="应用名" prop="appName">
            <el-input v-model="deleteRow.appName" :disabled="true" />
          </el-form-item>
          <el-form-item label="应用中文名" prop="appNameZh">
            <el-input v-model="deleteRow.appNameZh" :disabled="true" />
          </el-form-item>
          <el-form-item label="应用owner" prop="owner">
            <el-input v-model="deleteRow.owner" :disabled="true" />
          </el-form-item>
          <el-form-item label="开发语言" prop="language">
            <el-input v-model="deleteRow.language" :disabled="true" />
          </el-form-item>
          <el-form-item label="git地址" prop="gitAddress">
            <el-input v-model="deleteRow.gitAddress" :disabled="true" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="deleteRow.remark"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
            />
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" icon="el-icon-close" size="mini" @click="onCancel">
            取消
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-check"
            :loading="confirmLoading"
            size="mini"
            @click="onRemove()"
          >
            确认
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { queryPageApplication, removeApplication } from '@/api/compute'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      confirmLoading: false,
      deleteIndex: undefined,
      deleteRow: {},
      dialogTitle: '提示，请确认是否删除？',
      tableKey: 0,
      list: null,
      totalCount: 0,
      listLoading: false,
      listQuery: {
        currentPage: 1,
        pageSize: 5,
        assetNo: undefined,
        idcCenterName: undefined,
        owner: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      languageOptions: [
        { label: '', key: undefined },
        { label: 'Go', key: 'Go' },
        { label: 'Java', key: 'Java' }
      ],
      dialogFormVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      queryPageApplication(this.listQuery).then((response) => {
        this.list = response.data.list
        this.totalCount = response.data.totalCount
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
