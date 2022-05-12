
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <!-- 输入栏 -->
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="图片名称" prop="username">
            <el-input
              v-model="queryParams.username"
              placeholder="输入图片名称"
              clearable
              size="small"
              style="width: 160px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="图片状态" clearable size="small" style="width: 160px">
              <el-option v-for="dict in statusOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-upload" size="mini" @click="uploadImage">上传</el-button>
          </el-form-item>
        </el-form>

        <!-- 批量按钮栏 -->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:sysBack:stop']"
              type="danger"
              icon="el-icon-refresh-left"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >
              批量停用
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:sysBack:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >
              批量删除
            </el-button>
          </el-col>
        </el-row>

        <!-- 表格栏 -->
        <el-table
          v-loading="loading"
          :data="sysBackList"
          border
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChang"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="编号" width="75" prop="id" align="center" sortable="custom" />
          <el-table-column
            label="图片名称"
            width="200"
            prop="name"
            align="center"
            sortable="custom"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="尺寸" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.width + '*' + scope.row.height }}</span>
            </template>
          </el-table-column>
          <el-table-column label="格式" prop="type" align="center" />
          <el-table-column label="大小" prop="size" align="center" />
          <el-table-column label="使用次数" prop="use_num" align="center" />
          <el-table-column label="上传人" prop="up_name" align="center" />
          <el-table-column label="状态" width="80" align="center" sortable="custom">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === 0 ? 'danger' : 'success'" disable-transitions>{{
                scope.row.status === 0 ? '停用' : '正常'
              }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="管理" width="160" fix="right" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['admin:sysBack:preview']"
                size="mini"
                type="text"
                icon="el-icon-search"
                @click="handlePreview(scope.row.cover)"
              >
                预览
              </el-button>
              <el-button
                v-if="scope.row.status === 1"
                v-permisaction="['admin:sysBack:stop']"
                size="mini"
                type="text"
                icon="el-icon-refresh-left"
                @click="handleDisable(scope.row)"
              >
                停用
              </el-button>
              <el-button
                v-permisaction="['admin:sysBack:remove']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleResetPwd(scope.row)"
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

      <!-- 图片上传弹框 -->
      <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="18">
              <el-form-item label="图片名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入图片名称" />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>
        <!-- https://element.eleme.cn/#/zh-CN/component/upload -->
        <!-- https://element.eleme.cn/#/zh-CN/component/upload -->
        <el-upload
          class="avatar-uploader"
          action="#"
          drag
          :limit="1"
          accept="image/*"
          :multiple="false"
          :auto-upload="false"
          :on-change="handleFileUploadChange"
          list-type="picture"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            将图片类型文件拖到此处，或
            <em>点击上传</em>
          </div>
          <!-- <el-button size="small" type="primary">点击上传</el-button> -->
          <!-- <div slot="tip" class="el-upload__tip">只能上传图片类型的文件</div> -->
        </el-upload>
        <!-- <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div> -->
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="uploadSubmitForm">确 定</el-button>
          <el-button @click="uploadCancel">取 消</el-button>
        </div>
      </el-dialog>

      <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[previewUrl]" />
    </template>
  </BasicLayout>
</template>

<script>
// import { listBackApi, delBackApi, getBackApi, addBackApi, updateBackApi } from '@/api/admin/sys-back'
import { listBackApi, uploadBackApi } from '@/api/admin/sys-back'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { getToken } from '@/utils/auth'

export default {
  name: 'SysBackManage',
  components: { ElImageViewer },
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
      // 状态数据字典
      statusOptions: [],
      // 类型数据字典
      typeOptions: [],
      sysBackList: [],
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
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '图片上传',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/system/user/importData'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: '图片名称不能为空', trigger: 'blur' }]
      },
      // 显示查看器
      showViewer: false,
      // 预览图片地址
      previewUrl: ''
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_normal_disable').then((response) => {
      this.statusOptions = response.data
    })
  },
  methods: {
    // 关闭查看器
    closeViewer() {
      this.showViewer = false
    },
    handlePreview(url) {
      this.previewUrl = url
      this.previewUrl && (this.showViewer = true)
    },
    // 更新事件
    handleFileUploadChange(file) {
      this.upload.file = file.raw
    },
    // 上传提交
    uploadSubmitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 创建FormData 文件传输必须的
          const formData = new FormData()
          formData.append('name', this.form.name) // 要提交给后台的文件,并且字段的key为name
          formData.append('file', this.upload.file) // 要提交给后台的文件,并且字段的key为file
          // 上传背景图
          uploadBackApi(this.upload.file).then((response) => {
            console.log('上传图片结果', response)
            // 更新列表
            this.getList()
            this.upload.open = false
          })
        }
      })
      // const params = {
      //   name: 'man',
      //   file: this.upload.file.row
      // }

      // console.log(params)
    },
    // 上传取消
    uploadCancel() {
      this.upload.open = false
    },
    // 图片上传功能
    uploadImage() {
      this.upload.open = true
    },
    // 执行禁用
    handleDisable(row) {
      console.log(row)
      const Ids = (row.userId && [row.userId]) || this.ids
      console.log(Ids)
    },
    // 查询参数列表
    getList() {
      this.loading = true
      listBackApi(this.queryParams).then((response) => {
        this.sysBackList = response.data.list
        console.log(this.sysBackList)
        this.total = response.data.count
        this.loading = false
      })
    },
    handleClose(done) {
      // if (this.loading) {
      //   return
      // }
      // this.$confirm('需要提交表单吗？')
      //   .then(_ => {
      //     this.loading = true
      //     this.timer = setTimeout(() => {
      //       done()
      //       // 动画关闭需要一定的时间
      //       setTimeout(() => {
      //         this.loading = false
      //       }, 400)
      //     }, 2000)
      //   })
      //   .catch(_ => {})
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
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      // const id = row.id || this.ids
      // getSysApi(id).then((response) => {
      //   this.form = response.data
      //   this.open = true
      //   this.title = '修改接口管理'
      //   this.isEdit = true
      // })
    },
    /** 提交按钮 */
    // submitForm: function () {
    //   this.$refs['form'].validate((valid) => {
    //     if (valid) {
    //       if (this.form.id !== undefined) {
    //         updateSysApi(this.form).then((response) => {
    //           if (response.code === 200) {
    //             this.msgSuccess(response.msg)
    //             this.open = false
    //             this.getList()
    //           } else {
    //             this.msgError(response.msg)
    //           }
    //         })
    //       } else {
    //         addSysApi(this.form).then((response) => {
    //           if (response.code === 200) {
    //             this.msgSuccess(response.msg)
    //             this.open = false
    //             this.getList()
    //           } else {
    //             this.msgError(response.msg)
    //           }
    //         })
    //       }
    //     }
    //   })
    // },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.id && [row.id]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // return delSysApi({ ids: Ids })
        })
        .then((response) => {
          if (response.code === 200) {
            this.msgSuccess(response.msg)
            this.open = false
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })
        .catch(() => {})
    }
  }
}
</script>
