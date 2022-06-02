
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <!-- 输入栏 -->
        <el-form ref="queryForm" :model="queryParams" :inline="true" align="center">
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="音乐状态" clearable size="small" style="width: 160px">
              <el-option v-for="dict in statusOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="音乐名称" prop="keyword">
            <el-input
              v-model="queryParams.keyword"
              placeholder="输入音乐名称/歌手"
              clearable
              size="small"
              style="width: 160px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-upload" size="mini" @click="uploadMusic">上传</el-button>
          </el-form-item>
        </el-form>

        <!-- 批量按钮栏 -->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:sysMusic:stop']"
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
              v-permisaction="['admin:sysMusic:stop']"
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
              v-permisaction="['admin:sysMusic:remove']"
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
          :data="sysMusicList"
          border
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChang"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="编号" width="75" prop="id" align="center" sortable="custom" />
          <el-table-column
            label="音乐名称"
            width="200"
            prop="name"
            align="center"
            sortable="custom"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="歌手/作曲" prop="singer" align="center" />
          <el-table-column label="音乐时长" prop="duration" align="center" />
          <el-table-column label="格式" prop="type" align="center" />
          <el-table-column label="使用次数" prop="usedtimes" align="center" />
          <el-table-column label="上传人" prop="up_name" align="center" />
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
                v-permisaction="['admin:sysMusic:preview']"
                size="mini"
                type="text"
                icon="el-icon-search"
                @click="handlePreview(scope.row.cover)"
              >
                预览
              </el-button> -->
              <el-button
                v-permisaction="['admin:sysMusic:remove']"
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

      <!-- 音乐上传弹框 :close-on-click-modal="false" -->
      <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
        <el-form ref="form" :model="form" :rules="rules" label-width="auto">
          <el-row>
            <el-col :span="22">
              <el-form-item label="歌名/曲名" prop="title">
                <el-input v-model="form.title" placeholder="请输入歌名/曲名" />
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="演唱/作曲" prop="singer">
                <el-input v-model="form.singer" placeholder="请输入演唱/作曲" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-upload
          ref="upload-ref2"
          class="avatar-uploader"
          action="#"
          drag
          :limit="2"
          accept="image/*"
          :multiple="false"
          :auto-upload="false"
          :on-change="uploadChange2"
          :file-list="form.fileList2"
          list-type="picture"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            将封面图片文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
        <br>
        <el-upload
          ref="upload-ref"
          class="avatar-uploader"
          action="#"
          drag
          :limit="2"
          accept="audio/mp3"
          :multiple="false"
          :auto-upload="false"
          :on-change="uploadChange"
          :file-list="form.fileList"
          list-type="fileList"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            将音乐类型文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div slot="tip" class="el-upload__tip" style="color: red">音乐只能上传mp3格式的文件</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="uploadSubmit">确 定</el-button>
          <el-button @click="uploadCancel">取 消</el-button>
        </div>
      </el-dialog>
    </template>
  </BasicLayout>
</template>

<script>
import { listMusicApi, uploadMusicApi, disableMusicApi, deleteMusicApi } from '@/api/admin/sys-music'

export default {
  name: 'SysMusicManage',
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
      sysMusicList: [],
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        keyword: undefined,
        status: undefined
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '音乐上传'
      },
      // 表单参数
      form: {
        fileList: [],
        fileList2: []
      },
      // 表单校验
      rules: {
        title: [
          { required: true, message: '歌名/曲名不能为空', trigger: 'blur' },
          { max: 100, message: '音乐名称：长度限制100字符', trigger: 'blur' }
        ],
        singer: [
          { required: true, message: '演唱/作曲不能为空', trigger: 'blur' },
          { max: 50, message: '歌手/作曲：长度限制50字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 加载列表
    this.getList()
    // 查询类型
    this.getDicts('sys_job_status').then((response) => {
      console.log(response.data)
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
          return disableMusicApi({ ids, status })
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
          return deleteMusicApi({ ids })
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
      this.upload.file = file.raw
      if (fileList.length > 0) this.form.fileList = [fileList[fileList.length - 1]] // 这一步，是 展示最后一次选择文件
    },
    // 上传更新
    uploadChange2(file, fileList) {
      this.upload.file2 = file.raw
      if (fileList.length > 0) this.form.fileList2 = [fileList[fileList.length - 1]] // 这一步，是 展示最后一次选择文件
    },
    // 上传提交
    uploadSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.upload.file) {
            this.msgError('请选择要上传的音乐')
            return
          }
          if (!this.upload.file2) {
            this.msgError('请选择要上传的封面')
            return
          }
          // 创建FormData 文件传输必须的
          const formData = new FormData()
          formData.append('title', this.form.title) // 要提交给后台的文件,并且字段的key为title
          formData.append('singer', this.form.singer) // 要提交给后台的文件,并且字段的key为singer
          formData.append('file', this.upload.file) // 要提交给后台的文件,并且字段的key为file
          formData.append('cover', this.upload.file2) // 要提交给后台的文件,并且字段的key为file
          // 上传背景图
          uploadMusicApi(formData).then((response) => {
            if (response.code === 200) {
              this.msgSuccess(response.msg)
              this.upload.open = false
              this.getList()
            } else {
              this.msgError(response.msg)
            }
          })
        }
      })
    },
    // 音乐上传重置
    uploadReset() {
      this.form = {
        name: undefined,
        singer: undefined,
        fileList: [],
        fileList2: []
      }
      // this.$refs['upload-ref']?.clearFiles()
      this.resetForm('form')
    },
    // 音乐上传取消
    uploadCancel() {
      this.upload.open = false
      this.uploadReset()
    },
    // 音乐上传功能
    uploadMusic() {
      this.uploadReset()
      this.upload.open = true
    },
    // 查询参数列表
    getList() {
      this.loading = true
      listMusicApi(this.queryParams).then((response) => {
        this.sysMusicList = response.data.list
        console.log('sysMusicList', this.sysMusicList)
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
