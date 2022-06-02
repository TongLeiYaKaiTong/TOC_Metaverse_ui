
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <!-- 输入栏 -->
        <el-form ref="queryForm" :model="queryParams" :inline="true" align="center">
          <el-form-item label="" prop="keyword">
            <el-input
              v-model="queryParams.keyword"
              placeholder="输入UID/昵称/手机号"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          </el-form-item>
        </el-form>

        <!-- 批量按钮栏 -->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:sysDigital:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete()"
            >
              批量删除
            </el-button>
          </el-col>
        </el-row>

        <!-- 表格栏 -->
        <el-table
          v-loading="loading"
          :data="sysDigitalList"
          border
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChang"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="编号" width="75" prop="id" align="center" sortable="custom" />
          <el-table-column label="生成时间" prop="created_at" sortable="custom" width="155" align="center">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.created_at) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="原始照片" width="250" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <el-link type="primary" :href="scope.row.title" target="_blank">{{ scope.row.title }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="数字人" width="250" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <el-link type="primary" :href="scope.row.path" target="_blank">{{ scope.row.path }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="用户UID" prop="uid" align="center" />
          <el-table-column label="用户昵称" prop="username" align="center" />
          <el-table-column label="用户手机号" prop="phone" align="center" />
          <el-table-column label="管理" width="80" fix="right" class-name="small-padding fixed-width" align="center">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['admin:sysDigital:remove']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { listDigitalApi, deleteDigitalApi } from '@/api/admin/sys-digital'

export default {
  name: 'SysDigitalManage',
  components: {},
  data() {
    return {
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 数据列表
      sysDigitalList: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        keyword: undefined
      }
    }
  },
  created() {
    // 加载列表
    this.getList()
  },
  methods: {
    confirmFun(infoText, ApiFun, successFun, catchFun) {
      this.$confirm(infoText, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(ApiFun)
        .then(successFun)
        .catch(catchFun || (() => {}))
    },
    // 删除处理
    handleDelete(id) {
      const ids = (id && [id]) || this.ids
      this.confirmFun(
        '是否删除编号为"' + ids + '"的数据项？',
        () => {
          return deleteDigitalApi({ ids })
        },
        (response) => {
          if (response.code === 200) {
            this.msgSuccess(response.msg)
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        }
      )
    },
    // 查询参数列表
    getList() {
      this.loading = true
      listDigitalApi(this.queryParams).then((response) => {
        this.sysDigitalList = response.data.list
        this.total = response.data.count
        this.loading = false
      })
    },
    // 搜索按钮操作
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    // 排序回调函数
    handleSortChang(column, prop, order) {
      prop = column.prop
      order = column.order
      if (this.order !== '' && this.order !== prop + 'Order') {
        this.queryParams[this.order] = undefined
      }
      if (order === 'descending') {
        this.queryParams[prop + 'Order'] = 'desc'
        this.order = prop + 'Order'
      } else if (order === 'ascending') {
        this.queryParams[prop + 'Order'] = 'asc'
        this.order = prop + 'Order'
      } else {
        this.queryParams[prop + 'Order'] = undefined
      }
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    }
  }
}
</script>
