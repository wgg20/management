<template>
  <div class="add">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 提示框 -->
      <el-alert
        title="消息提示的文案"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs标签页 -->
      <el-form
        :model="addRuleForm"
        :rules="addRules"
        ref="ruleFormRef"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="tabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addRuleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addRuleForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addRuleForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addRuleForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                :options="cateList"
                :props="cateProps"
                v-model="addRuleForm.goods_cat"
                @change="handleChange"
                style="width:300px"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数" name="1">
            <!-- 参数面板参数 -->
            <el-form-item
              v-for="item1 in manyData"
              :label="item1.attr_name"
              :key="item1.attr_id"
            >
              <!-- 复选框 -->
              <el-checkbox-group v-model="item1.attr_vals">
                <el-checkbox
                  :label="item2"
                  v-for="(item2, index2) in item1.attr_vals"
                  :key="index2"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyData"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片 
            action：上传图片发出的请求-->
            <el-upload
              :action="this.imgURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="imgSuccess"
            >
              <el-button size="small" type="primary">上传图片</el-button>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="商品内容" name="4"></el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewURL" alt="" class="pre_img" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Add',
  props: {},
  components: {},
  data() {
    return {
      // 激活的标签的index值
      activeIndex: '0',
      // 表单对象
      addRuleForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        // 用于存放服务器返回的图片路径
        pics: [],
      },
      // 表单校验规则
      addRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
        goods_cat: [
          { required: true, message: '请输入选择商品分类', trigger: 'blur' },
        ],
      },
      // 多选框的数据
      cateList: [],
      // 级联选择器
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      // 返回参数模块的数据
      manyData: [],
      // 返回商品属性的数据
      onlyData: [],
      // el-upload组件上传图片发出的请求没有经过axios发出Ajax请求
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      // 预览对话框显示与否
      previewVisible: false,
      // 服务器的预览图片的路径
      previewURL: '',
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    cateId() {
      if (this.addRuleForm.goods_cat.length === 3) {
        return this.addRuleForm.goods_cat[2];
      }
      return null;
    },
    //上传图片发出请求的路径
    imgURL() {
      return this.$http.defaults.baseURL + 'upload';
    },
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories');
      if (res.meta.status != 200) {
        return this.$message.error('获取数据失败');
      }
      this.cateList = res.data;
      // this.$message.success('获取数据成功');
      // console.log(res.data);
    },
    // 级联选择器的数据发生改变
    handleChange() {
      // 控制只能选择三级分类
      if (this.addRuleForm.goods_cat.length != 3) {
        this.addRuleForm.goods_cat = [];
      }
    },
    // 侧边栏即将切换时触发函数
    tabLeave(activeTab, oldTab) {
      // 如果当前的级联选择器没有选中三级，则不允许侧边栏切换
      if (oldTab === '0' && this.addRuleForm.goods_cat.length != 3) {
        this.$message.error('请选择商品分类！');
        return false;
      }
    },
    // 切换面板触发的函数
    async tabClick() {
      // 当触发的面板的name值为1商品参数时发起获取参数请求
      if (this.activeIndex == '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' },
          }
        );
        if (res.meta.status != 200) {
          return this.$message.error('获取参数失败！');
        }
        // 将返回的数据转换成数组
        res.data.forEach((item) => {
          return (item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(','));
        });
        this.manyData = res.data;
        // console.log(res.data);
      }
      // 当触发的面板的name值为2商品参数时发起获取参数请求
      else if (this.activeIndex == '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' },
          }
        );
        if (res.meta.status != 200) {
          return this.$message.error('获取参数失败！');
        }
        this.onlyData = res.data;
        // console.log(res.data);
      }
    },
    // 预览图片时触发的事件
    handlePreview(file) {
      console.log(file);
      this.previewVisible = true;
      this.previewURL = file.response.data.url;
    },

    // 图片上传成功后触发的函数,response是服务器传回的数据
    imgSuccess(response) {
      console.log(response);
      // 拼接得到一个图片数据对象
      const pics_info = { pic: response.data.tmp_path };
      // 将每个图片信息推送入专门存储的数组中
      this.addRuleForm.pics.push(pics_info);
      console.log(this.addRuleForm);
    },
    // 当触发移除图片触发的事件,默认传回一个图片信息
    handleRemove(file) {
      // console.log(file);
      // 获取将要删除图片的路径
      const filePath = file.response.data.tmp_path;
      //从pics数组中获取当前要删除的图片的索引值
      const i = this.addRuleForm.pics.findIndex((x) => (x.pic = filePath));
      // 将索引中查询到的路径从pics数组中移除
      this.addRuleForm.pics.splice(i, 1);
      console.log(this.addRuleForm);
    },
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 15px;
}
.el-steps {
  width: 80%;
  margin: 15px auto;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.pre_img {
  width: 100%;
}
</style>
