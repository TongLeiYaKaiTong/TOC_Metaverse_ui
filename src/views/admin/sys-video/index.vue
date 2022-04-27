
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">

        <el-table
          v-loading="loading"
          :data="sysVideoList"
          border
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChang"
        >
          <el-table-column
            label="视频ID"
            header-align="center"
            align="left"
            fixed="left"
            width="100px"
          >
            <template slot-scope="scope">

              {{ scope.row.id }}

            </template>
          </el-table-column>

          <el-table-column
            label="上传者"
            header-align="center"
            align="left"
            width="100px"
          >

            <template slot-scope="scope">
             {{ scope.row.userinfo.nickname }}

            </template>

          </el-table-column>

          <el-table-column
            label="文件大小"
            header-align="center"
            align="left"
          >

            <template slot-scope="scope">
            {{ scope.row.size }}

            </template>
          </el-table-column>
          <el-table-column
            label="缩略图"
            header-align="center"
            align="left"
            prop="path"
            :show-overflow-tooltip="true"
          >

            <template slot-scope="scope">

            <p>
            {{ scope.row.conver }}
            </p>


            </template>
          </el-table-column>

          <el-table-column
            label="时长"
            header-align="center"
            align="left"
            prop="path"
            :show-overflow-tooltip="true"
          >

            <template slot-scope="scope">


                {{ scope.row.duration }}


            </template>
          </el-table-column>



          <el-table-column
            label="创建时间"
            align="center"
            prop="createdAt"
            width="155px"
          >
            <template slot-scope="scope">
            {{ parseTime(scope.row.createdAt) }}
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

      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { listVideoApi} from '@/api/admin/sys-video'

export default {
  name: 'SysVideoManager',
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
      listVideoApi(this.queryParams).then(response => {
        this.sysVideoList = response.data.list
        this.total = response.data.count
        this.loading = false
      }
      )
    }


  }
}
</script>
