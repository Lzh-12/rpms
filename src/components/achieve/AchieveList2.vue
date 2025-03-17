<script setup>
import { ref, onMounted } from "vue";
import {
  achieveMyList,
  achieveDelete,
  achieveExamine,
  achieveModify,
  achieveSubmit,
} from "@/api/achieve/index.js";
import {
  achieveStatusContant,
  achieveStatusMap,
  projectStatusContant,
  projectStatusMap,
} from "@/constants/statusConstants.js";
import { convertTimestamp, formatTime } from "@/utils/timeConverter.js";

// 表格数据
const tableData = ref([]);
// 获取成果申请列表接口
const fetchTableData = async () => {
  achieveMyList()
    .then((response) => {
      if (response.data.code === 0) {
        tableData.value = response.data.data.map((item) => ({
          ...item,
          id: BigInt(item.id).toString(),
          projectId: BigInt(item.projectId).toString(),
          projecStatus: projectStatusMap[item.projecStatus],
          status: achieveStatusMap[item.status] || "未知状态",
          gmtCreate: convertTimestamp(item.gmtCreate).toString(),
          gmtModify:
            item.gmtModify === 0
              ? "未修改"
              : convertTimestamp(item.gmtModify).toString(),
          gmtSubmit:
            item.gmtSubmit === 0 ? "未提交" : convertTimestamp(item.gmtSubmit),
          gmtReview:
            item.gmtReview === 0
              ? "未审核"
              : convertTimestamp(item.gmtReview).toString(),
          relativeCreate: formatTime(item.gmtCreate).toString(),
          relativeModify:
            item.gmtModify === 0
              ? "未修改"
              : formatTime(item.gmtModify).toString(),
          relativeSubmit:
            item.gmtSubmit === 0
              ? "未提交"
              : formatTime(item.gmtSubmit).toString(),
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
const formDelte = ref({
  id: null,
});

// 对话框
const deleteDialog = async (id) => {
  centerDialogVisible.value = true;
  formDelte.value.id = BigInt(id);
};
// 删除
const showDeleteButton = (status) => {
  // 仅状态为"草稿”的成果可以删除
  return status === achieveStatusContant.STATUS_DRAFT;
};
// 删除经费申请接口
const deleteAchieveApply = async () => {
  achieveDelete(formDelte.value)
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
  content: "",
});
const showReviewButton = (status) => {
  // 状态为“已提交”的成果申请可以进行审核
  return status === achieveStatusContant.STATUS_SUBMIT;
};
const reviewDialog = async (id) => {
  centerDialogVisible2.value = true;
  formReview.value.id = BigInt(id);
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

// ------------------------- 提交成果
const showSubmitButton = (status, projecStatus) => {
  // 仅 “草稿” 状态的成果可以被提交
  return (
    status === achieveStatusContant.STATUS_DRAFT &&
    projecStatus === projectStatusContant.STATUS_LAUNCHED
  );
};
const centerDialogVisibleSubmit = ref(false);
const formSubmit = ref({
  id: null,
});
const submitDialog = async (id) => {
  centerDialogVisibleSubmit.value = true;
  formSubmit.value.id = BigInt(id); // 成果id
};
const submitAchieveApply = async () => {
  achieveSubmit(formSubmit.value)
    .then((response) => {
      if (response.data.code === 0) {
        fetchTableData();
        alert(response.data.msg || "提交成功");
      } else {
        alert(response.data.msg || "提交失败");
      }
    })
    .catch((error) => {
      alert("提交错误");
      console.log("提交错误", error);
    })
    .finally(() => {
      centerDialogVisibleSubmit.value = false;
    });
};

// ------------------- 修改成果
const showModifyButton = (status) => {
  // 经费处于"草稿"才可以被提交
  return status === achieveStatusContant.STATUS_DRAFT;
};
const centerDialogVisibleModify = ref(false);
const formModify = ref({
  id: null,
  title: "",
  content: "",
  type: null,
});
const modifyDialog = async (id) => {
  centerDialogVisibleModify.value = true;
  formModify.value.id = BigInt(id); // 成果id
};
const modifyAchieve = async () => {
  achieveModify(formModify.value)
    .then((response) => {
      if (response.data.code === 0) {
        fetchTableData();
        alert(response.data.msg || "修改成功");
      } else {
        alert(response.data.msg || "修改失败");
      }
    })
    .catch((error) => {
      alert("修改错误");
      console.log("修改错误", error);
    })
    .finally(() => {
      centerDialogVisibleModify.value = false;
    });
};
</script>

<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column
      fixed
      label="项目状态"
      min-width="120"
      max-width="200"
      show-overflow-tooltip
    >
      <template #default="scope">
        <el-popover effect="light" trigger="hover" placement="top" width="auto">
          <template #default>
            <div>状态: {{ scope.row.projecStatus }}</div>
          </template>
          <template #reference>
            <el-tag effect="plain" type="success">{{
              scope.row.projecStatus
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
          v-if="showSubmitButton(scope.row.status, scope.row.projecStatus)"
          @click="submitDialog(scope.row.id)"
        >
          提交
        </el-button>
        <el-button
          link
          type="primary"
          size="small"
          v-if="showModifyButton(scope.row.status)"
          @click="modifyDialog(scope.row.id)"
        >
          修改
        </el-button>
        <el-button
          link
          type="danger"
          size="small"
          @click="deleteDialog(scope.row.id)"
          v-if="showDeleteButton(scope.row.status)"
        >
          删除
        </el-button>
        <el-button
          link
          type="primary"
          size="small"
          @click="reviewDialog(scope.row.id)"
          v-if="showReviewButton(scope.row.status)"
        >
          审核
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 提交成果 -->
  <el-dialog v-model="centerDialogVisible" title="提交成果" width="500" center>
    <span> 确认提交？提交后不可修改 </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisibleSubmit = false">取消</el-button>
        <el-button type="primary" @click="submitAchieveApply()">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 修改成果 -->
  <el-dialog
    v-model="centerDialogVisibleModify"
    title="修改经成果"
    width="600"
    center
  >
    <div style="display: flex; flex-direction: column; align-items: center">
      <el-form :model="formModify" label-width="auto" style="width: 70%">
        <el-form-item label="成果标题">
          <el-input
            v-model="formModify.title"
            type="number"
            placeholder="请输入成果标题"
          />
        </el-form-item>
        <el-form-item label="成果类型">
          <el-select v-model="formModify.type" placeholder="请选择类型">
            <el-option
              v-for="item in optionTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="成果内容">
          <el-input
            v-model="formModify.content"
            type="textarea"
            placeholder="请输入成果内容"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisibleModify = false">取消</el-button>
        <el-button type="primary" @click="modifyAchieve()"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 删除成果 -->
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

  <el-dialog v-model="centerDialogVisible2" title="审核成果" width="500" center>
    <div style="display: flex; flex-direction: row; margin-bottom: 20px">
      <label for="" style="margin-right: 20px">审核内容</label>
      <el-input
        v-model="formReview.content"
        type="textarea"
        placeholder="请输入审核内容"
        style="width: 80%"
      />
    </div>
    <label for="" style="margin-right: 20px;">确认同意</label>
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