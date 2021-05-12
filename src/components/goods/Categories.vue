<template>
  <div class="categories">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="addGoodsClick">添加分类</el-button>
      <!-- 表格 -->
      <zk-table
        :data="cateList"
        :columns="columns"
        show-index
        index-text="#"
        border
        :expand-type="false"
        :selection-type="false"
      >
        <!-- 是否被选中 -->
        <template slot="isSelect" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color:lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
          <!-- <pre>{{ scope.row }}</pre> -->
        </template>
        <!-- 操作 -->
        <template slot="operation" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </zk-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 7]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加分类："
      :visible.sync="addDialogVisible"
      width="50%"
      @closed="addCateDialogClosed"
    >
      <!-- 输入框 -->
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- 级联选择器 -->
          <el-cascader
            expand-trigger="hover"
            :options="cateParentList"
            :props="cateProps"
            v-model="selectedKeys"
            @change="cateInputChange"
            clearable
            change-on-select
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  props: {},
  components: {},
  data() {
    return {
      // 请求的参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 请求的商品数据列表
      cateList: [],
      // 总页数
      totalPage: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否被选中',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isSelect',
        },
        {
          label: '等级排序',
          prop: 'cat_level',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation',
        },
      ],
      // 添加用户的对话框是否关闭
      addDialogVisible: false,
      // 表单双向绑定的对象属性
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0,
      },
      // 表单的验证规则：
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      // 请求到的父级分类数据
      cateParentList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        childre: 'children',
      },
      // 选中的分类Id数组
      selectedKeys: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) {
        return this.$message.error('请求商品数据失败！');
      }
      // console.log(res);
      this.cateList = res.data.result;
      this.totalPage = res.data.total;
    },
    // 监听 pagesize的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pagenum的改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getCateList();
    },
    // 点击添加分类按钮触发事件
    addGoodsClick() {
      // 先获取数据再打开对话框
      this.getParentCateList();
      this.addDialogVisible = true;
    },
    // 获取父级分类，只需要获取前两级
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      });
      if (res.meta.status != 200) {
        return this.$message.error('添加分类失败');
      }
      console.dir(res.data);
      // 将获取到的数据数组保存到定义的数组中
      this.cateParentList = res.data;
    },
    // 当选择的值发生改变时
    cateInputChange() {
      console.log(this.selectedKeys);
      // 当selectedKeys数组不为0时，选定了父级分类
      // 当selectedKeys数组长度为0时，没有选中父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类ID
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        // 当前分类等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    // 监听对话框的关闭,将所有数据清空
    addCateDialogClosed() {
      // 清空第一个分类名的对话框
      this.$refs.addCateFormRef.resetFields();
      // 清空第二个多选框的数组数据
      this.selectedKeys = [];
      // 将上一次操作的pid和level值归0
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    // 表单验证成功后,将添加得到分类保存到数据库中
    addCateList() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        );
        if (res.meta.status != 201) {
          return this.$message.error('添加分类失败!');
        }
        this.$message.success('添加分类成功!');
        this.getCateList();
        this.addDialogVisible = false;
      });
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
</style>
