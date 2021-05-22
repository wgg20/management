<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand" width="60px">
          <template slot-scope="scope">
            <!-- 遍历一级权限列表 -->
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="[
                'borderbottom',
                index1 === 0 ? 'bordertop' : '',
                'v-center ',
              ]"
            >
              <!-- 渲染一级权限列表   左边蓝色一列 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightsById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二三级权限  右边两个颜色的标签 -->
              <el-col :span="19">
                <!-- 遍历渲染二级列表 -->
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 === 0 ? '' : 'bordertop', 'v-center ']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="12">
                    <!-- 三级权限列表遍历   有个close的方法
                    删除权限时需要获取角色和权限-->
                    <el-tag
                      type="warning"
                      v-for="(item3, index3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightsById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="min"
              @click="showChange(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="min"
              @click="deleteRolesById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="min"
              @click="showRightVisible(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 弹出弹框修改角色信息 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="editVisible"
      width="50%"
      @close="editFormClose"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="角色ID">
          <el-input v-model="editForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限提示框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="rightDialogVisible"
      width="70%"
      @close="setkeyArrayNull"
    >
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="keysArray"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="putintoRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 树形控件 -->
  </div>
</template>

<script>
export default {
  name: 'Roles',
  props: {},
  components: {},
  data() {
    return {
      rolesList: [],
      editForm: {
        roleId: '',
        roleName: '',
        roleDesc: '',
      },
      editRules: {
        roleId: [
          { required: true, message: '请输入角色Id', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
      },
      editVisible: false,
      rightDialogVisible: false,
      // 给分配权限返回的数据一个数组保存
      rightList: [],
      // 树形结构绑定的对象属性
      treeProps: {
        // children：树形结构的连接点
        // label：选定的字段
        children: 'children',
        label: 'authName',
      },
      // 存储所有角色中已经拥有的id
      keysArray: [],
      // 存储请求数据返回的角色id
      rolesId: '',
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取用户角色数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles');
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户角色列表失败！');
      }
      this.rolesList = res.data;
      console.log(this.rolesList);
    },
    // 使用id获取当前角色数据
    async showChange(id) {
      const { data: res } = await this.$http.get('roles/' + id);
      if (res.meta.status != 200) {
        return this.$message.error('获取角色列表失败！');
      }
      this.editForm = res.data;
      this.editVisible = true;
      console.log(res.data + '22222');
    },
    // 重置修改用户信息表单
    editFormClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改角色信息并添加到数据库
    editRoles() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          }
        );
        if (res.meta.status != 200) {
          return this.$message.error('角色信息修改失败');
        }
        // 关闭弹窗
        this.editVisible = false;
        // 重新请求数据
        this.getRolesList();
        // 提示成功
        this.$message.success('角色信息修改成功！');
      });
    },
    async deleteRolesById(id) {
      // console.log(id);
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
      // 获取单个用户数据并进行删除
      const { data: res } = await this.$http.delete('roles/' + id);
      if (res.meta.status != 200) {
        return this.$message.error('删除角色失败！');
      }
      this.$message.success('删除角色成功！');
      //再次获取新的数据列表
      this.getRolesList();
    },
    async removeRightsById(role, rightId) {
      const rightsResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((error) => error);
      // 取消时返回的信息
      if (rightsResult != 'confirm') {
        return this.$message.info('取消该操作！');
      }
      // 成功时返回的数据
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status != 200) {
        return this.$message.error('删除失败！');
      }
      // 如果不做任何处理的话，当完成删除操作后页面会跳转
      // 所以需要将删除完后的数据重新赋值给role.children
      role.children = res.data;
      // console.log(res);
      // this.getRolesList();
    },
    // 展示用户权限
    async showRightVisible(role) {
      this.rolesId = role.id;
      const { data: res } = await this.$http.get('rights/tree');
      if (res.meta.status != 200) {
        return this.$message.error('分配权限失败！');
      }
      this.rightList = res.data;
      this.getkeysId(role, this.keysArray);
      this.rightDialogVisible = true;
      console.log(res);
    },
    // 通过递归形式，获取当前节点下的所有角色三级权限的id
    getkeysId(node, arr) {
      // 判断是否处在三级节点
      // console.log('----');
      // console.log(node.children);
      if (!node.children) {
        return arr.push(node.id);
      }
      // debugger;
      // 不处在三级节点采用递归
      node.children.forEach((item) => {
        this.getkeysId(item, arr);
      });
    },
    // 清空前面数组的递归的影响
    setkeyArrayNull() {
      this.keysArray = [];
    },
    // 为没有权限的角色分配权限,并存入数据库
    async putintoRights() {
      // 获取树形框中所有选中的属性
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      // 将数组以'，'分割，作为请求路径的参数
      const keyDir = keys.join(',');
      const { data: res } = await this.$http.post(
        `roles/${this.rolesId}/rights`,
        {
          rids: keyDir,
        }
      );
      if (res.meta.status != 200) {
        return this.$message.error('添加权限失败！');
      }
      this.$message.success('添加权限成功！');
      // 重新刷新角色列表
      this.getRolesList();
      // 将弹窗关闭
      this.rightDialogVisible = false;
    },
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 15px;
}
.el-form {
  margin-left: -20px;
}
.el-tag {
  margin: 7px;
}
.bordertop {
  border-top: 1px solid #eee;
}
.borderbottom {
  border-bottom: 1px solid #eee;
}
.v-center {
  display: flex;
  align-items: center;
}
</style>
