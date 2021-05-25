<template>
  <div class="lists">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索数据的输入框 -->
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addToPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table :data="goodsList" border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>

        <el-table-column prop="goods_price" label="商品价格(元)" width="150px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="150px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="250px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateForm }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteLists(scope.row.goods_id)"
            ></el-button>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="this.queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Lists',
  props: {},
  components: {},
  data() {
    return {
      // 查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      // 总页数
      total: 0,
      // 商品列表数组
      goodsList: [],
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 获取请求商品列表数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) {
        return this.$message.error('查询商品参数失败！');
      }
      this.total = res.data.total;
      this.goodsList = res.data.goods;
      console.log(res);
    },
    // 改变当前可显示几条数据触发的函数
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getGoodsList();
    },
    // 改变当前页码触发的函数
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      // this.queryInfo.pagenum = 1;
      this.getGoodsList();
    },
    // 删除信息操作
    async deleteLists(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err);
      //如果用户点击确定则返回confirm字符串，如果是取消则返回cancel字符串
      if (confirmResult != 'confirm') {
        return this.$message.info('删除操作取消成功！');
      }
      const { data: res } = await this.$http.delete('goods/' + id);
      if (res.meta.status != 200) {
        return this.$message.error('删除失败！');
      }
      this.$message.success('删除成功！');
      this.getGoodsList();
    },
    addToPage() {
      this.$router.push('/goods/add');
    },
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 15px;
}
.el-button {
  margin-left: 15px;
  text-align: center;
}
.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 10px;
}
</style>
