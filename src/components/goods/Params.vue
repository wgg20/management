<template>
  <div class="params">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 警告框 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row class="top-row">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            expand-trigger="hover"
            :options="paramsList"
            v-model="selectedOptionsKeys"
            :props="paramsProps"
            @change="handleChange"
            class="cascader"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tabs标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnClickable"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" tripe border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 遍历循环三级标签 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  class="eltagelement"
                  @close="deleteInp(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 三级标签得添加 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="editMessage(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="editDeleteMessage(scope.row.attr_id)"
                  >删除</el-button
                >
                <!-- <pre>{{ scope.row }}</pre> -->
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnClickable"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >

          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" tripe border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 遍历循环三级标签 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  class="eltagelement"
                  @close="deleteInp(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 三级标签得添加 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="editMessage(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="editDeleteMessage(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addClear"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addRuleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <!-- 添加参数表单 -->
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsList">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="提示" :visible.sync="editDialogVisible" width="50%">
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editRuleFormRef"
        label-width="100px"
        class="editForm"
      >
        <el-form-item label="修改" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPutMessage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  props: {},
  components: {},
  data() {
    return {
      // 存储获取到的数据对象
      paramsList: [],
      // 获取选择框的配置对象
      paramsProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 输入框双向绑定数据的数组
      selectedOptionsKeys: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      // 要验证的变量
      addForm: {},
      addDialogVisible: false,
      // 验证规则
      addRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
      },
      editDialogVisible: false,
      editForm: {
        attr_id: '',
        attr_name: '',
      },
      editRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  created() {
    this.getParamsList();
  },
  computed: {
    // 如果没有选定三级参数，则添加按钮被禁用
    isBtnClickable() {
      if (this.selectedOptionsKeys.length != 3) {
        return true;
      }
      return false;
    },
    // 获取当前复选框中被选中的三级参数的id
    paramsId() {
      if (this.selectedOptionsKeys.length === 3) {
        return this.selectedOptionsKeys[2];
      }
      return null;
    },
    // 定义弹出对话框是动态参数还是静态属性
    titleText() {
      if (this.activeName == 'many') {
        return '动态参数';
      } else {
        return '静态属性';
      }
    },
  },
  methods: {
    // 获取商品分类数据不需要传递参数
    async getParamsList() {
      const { data: res } = await this.$http.get('categories');
      if (res.meta.status !== 200)
        return this.$message.error('获取分类数据失败！');
      this.paramsList = res.data;
      console.log(res);
      console.log(this.paramsList);
    },
    // 在input选择三级参数和动态参数、静态属性来回切换时都需要重新请求数据
    async getParamsData() {
      // 控制只能选择三级分类
      // 如果双向绑定的数组长度不为三，则清空数组
      if (this.selectedOptionsKeys.length !== 3) {
        this.selectedOptionsKeys = [];
        // 如果选择的不是三级分类，比如选择了二级分类，我们应该将表格内所有数据清空
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      // 如果数组长度为三,获取数据列表
      // console.log(this.selectedOptionsKeys);
      const { data: res } = await this.$http.get(
        `categories/${this.paramsId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      if (res.meta.status != 200) return this.$message.error('数据获取失败');
      // 将数据遍历循环传递给下面的子标签,如果为空返回空得数组，不然tag标签会显示出来
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
        // 如果在全局定义inputVisible、inputValue则会影响全部
        // 控制添加按钮得显示与否
        item.inputVisible = false;
        // 三级分类文本框输入的内容
        item.inputValue = '';
      });
      if (this.activeName == 'many') {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
      console.log(res.data);
    },
    // 三级表单数据变动时
    handleChange() {
      this.getParamsData();
    },
    // tabs动态标签页点击事件
    handleClick() {
      this.getParamsData();
      // console.log(this.activeName);
    },
    // 清除表单数据
    addClear() {
      this.$refs.addRuleFormRef.resetFields();
    },
    // 添加参数和属性
    addParamsList() {
      this.$refs.addRuleFormRef.validate(async (valid) => {
        // 如果表单验证失败;
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.paramsId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status != 201)
          return this.$message.error('添加数据失败！');
        this.addDialogVisible = false;
        this.getParamsList();
      });
    },
    async editMessage(attr_id) {
      this.attrId = attr_id;
      const { data: res } = await this.$http.get(
        `categories/${this.paramsId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName },
        }
      );
      if (res.meta.status != 200) {
        this.$message.error('信息获取失败！');
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 提交修改的参数
    editPutMessage() {
      this.$refs.editRuleFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.paramsId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status != 200) {
          return this.$message.error('信息修改失败！');
        }
        this.$message.success('信息修改成功！');
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    // 删除参数
    async editDeleteMessage(id) {
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
      const { data: res } = await this.$http.delete(
        `categories/${this.paramsId}/attributes/${id}`
      );
      if (res.meta.status != 200) {
        return this.$message.error('数据删除失败！');
      }
      this.$message.success('数据删除成功！');
      this.getParamsData();
    },
    // 三级标签显示切换,点击和失去焦点
    handleInputConfirm(row) {
      // 将文本框的数据推送进attr_vals中
      if (row.inputValue) {
        row.attr_vals.push(row.inputValue.trim());
      }
      // 将文本框清空
      row.inputValue = '';
      // 将文本框隐藏
      row.inputVisible = false;
      // 将操作后的数据存入数据库中
      this.saveInput(row);
    },
    async saveInput(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.paramsId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(','),
        }
      );
      if (res.meta.status != 200) {
        return this.$message.error('修改参数失败！');
      }
      this.$message.success('修改参数成功！');
      row.inputVisible = false;
    },
    // 点击三级标签触发的函数
    showInput(row) {
      row.inputVisible = true;
      // 让文本框自动获得焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除第三级参数
    deleteInp(index, row) {
      row.attr_vals.splice(index, 1);
      this.saveInput(row);
    },
  },
};
</script>

<style scoped>
.box-card {
  margin-top: 15px;
}
.top-row {
  margin: 15px 0;
}
.cascader {
  width: 300px;
}
.editForm {
  margin-left: -50px;
}
.eltagelement {
  margin-right: 15px;
}
.input-new-tag {
  width: 100px;
}
</style>
