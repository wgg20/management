<template>
  <div class="order">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 数据表格 -->
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.pay_status == '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateForm }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="editDialog"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-location"
            @click="showProgressBox"
          ></el-button>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑信息的对话框 -->
    <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="50%">
      <el-form
        ref="editFormRef"
        :model="editForm"
        label-width="80px"
        :rules="addFormRules"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            expand-trigger="hover"
            :options="cityData"
            v-model="editForm.address1"
            @close="formClosed"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 查询快递进度 -->
    <el-dialog title="提示" :visible.sync="progreDialogVisible" width="50%">
      <span>这是一段信息</span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata';
export default {
  name: 'Order',
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 列表总页数
      total: 0,
      // 请求数据返回的数据数组
      orderList: [],
      // 控制修改对话框是否显示
      editDialogVisible: false,
      editForm: {
        address1: [],
        address2: '',
      },
      addFormRules: {
        address1: [{ required: true, message: '请选择地址', trigger: 'blur' }],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          {
            min: 3,
            max: 15,
            message: '长度在 3 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
      cityData,
      //物流进度的对话框显示与否
      progreDialogVisible: false,
      // 物流信息存储起来的数组
      progressList: [],
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据出错');
      }
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    // 点击修改按钮触发的函数
    editDialog() {
      this.editDialogVisible = true;
    },
    // 关闭对话框清除上一次对话信息
    formClosed() {
      this.$refs.editFormRef.resetFileds();
    },
    // 点击物流信息的触发事件
    async showProgressBox() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662');
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败');
      }
      this.progressList = res.data;
      this.progressDialogVisible = true;
      console.log(this.progressList);
    },
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
