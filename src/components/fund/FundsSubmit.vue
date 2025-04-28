<script setup>
import { ref, onMounted } from "vue";
import { reviewFund, projectAllFund } from "@/api/fund/index.js";
import { projectMy } from "@/api/project";
import {
  fundStatusMap,
  projectStatusMap,
} from "@/constants/statusConstants.js";
import { convertTimestamp, formatTime } from "@/utils/timeConverter.js";
import { ElMessage } from "element-plus";
import { tableRowClassName } from "@/utils/tableUtils.js";
import { Search } from "@element-plus/icons-vue";

// 表格数据
const tableData = ref([]);

// 审核对话框
const centerDialogVisible2 = ref(false);
const formReview = ref({
  id: null,
  approved: null,
  content: "",
});
const reviewDialog = async (id) => {
  centerDialogVisible2.value = true;
  formReview.value.id = BigInt(id);
};
const reviewFundApply = async () => {
  if (!formReview.value.content) {
    ElMessage.warning("请输入审核内容");
    return;
  }
  reviewFund(formReview.value)
    .then((response) => {
      if (response.data.code === 0) {
        ElMessage.success(response.data.msg || "审核成功");
        searchAll();
      } else {
        ElMessage.error(response.data.msg || "审核失败");
      }
    })
    .catch((error) => {
      ElMessage.error("审核错误");
      console.log("审核错误", error);
    })
    .finally(() => {
      centerDialogVisible2.value = false;
    });
};

// 提交数据
const form = ref({
  id: null,
});
// 项目已提交的经费列表的接口
const searchAll = async () => {
  if (!form.value.id) {
    ElMessage.warning("请先选择项目");
    return;
  }
  projectAllFund(form.value)
    .then((response) => {
      if (response.data.code === 0) {
        tableData.value = response.data.data.map((item) => ({
          ...item,
          id: BigInt(item.id).toString(),
          projectId: BigInt(item.projectId).toString(),
          projectStatus: projectStatusMap[item.projectStatus],
          expenserId: BigInt(item.expenserId).toString(),
          figure: BigInt(item.figure).toString(),
          status: fundStatusMap[item.status],
          gmtSubmit: convertTimestamp(item.gmtSubmit),
          gmtReview:
            item.gmtReview === 0 ? "未审核" : convertTimestamp(item.gmtReview),
          relativeSubmit: formatTime(item.gmtSubmit).toString(),
          relativeReview:
            item.gmtReview === 0
              ? "未审核"
              : formatTime(item.gmtReview).toString(),
        }));
      } else {
        ElMessage.error(response.data.msg || "查询失败");
      }
    })
    .catch((error) => {
      ElMessage.error("查询错误");
      console.log("查询错误", error);
    });
};

// ---------------------- 项目编号
const options = ref([]);
const fetchOptions = async () => {
  projectMy()
    .then((response) => {
      if (response.data.code === 0) {
        options.value = response.data.data.map((item) => ({
          ...item,
          id: BigInt(item.id).toString(),
        }));
      } else {
        ElMessage.error(response.data.msg || "加载项目失败");
      }
    })
    .catch((error) => {
      ElMessage.error("加载项目错误");
      console.log("加载项目错误", error);
    });
};
// 经费类型
const optionTypes = ref([]);
// 创建映射对象，将 type 的整数值映射到对应的 name 字符串
let map = {};
// 加载后端数据
onMounted(() => {
  fetchOptions();
  optionTypes.value = JSON.parse(localStorage.getItem("fundTypes"));
  optionTypes.value.forEach(({ id, name }) => {
    map[id] = name;
  });
});
</script>

<template>
  <div class="container">
    <div class="container-title">
      <el-form-item label="项目">
        <el-select v-model="form.id" placeholder="请选择项目">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-button type="primary" class="search" @click="searchAll" :icon="Search"
        >查询</el-button
      >
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        stripe
        :header-row-class-name="tableRowClassName"
      >
        <el-table-column
          fixed
          label="经费申请人"
          min-width="120"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="top"
              width="auto"
            >
              <template #default>
                <div>用户名: {{ scope.row.expenserName }}</div>
                <div>邮箱: {{ scope.row.expenserEmail }}</div>
              </template>
              <template #reference>
                {{ scope.row.expenserName }}
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="项目状态" min-width="120" show-overflow-tooltip>
          <template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="top"
              width="auto"
            >
              <template #default>
                <div>状态: {{ scope.row.projectStatus }}</div>
              </template>
              <template #reference>
                <el-tag effect="plain" type="success">{{
                  scope.row.projectStatus
                }}</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column
          prop="content"
          label="经费内容"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="figure"
          label="经费金额"
          min-width="100"
          show-overflow-tooltip
        />
        <el-table-column prop="status" label="经费状态" min-width="120">
          <template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="top"
              width="auto"
            >
              <template #default>
                <div>内容: {{ scope.row.content }}</div>
                <div>状态: {{ scope.row.status }}</div>
              </template>
              <template #reference>
                <el-tag>{{ scope.row.status }}</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="经费类型"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column label="提交时间" min-width="100" show-overflow-tooltip>
          <template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="top"
              width="auto"
            >
              <template #default>
                <div>提交时间: {{ scope.row.gmtSubmit }}</div>
              </template>
              <template #reference>
                {{ scope.row.relativeSubmit }}
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="审核时间" min-width="100" show-overflow-tooltip>
          <template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="top"
              width="auto"
            >
              <template #default>
                <div>审核时间: {{ scope.row.gmtReview }}</div>
              </template>
              <template #reference>
                {{ scope.row.relativeReview }}
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              v-if="scope.row.status === '已提交'"
              @click="reviewDialog(scope.row.id, scope.row.status)"
            >
              审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <el-dialog v-model="centerDialogVisible2" title="审核经费" width="700" center>
    <div style="display: flex; flex-direction: column; align-items: center">
      <div style="display: flex; flex-direction: row; margin-bottom: 20px">
        <label for="" style="margin-right: 20px">审核内容</label>
        <el-input
          v-model="formReview.content"
          type="textarea"
          placeholder="请输入审核内容"
          style="width: 450px"
        />
      </div>
      <div>
        <input
          type="radio"
          name="approved"
          v-model="formReview.approved"
          :value="true"
          checked
        />同意
        <input
          type="radio"
          name="approved"
          v-model="formReview.approved"
          :value="false"
          checked
        />拒绝
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="reviewFundApply()"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
  
<style scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f8f8;
}

.container-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100px;
  background-color: #ffffff;
  width: 100%;
  margin-bottom: 10px;
}

.table {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #ffffff;
}

.el-table {
  width: 100%;
  padding-bottom: 20px;
}

.el-form-item {
  width: 40%;
  margin-right: 20px;
}

.search {
  margin-left: 40px;
  margin-bottom: 15px;
}

.el-table >>> .success-row th {
  background: #edf6fb !important;
  background: #525fad !important;
  color: #fff !important;
}

/* @media screen and (min-width: 1500px) {
  .el-table {
    width: 80%;
  }
} */
</style>