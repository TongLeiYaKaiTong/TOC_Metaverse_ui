<!--
这个是妆扮分类的页面
-->
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">

        <el-table
          v-loading="loading"
          :data="sysCateList"
          border
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChang"
        >
          <el-table-column
            label="标题"
            header-align="center"
            align="left"
            prop="title"
            fixed="left"
            width="260px"
          >
            <template slot-scope="scope">
              <span>暂无</span>

            </template>
          </el-table-column>

          <el-table-column
            label="尺寸"
            header-align="center"
            align="left"
            prop="path"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ "["+scope.row.action +"] "+ scope.row.path }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="格式"
            header-align="center"
            align="left"
            prop="path"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ "["+scope.row.action +"] "+ scope.row.path }}</span>
            </template>

          </el-table-column>
          <el-table-column
            label="大小"
            header-align="center"
            align="left"
            prop="path"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ "["+scope.row.action +"] "+ scope.row.path }}</span>
            </template>

          </el-table-column>
          <el-table-column
            label="使用次数"
            header-align="center"
            align="left"
            prop="path"
            :show-overflow-tooltip="true"
          >
           <template slot-scope="scope">
              <span>{{ "["+scope.row.action +"] "+ scope.row.path }}</span>
            </template>

          </el-table-column>
          <el-table-column
            label="上传人"
            header-align="center"
            align="left"
            prop="path"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ "["+scope.row.action +"] "+ scope.row.path }}</span>
            </template>

          </el-table-column>

          <el-table-column
            label="创建时间"
            align="center"
            prop="createdAt"
            width="155px"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.create_at) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="80px"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                v-permisaction="['admin:sysApi:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />

        <!-- 添加或修改对话框 -->
        <el-drawer
          ref="drawer"
          :title="title"
          :before-close="handleClose"
          :visible.sync="open"
          direction="rtl"
          custom-class="demo-drawer"
        >
          <div class="demo-drawer__content">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">

              <el-form-item label="Handle" prop="handle">
                <el-input
                  v-model="form.handle"
                  placeholder="handle"
                />
              </el-form-item>
              <el-form-item label="标题" prop="title">
                <el-input
                  v-model="form.title"
                  placeholder="标题"
                />
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-select
                  v-model="form.type"
                  placeholder="请选择类型"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                >
                  <el-option value="SYS">SYS</el-option>
                  <el-option value="BUS">BUS</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Method" prop="action">
                <el-select
                  v-model="form.action"
                  placeholder="请选择方式"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                >
                  <el-option value="GET">GET</el-option>
                  <el-option value="POST">POST</el-option>
                  <el-option value="PUT">PUT</el-option>
                  <el-option value="DELETE">DELETE</el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="地址" prop="path">
                <el-input
                  v-model="form.path"
                  :disabled="isEdit"
                  placeholder="地址"
                />
              </el-form-item>

            </el-form>
            <div class="demo-drawer__footer">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </div>

        </el-drawer>

      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { listCateApi, addCateApi, updateCateApi, delCateApi } from '@/api/admin/sys-decoratecate'

export default {
  name: 'sysDecorateCatManage',
  components: {
  },
  data() {
    return {
      dialog: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      isEdit: false,
      // 类型数据字典
      typeOptions: [],
      sysapiList: [],
      dateRange: [],

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        name: undefined,
        title: undefined,
        path: undefined,
        action: undefined,
        parentId: undefined

      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        path: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
        action: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
        parentId: [{ required: true, message: '按钮id不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleClose(done) {

    },
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listCateApi(this.queryParams).then(response => {
        this.sysCateList = response.data.list
        this.total = response.data.count
        this.loading = false
      }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        title: undefined,
        path: undefined,
        paths: undefined,
        action: undefined,
        parentId: undefined,
        sort: undefined
      }
      this.resetForm('form')
    },
    parentIdFormat(row) {
      return this.selectItemsLabel(this.parentIdOptions, row.parentId)
    },
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加接口管理'
      this.isEdit = false
    },
    /** 排序回调函数 */
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id =
                row.id || this.ids
      getSysApi(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改接口管理'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateSysApi(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addSysApi(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.id && [row.id]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delSysApi({ 'ids': Ids })
      }).then((response) => {
        if (response.code === 200) {
          this.msgSuccess(response.msg)
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      }).catch(function() {})
    }
  }
}
</script>
