<script setup>
import { ref, onMounted } from "vue";
import { getAllUserService, updateUserGrantService } from "@/api/user/index.js";
import { ElMessage } from "element-plus";
import { tableRowClassName } from "@/utils/tableUtils.js";

const centerDialogVisible = ref(false);

const tableData = ref([]);
// 获取所有用户信息
const fetchTableData = async () => {
  getAllUserService()
    .then((response) => {
      if (response.data.code === 0) {
        tableData.value = response.data.data
          .filter((item) => item.id !== 0)
          .map((item) => ({
            ...item,
            id: BigInt(item.id).toString(),
          }));
      }
    })
    .catch((error) => {
      ElMessage.error("获取用户信息错误");
      console.log("获取用户信息错误", error);
    });
};

onMounted(() => {
  fetchTableData();
});

const formData = ref({
  id: null,
  type: 1,
  is: true,
});
const edit = (id) => {
  centerDialogVisible.value = true;
  formData.value.id = BigInt(id);
};

// 添加|撤销用户权限
const updateGrant = async () => {
  updateUserGrantService(formData.value)
    .then((response) => {
      if (response.data.code === 0) {
        ElMessage.success(response.data.msg || "修改成功");
      } else {
        ElMessage.error(response.data.msg || "修改失败");
      }
    })
    .catch((error) => {
      ElMessage.error("修改错误");
      console.log("修改错误", error);
    })
    .finally(() => {
      centerDialogVisible.value = false;
      formData.value.id = null;
      formData.value.type = 1;
      formData.value.is = true;
    });
};

const options = ref([
  {
    label: "成员",
    type: 1,
  },
  {
    label: "负责人",
    type: 2,
  },
]);

const optionsIsGrant = ref([
  {
    label: "是",
    is: true,
  },
  {
    label: "否",
    is: false,
  },
]);
</script>

<template>
  <div class="container">
    <div class="table">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        border
        :header-row-class-name="tableRowClassName"
      >
        <el-table-column
          prop="email"
          label="用户邮箱"
          min-width="230"
          sortable
          show-overflow-tooltip
        />
        <el-table-column
          prop="name"
          label="用户名"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="phone"
          label="用户手机号"
          min-width="200"
          sortable
          show-overflow-tooltip
        />
        <el-table-column
          prop="qq"
          label="QQ号"
          min-width="150"
          sortable
          show-overflow-tooltip
        />
        <el-table-column
          prop="wechat"
          label="微信号"
          min-width="150"
          sortable
          show-overflow-tooltip
        />
        <el-table-column
          prop="institution"
          label="所属机构"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          fixed="right"
          label="操作"
          min-width="100"
        >
          <template #default="scope">
            <el-button link type="primary" @click="edit(scope.row.id)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <el-dialog
    v-model="centerDialogVisible"
    title="管理用户权限"
    width="500"
    center
  >
    <div class="container-dialog">
      <div class="container-dialog-content">
        <label for="" class="container-dialog-label">权限类型</label>
        <el-select
          v-model="formData.type"
          placeholder="请选择权限类型"
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
            :key="item"
            :label="item.label"
            :value="item.type"
          />
        </el-select>
      </div>
      <div>
        <label for="" class="container-dialog-label">是否授权</label>
        <el-select
          v-model="formData.is"
          placeholder="请选择是否授权"
          style="width: 240px"
        >
          <el-option
            v-for="item in optionsIsGrant"
            :key="item"
            :label="item.label"
            :value="item.is"
          />
        </el-select>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateGrant">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  background-color: #ffffff;
  padding: 20px;
  display: flex;
  justify-content: center;
}

.container-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container-dialog-content {
  margin-bottom: 20px;
}

.container-dialog-label {
  margin-right: 30px;
}

.el-table >>> .success-row th {
  background: #edf6fb !important;
  background: #525fad !important;
  color: #fff !important;
}

.table {
  display: flex;
  justify-content: center;
  align-items: start;
  width: 100%;
}
</style>   