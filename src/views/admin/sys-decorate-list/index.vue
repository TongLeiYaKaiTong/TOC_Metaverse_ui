
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <!-- 输入栏 -->
        <el-form ref="queryForm" :model="queryParams" :inline="true" align="center">
          <el-form-item label="分类" prop="type_id">
            <el-select v-model="queryParams.type_id" placeholder="装扮分类" clearable size="small" style="width: 160px">
              <el-option v-for="dict in typesOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="装扮状态" clearable size="small" style="width: 160px">
              <el-option v-for="dict in statusOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="性别" prop="status">
            <el-select v-model="queryParams.sex" placeholder="选择性别" clearable size="small" style="width: 160px">
              <el-option v-for="dict in sexOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="装扮名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="输入装扮名称"
              clearable
              size="small"
              style="width: 160px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="add">上传</el-button>
          </el-form-item>
        </el-form>

        <!-- 批量按钮栏 -->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:sysDecorate:stop']"
              type="success"
              icon="el-icon-refresh-right"
              size="mini"
              :disabled="multiple"
              @click="handleStatus(null, 2)"
            >
              批量启用
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:sysDecorate:stop']"
              type="danger"
              icon="el-icon-refresh-left"
              size="mini"
              :disabled="multiple"
              @click="handleStatus(null, 1)"
            >
              批量停用
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:sysDecorate:remove']"
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
          :data="sysDecorateList"
          border
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChang"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="编号" width="75" prop="id" align="center" sortable="custom" />
          <el-table-column
            label="装扮名称"
            width="200"
            prop="name"
            align="center"
            sortable="custom"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="缩略图" align="center">
            <template slot-scope="scope">
              <el-image :src="scope.row.thumb" style="width: 50px; height: 50px" fit="contain" />
            </template>
          </el-table-column>
          <el-table-column label="分类" prop="type_name" align="center" />
          <el-table-column label="使用次数" prop="usedtimes" align="center" />
          <el-table-column label="性别" prop="sex" align="center">
            <template slot-scope="scope">
              <span>{{ sexOptions[scope.row.sex].label }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作人" prop="up_name" align="center" />
          <el-table-column label="状态" width="80" sortable="custom" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="2"
                :inactive-value="1"
                @change="handleStatus(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="管理" width="160" fix="right" class-name="small-padding fixed-width" align="center">
            <template slot-scope="scope">
              <!-- <el-button
                v-permisaction="['admin:sysDecorate:preview']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="edit(scope.row)"
              >
                编辑
              </el-button> -->
              <el-button
                v-permisaction="['admin:sysDecorate:remove']"
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

      <!-- 分类上传弹框 -->
      <el-dialog :title="dialog.title" :visible.sync="dialog.open" width="400px" :close-on-click-modal="false">
        <el-form ref="form" :model="form" :rules="dialog.rules" label-width="auto">
          <el-row>
            <el-col :span="22">
              <el-form-item label="编号" prop="index">
                <el-input v-model.number="form.index" placeholder="请输入编号" />
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="选择性别" prop="sex">
                <el-select v-model="form.sex" placeholder="请选择性别" clearable style="width: 100%">
                  <el-option v-for="dict in sexOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="选择分类" prop="type_id">
                <el-select v-model="form.type_id" placeholder="请选择装扮分类" clearable style="width: 100%">
                  <el-option v-for="dict in typesOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="装扮名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入装扮名称" />
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="装扮描述" prop="mention">
                <el-input
                  v-model="form.mention"
                  type="textarea"
                  placeholder="请输入装扮描述"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-upload
          ref="upload-ref"
          class="avatar-uploader"
          action="#"
          drag
          :limit="2"
          accept="image/*"
          :multiple="false"
          :auto-upload="false"
          :on-change="uploadChange"
          :file-list="form.fileList"
          list-type="picture"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            将图片文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submit">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </template>
  </BasicLayout>
</template>

<script>
import { listDecorateApi, uploadDecorateApi, statusDecorateApi, deleteDecorateApi } from '@/api/admin/sys-decoratelist'
import { optionCategoryApi } from '@/api/admin/sys-decoratecate'

export default {
  name: 'SysDecorateManage',
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
      sysDecorateList: [],
      // 状态数据字典
      statusOptions: [],
      // 性别数据
      sexOptions: [],
      // 装扮分类数据字典
      typesOptions: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        name: undefined,
        sex: undefined,
        type_id: undefined
      },
      // 弹框参数
      dialog: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '新增/修改分类',
        // 表单校验
        rules: {
          index: [
            { required: true, message: '编号不能为空', trigger: 'blur' },
            { type: 'number', message: '编号必须为数字值' }
          ],
          sex: [{ required: true, message: '请选择一种性别', trigger: 'change' }],
          type_id: [{ required: true, message: '请选择一种装扮分类', trigger: 'change' }],
          name: [
            { required: true, message: '分类名称不能为空', trigger: 'blur' },
            { max: 20, message: '分类名称：长度限制20汉字', trigger: 'blur' }
          ],
          mention: [{ required: true, message: '请填写装扮描述', trigger: 'blur' }]
        }
      },
      // 表单参数
      form: {
        fileList: []
      }
    }
  },
  created() {
    // 性别
    this.getDicts('sys_user_sex').then((response) => {
      this.sexOptions = response.data
      // 加载列表
      this.getList()
    })
    // 分类下拉数据
    optionCategoryApi().then((response) => {
      this.typesOptions = response.data
    })
    // 查询类型
    this.getDicts('sys_job_status').then((response) => {
      this.statusOptions = response.data
    })
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
    // 状态处理
    handleStatus(row, status) {
      let ids
      if (row) {
        ids = [row.id]
        status = row.status
      } else {
        ids = this.ids
      }
      const text = status === 2 ? '启用' : '停用'
      this.confirmFun(
        '是否"' + text + '"编号为"' + ids + '"的数据项？',
        () => {
          return statusDecorateApi({ ids, status })
        },
        (response) => {
          this.msgSuccess(text + '成功')
          this.getList()
        },
        () => {
          row && (row.status = row.status === 2 ? 1 : 2)
        }
      )
    },
    // 删除处理
    handleDelete(id) {
      const ids = (id && [id]) || this.ids
      this.confirmFun(
        '是否删除编号为"' + ids + '"的数据项？',
        () => {
          return deleteDecorateApi({ ids })
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
    // 上传更新
    uploadChange(file, fileList) {
      this.form.file = file.raw
      if (fileList.length > 0) this.form.fileList = [fileList[fileList.length - 1]] // 这一步，是 展示最后一次选择文件
    },
    // 上传提交
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.form.file) {
            this.msgError('请选择要上传的文件')
            return
          }
          // 创建FormData 文件传输必须的
          const formData = new FormData()
          formData.append('index', this.form.index) // 要提交给后台的文件,并且字段的key为index
          formData.append('name', this.form.name) // 要提交给后台的文件,并且字段的key为name
          formData.append('sex', this.form.sex) // 要提交给后台的文件,并且字段的key为sex
          formData.append('type_id', this.form.type_id) // 要提交给后台的文件,并且字段的key为type_id
          formData.append('mention', this.form.mention) // 要提交给后台的文件,并且字段的key为mention
          formData.append('file', this.form.file) // 要提交给后台的文件,并且字段的key为file
          // 上传
          uploadDecorateApi(formData).then((response) => {
            if (response.code === 200) {
              this.msgSuccess(response.msg)
              this.dialog.open = false
              this.getList()
            } else {
              this.msgError(response.msg)
            }
          })
        }
      })
    },
    // 分类上传取消
    cancel() {
      this.dialog.open = false
      this.reset()
    },
    // 添加功能
    add() {
      this.reset()
      this.dialog.open = true
      this.dialog.title = '上传装扮'
    },
    // 执行预览
    edit(row) {
      this.reset()
      this.dialog.open = true
      this.dialog.title = '修改装扮'
      this.form = {
        id: row.id,
        index: row.id,
        name: row.name,
        sequence: row.sequence,
        fileList: [{ url: row.icon }]
      }
    },
    // 分类上传重置
    reset() {
      this.form = {
        id: undefined,
        index: undefined,
        name: undefined,
        sequence: undefined,
        fileList: []
      }
      // this.form.id && (this.form.id = undefined)
      // this.form.name && (this.form.name = undefined)
      // this.form.sequence && (this.form.sequence = undefined)
      // this.$refs['upload-ref']?.clearFiles()
      this.resetForm('form')
    },
    // 查询参数列表
    getList() {
      this.loading = true
      listDecorateApi(this.queryParams).then((response) => {
        this.sysDecorateList = response.data.list
        console.log(this.sysDecorateList)
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
