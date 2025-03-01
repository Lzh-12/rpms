<script setup>
import { ref, onMounted } from "vue";
import {
  achieveMyList,
  achieveDelete,
  achieveExamine,
} from "@/api/achieve/index.js";
import {
  achieveStatusContant,
  achieveStatusMap,
} from "@/constants/statusConstants.js";
import { convertTimestamp, formatTime } from "@/utils/timeConverter.js";

// 表格数据
const tableData = ref([]);
// 获取经费申请列表接口
const fetchTableData = async () => {
  achieveMyList()
    .then((response) => {
      if (response.data.code === 0) {
        tableData.value = response.data.data.map((item) => ({
          ...item,
          id: BigInt(item.id).toString(),
          projectId: BigInt(item.projectId).toString(),
          submitterId: BigInt(item.submitterId).toString(),
          status: achieveStatusMap[item.status] || "未知状态",
          type: map[item.type] || "其他",
          gmtCreate: convertTimestamp(item.gmtCreate).toString(),
          gmtModify:
            item.gmtModify === 0
              ? "未修改"
              : convertTimestamp(item.gmtModify).toString(),
          gmtReview:
            item.gmtReview === 0
              ? "未审核"
              : convertTimestamp(item.gmtReview).toString(),
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

// 成果类型
const optionTypes = ref([]);
// 创建映射对象，将 type 的整数值映射到对应的 name 字符串
let map = {};
// 加载后端数据
onMounted(() => {
  optionTypes.value = JSON.parse(localStorage.getItem("achieveTypes"));
  optionTypes.value.forEach(({ id, name }) => {
    map[id] = name;
  });
  fetchTableData();
});

const centerDialogVisible = ref(false);
const id = ref(null);
const status = ref("");

// 对话框
const deleteDialog = async (ProjectId, ProjectStatus) => {
  centerDialogVisible.value = true;
  id.value = BigInt(ProjectId);
  status.value = ProjectStatus;
};
// 删除
const showDeleteButton = (status) => {
  // 项目处于"预处理"才可以进行删除
  return (
    status === achieveStatusContant.STATUS_UNPROCESSED ||
    status === achieveStatusContant.STATUS_REJECTED
  );
};
// 删除经费申请接口
const deleteAchieveApply = async () => {
  if (
    status.value !== achieveStatusContant.STATUS_UNPROCESSED ||
    status.value !== achieveStatusContant.STATUS_REJECTED
  ) {
    alert("不可以删除当前的经费申请");
    centerDialogVisible.value = false;
    return;
  }
  achieveDelete(id.value)
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
const centerDialogVisible2 = ref(false);
const formReview = ref({
  id: null,
  approved: null,
});
const showReviewButton = (status) => {
  // 项目处于"预处理"才可以进行删除
  return status === achieveStatusContant.STATUS_UNPROCESSED;
};
const reviewDialog = async (ProjectId, ProjectStatus) => {
  centerDialogVisible2.value = true;
  formReview.value.id = BigInt(ProjectId);
  status.value = ProjectStatus;
};
const reviewAchieveApply = async () => {
  if (status.value !== "未处理") {
    alert("无法审核当前的成果申请");
    centerDialogVisible2.value = false;
    return;
  }
  achieveExamine(formReview.value)
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
  <el-table :data="tableData" style="width: 100%">
    <el-table-column
      fixed
      label="成果提交人"
      min-width="100"
      max-width="200"
      show-overflow-tooltip
    >
      <template #default="scope">
        <el-popover effect="light" trigger="hover" placement="top" width="auto">
          <template #default>
            <div>用户名: {{ scope.row.submitterName }}</div>
            <div>邮箱: {{ scope.row.submitterEmail }}</div>
          </template>
          <template #reference>
            <el-tag effect="plain" type="success">{{
              scope.row.submitterName
            }}</el-tag>
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      prop="title"
      label="成果标题"
      min-width="120"
      max-width="240"
      show-overflow-tooltip
    />
    <el-table-column
      prop="content"
      label="成果内容"
      min-width="120"
      max-width="250"
      show-overflow-tooltip
    />
    <el-table-column
      prop="status"
      label="成果状态"
      min-width="120"
      max-width="200"
    >
      <template #default="scope">
        <el-popover effect="light" trigger="hover" placement="top" width="auto">
          <template #default>
            <div>类型: {{ scope.row.type }}</div>
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
      label="成果类型"
      min-width="120"
      max-width="200"
      show-overflow-tooltip
    />
    <el-table-column
      prop="gmtCreate"
      label="提交时间"
      min-width="130"
      max-width="240"
      show-overflow-tooltip
    >
      <template #default="scope">
        <el-popover effect="light" trigger="hover" placement="top" width="auto">
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
      min-width="130"
      max-width="240"
      show-overflow-tooltip
    >
      <template #default="scope">
        <el-popover effect="light" trigger="hover" placement="top" width="auto">
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
      label="审核时间"
      min-width="130"
      max-width="240"
      show-overflow-tooltip
    >
      <template #default="scope">
        <el-popover effect="light" trigger="hover" placement="top" width="auto">
          <template #default>
            <div>审核时间: {{ scope.row.gmtReview }}</div>
          </template>
          <template #reference>
            {{ scope.row.relativeReview }}
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      prop="reviewContent"
      label="审核意见"
      min-width="140"
      max-width="280"
      show-overflow-tooltip
    />
    <el-table-column fixed="right" label="操作" min-width="120" max-width="200">
      <template #default="scope">
        <el-button
          link
          type="primary"
          size="small"
          @click="deleteDialog(scope.row.id, scope.row.status)"
          v-if="showDeleteButton(scope.row.status)"
        >
          删除
        </el-button>
        <el-button
          link
          type="primary"
          size="small"
          @click="reviewDialog(scope.row.id, scope.row.status)"
          v-if="showReviewButton(scope.row.status)"
        >
          审核
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 提示框 -->
  <el-dialog v-model="centerDialogVisible" title="提示" width="500" center>
    <span> 确认删除？删除后不可修改 </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteAchieveApply()">
          确认
        </el-button>
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
        <el-button type="primary" @click="reviewAchieveApply()">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
  
<style scoped>
</style>