<script setup>
import { ref, onMounted } from "vue";
import { myFund, deleteFund, reviewFund } from "@/api/fund/index.js";
import {
  fundStatusContant,
  fundStatusMap,
} from "@/constants/statusConstants.js";
import { convertTimestamp, formatTime } from "@/utils/timeConverter.js";

// 申请列表
const tableData = ref([]);
// 获取经费申请列表接口
const fetchTableData = async () => {
  myFund()
    .then((response) => {
      if (response.data.code === 0) {
        tableData.value = response.data.data.map((item) => ({
          ...item,
          id: BigInt(item.id).toString(),
          projectId: BigInt(item.projectId).toString(),
          expenserId: BigInt(item.expenserId).toString(),
          figure: BigInt(item.figure).toString(),
          status: fundStatusMap[item.status] || "未知状态",
          type: map[item.type] || "其他费用",
          gmtCreate: convertTimestamp(item.gmtCreate),
          gmtModify:
            item.gmtModify === 0 ? "未修改" : convertTimestamp(item.gmtModify),
          gmtReview:
            item.gmtReview === 0 ? "未审核" : convertTimestamp(item.gmtReview),
          relativeCreate: formatTime(item.gmtCreate).toString(),
          relativeModify:
            item.gmtModify === 0
              ? "未修改"
              : formatTime(item.gmtModify).toString(),
          relativeReview:
            item.gmtReview === 0
              ? "未审核"
              : formatTime(item.gmtReview).toString(),
        }));
      } else {
        alert(response.data.msg || "加载失败");
      }
    })
    .catch((error) => {
      alert("加载错误");
      console.log("加载错误", error);
    });
};

// 经费类型
const optionTypes = ref([]);
// 创建映射对象，将 type 的整数值映射到对应的 name 字符串
let map = {};
// 加载后端数据
onMounted(() => {
  optionTypes.value = JSON.parse(localStorage.getItem("fundTypes"));
  optionTypes.value.forEach(({ id, name }) => {
    map[id] = name;
  });
  fetchTableData();
});

// 删除经费申请
const showDeleteButton = (status) => {
  // 仅状态为"未处理"或“拒绝报销”的经费申请可以删除
  return (
    status === fundStatusContant.STATUS_UNPROCESSED ||
    status === fundStatusContant.STATUS_REJECT
  );
};
const centerDialogVisible = ref(false);
const formDelte = ref({
  id: null,
});
const status = ref("");
// 对话框
const deleteDialog = async (ProjectId, ProjectStatus) => {
  centerDialogVisible.value = true;
  formDelte.value.id = BigInt(ProjectId);
  status.value = ProjectStatus;
};
// 删除经费申请接口
const deleteFundApply = async () => {
  if (
    status.value !== fundStatusContant.STATUS_UNPROCESSED &&
    status.value !== fundStatusContant.STATUS_REJECT
  ) {
    alert("不可以删除当前的经费申请");
    centerDialogVisible.value = false;
    return;
  }
  deleteFund(formDelte.value)
    .then((response) => {
      if (response.data.code === 0) {
        fetchTableData();
        alert(response.data.msg || "删除成功");
      } else {
        alert(response.data.msg || "删除失败");
      }
    })
    .catch((error) => {
      alert("删除错误");
      console.log("删除错误", error);
    })
    .finally(() => {
      centerDialogVisible.value = false;
    });
};

// 审核对话框
const showReviewButton = (status) => {
  // 项目处于"预处理"才可以进行删除
  return status === fundStatusContant.STATUS_UNPROCESSED;
};
const centerDialogVisible2 = ref(false);
const formReview = ref({
  id: null,
  approved: null,
});
const reviewDialog = async (ProjectId, ProjectStatus) => {
  centerDialogVisible2.value = true;
  formReview.value.id = BigInt(ProjectId);
  status.value = ProjectStatus;
};
const reviewFundApply = async () => {
  if (status.value !== fundStatusContant.STATUS_UNPROCESSED) {
    alert("无法审核当前的经费申请");
    centerDialogVisible2.value = false;
    return;
  }
  reviewFund(formReview.value)
    .then((response) => {
      if (response.data.code === 0) {
        fetchTableData();
        alert(response.data.msg || "审核成功");
      } else {
        alert(response.data.msg || "审核失败");
      }
    })
    .catch((error) => {
      alert("审核错误");
      console.log("审核错误", error);
    })
    .finally(() => {
      centerDialogVisible2.value = false;
    });
};
</script>

<template>
  <div class="container">
    <el-table :data="tableData">
      <el-table-column
        fixed
        label="经费申请人"
        min-width="120"
        max-width="200"
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
              <el-tag effect="plain" type="success">{{
                scope.row.expenserName
              }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="content"
        label="经费内容"
        min-width="120"
        max-width="250"
        show-overflow-tooltip
      />
      <el-table-column
        prop="figure"
        label="经费金额"
        min-width="100"
        max-width="200"
        show-overflow-tooltip
      />
      <el-table-column
        prop="status"
        label="经费状态"
        min-width="120"
        max-widt="200"
      >
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
        max-width="200"
        show-overflow-tooltip
      />
      <el-table-column
        label="创建时间"
        min-width="140"
        max-width="230"
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
              <div>创建时间: {{ scope.row.gmtCreate }}</div>
            </template>
            <template #reference>
              {{ scope.row.relativeCreate }}
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="修改时间"
        min-width="140"
        max-width="230"
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
              <div>修改时间: {{ scope.row.gmtModify }}</div>
            </template>
            <template #reference>
              {{ scope.row.relativeModify }}
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="gmtReview"
        label="审核时间"
        min-width="140"
        max-width="230"
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
              <div>审核时间: {{ scope.row.gmtReview }}</div>
            </template>
            <template #reference>
              {{ scope.row.relativeReview }}
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="120" max-width="220">
        <template #default="scope">
          <el-button
            link
            type="danger"
            size="small"
            v-if="showDeleteButton(scope.row.status)"
            @click="deleteDialog(scope.row.id, scope.row.status)"
          >
            删除
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            v-if="showReviewButton(scope.row.status)"
            @click="reviewDialog(scope.row.id, scope.row.status)"
          >
            审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 提示框 -->
  <el-dialog v-model="centerDialogVisible" title="提示" width="500" center>
    <span> 确认删除？删除后不可修改 </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="deleteFundApply()"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="centerDialogVisible2" title="提示" width="500" center>
    <input
      type="radio"
      name="approved"
      v-model="formReview.approved"
      :value="true"
      checked
    />同意报销
    <input
      type="radio"
      name="approved"
      v-model="formReview.approved"
      :value="false"
      checked
    />拒绝报销
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
  /* border: 2px solid red; */
  display: flex;
  justify-content: center;
  align-items: start;
  width: 100%;
  background-color: #ffffff;
}

.el-table {
  padding: 5px;
  padding-bottom: 20px;
}

@media screen and (min-width: 1500px) {
  .el-table {
    width: 95%;
  }
}
</style>