<template>
  <div class="home-user">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getuserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getuserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"
          ><el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <el-table border stripe style="width: 100%" :data="userlist">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <!-- {{ scope.row }}获取当前行的数据 -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="swichStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="min"
                @click="showEditDialogVisible(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="min"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="管理"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="min"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 7]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 用户提示对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="resetForm"
    >
      <el-form
        :model="ruleForm"
        :rules="addRules"
        ref="ruleFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息的弹窗 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editFormClose"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" prop="email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="editForm.mobile" prop="mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUsers">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'User',
  props: {},
  components: {},
  data() {
    // 校验合法的邮箱
    var cheakEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (regEmail.test(value)) {
        //合法的邮箱
        return cb();
      }
      cb(new Error('改邮箱不合法'));
    };
    //验证手机号码
    var cheakMobile = (rule, value, cb) => {
      const regMobile = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (regMobile.test(value)) {
        //合法的邮箱
        return cb();
      }
      cb(new Error('改手机号不合法'));
    };
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      // 控制是否显示对话框
      addDialogVisible: false,
      // 控制修改用户信息弹窗是否显示
      editDialogVisible: false,
      ruleForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 验证规则
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: cheakEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: cheakMobile, trigger: 'blur' },
        ],
      },
      // 用户查询到的信息对象
      editForm: {},
      // 用户修改字段原则
      editRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: cheakEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: cheakMobile, trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    this.getuserList();
  },
  methods: {
    async getuserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error('没有获取到用户信息!');
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
      console.log(res);
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getuserList();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      // this.queryInfo.pagenum = 1;
      this.getuserList();
    },
    resetForm() {
      // 修改表单
      this.$refs.ruleFormRef.resetFields();
    },
    // 修改用户状态，并将它保存到数据库中
    async swichStateChanged(stateInfo) {
      const { data: res } = await this.$http.put(
        `users/${stateInfo.id}/state/${stateInfo.mg_state}`
      );
      if (res.meta.status != 200) {
        // 状态更新失败，则把原来的状态改回来
        stateInfo.mg_state = !stateInfo.mg_state;
        return this.$message.error('用户状态更新失败！');
      }
      this.$message.success('用户状态更新成功！');
    },
    //添加用户信息并保存到数据库
    addUsers() {
      this.$refs.ruleFormRef.validate(async (valid) => {
        //如果表单为空或者有误则return出去
        if (!valid) return;
        const { data: res } = await this.$http.post('users', this.ruleForm);
        if (res.meta.status != 201) {
          this.$message.error('添加用户失败！');
        }
        this.$message.success('添加用户成功！');
        // 隐藏用户对话框
        this.addDialogVisible = false;
        // 重新获取用户数据
        this.getuserList();
      });
    },
    async showEditDialogVisible(id) {
      // 使用id参数获取用户信息
      const { data: res } = await this.$http.get('users/' + id);
      if (res.meta.status !== 200) {
        return this.$message.error('用户信息修改失败！');
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
      console.log(res.data);
    },
    // 重置修改用户信息表单
    editFormClose() {
      this.$refs.editFormRef.resetFields();
    },
    //修改信息并保存到数据库中
    editUsers() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error('用户信息修改失败！');
        }
        // 关闭弹窗
        this.editDialogVisible = false;
        // 重新请求数据
        this.getuserList();
        // 提示成功
        this.$message.success('用户信息修改成功！');
      });
    },
  },
};
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 15px;
}
.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
.el-form {
  margin-left: -30px;
}
</style>
