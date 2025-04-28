<script setup>
import { ref, onMounted } from "vue";
import {
  myFund,
  deleteFund,
  reviewFund,
  modifyFund,
  submitFund,
} from "@/api/fund/index.js";
import {
  fundStatusContant,
  fundStatusMap,
  projectStatusContant,
  projectStatusMap,
} from "@/constants/statusConstants.js";
import { convertTimestamp, formatTime } from "@/utils/timeConverter.js";
import { ElMessage } from "element-plus";
import { tableRowClassName } from "@/utils/tableUtils.js";

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
          projectStatus: projectStatusMap[item.projectStatus],
          figure: BigInt(item.figure).toString(),
          status: fundStatusMap[item.status] || "未知状态",
          gmtCreate: convertTimestamp(item.gmtCreate),
          gmtModify:
            item.gmtModify === 0 ? "未修改" : convertTimestamp(item.gmtModify),
          gmtSubmit:
            item.gmtSubmit === 0 ? "未提交" : convertTimestamp(item.gmtSubmit),
          gmtReview:
            item.gmtReview === 0 ? "未审核" : convertTimestamp(item.gmtReview),
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
        ElMessage.error(response.data.msg || "加载失败");
      }
    })
    .catch((error) => {
      ElMessage.error("加载错误");
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
  // 仅状态为"草稿"的经费申请可以删除
  return status === fundStatusContant.STATUS_DRAFT;
};
const centerDialogVisible = ref(false);
const formDelte = ref({
  id: null,
});
// 对话框
const deleteDialog = async (id) => {
  centerDialogVisible.value = true;
  formDelte.value.id = BigInt(id);
};
// 删除经费申请接口
const deleteFundApply = async () => {
  deleteFund(formDelte.value)
    .then((response) => {
      if (response.data.code === 0) {
        fetchTableData();
        ElMessage.success(response.data.msg || "删除成功");
      } else {
        ElMessage.error(response.data.msg || "删除失败");
      }
    })
    .catch((error) => {
      ElMessage.error("删除错误");
      console.log("删除错误", error);
    })
    .finally(() => {
      centerDialogVisible.value = false;
    });
};

// 审核对话框
const showReviewButton = (status) => {
  // 状态为“已提交”的经费申请可以进行审核
  return status === fundStatusContant.STATUS_SUBMIT;
};
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
  reviewFund(formReview.value)
    .then((response) => {
      if (response.data.code === 0) {
        fetchTableData();
        ElMessage.success(response.data.msg || "审核成功");
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

// ---------------------- 提交经费
const showSubmitButton = (status, projecStatus) => {
  // 经费处于"草稿" 并且 项目处于“已立项”才可以被提交
  return (
    status === fundStatusContant.STATUS_DRAFT &&
    projecStatus === projectStatusContant.STATUS_LAUNCHED
  );
};
const centerDialogVisibleSubmit = ref(false);
const formSubmit = ref({
  id: null,
  content: "",
  figure: "",
  type: "",
});
const submitDialog = async (id, content, figure, type) => {
  centerDialogVisibleSubmit.value = true;
  formSubmit.value.id = BigInt(id); // 经费id
  formSubmit.value.content = content; // 经费内容
  formSubmit.value.figure = figure; // 经费金额
  formSubmit.value.type = type; // 经费类型
};
const submitFundApply = async () => {
  submitFund(formSubmit.value)
    .then((response) => {
      if (response.data.code === 0) {
        fetchTableData();
        ElMessage.success(response.data.msg || "提交成功");
      } else {
        ElMessage.error(response.data.msg || "提交失败");
      }
    })
    .catch((error) => {
      ElMessage.error("提交错误");
      console.log("提交错误", error);
    })
    .finally(() => {
      centerDialogVisibleSubmit.value = false;
    });
};

// --------------------- 修改经费
const showModifyButton = (status) => {
  // 经费处于"草稿"才可以被提交
  return status === fundStatusContant.STATUS_DRAFT;
};
const centerDialogVisibleModify = ref(false);
const formModify = ref({
  id: null,
  content: "",
  figure: "",
  type: "",
});
const modifyDialog = async (id) => {
  centerDialogVisibleModify.value = true;
  formModify.value.id = BigInt(id); // 经费id
};
const fundModify = async () => {
  modifyFund(formModify.value)
    .then((response) => {
      if (response.data.code === 0) {
        fetchTableData();
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
      centerDialogVisibleModify.value = false;
    });
};
</script>

<template>
  <div class="container">
    <el-table
      :data="tableData"
      stripe
      :header-row-class-name="tableRowClassName"
    >
      <el-table-column
        fixed
        label="项目状态"
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
      <el-table-column
        prop="status"
        label="经费状态"
        min-width="120"
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
        show-overflow-tooltip
      />
      <el-table-column
        label="创建时间"
        min-width="100"
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
        min-width="100"
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
        min-width="100"
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
      <el-table-column
        fixed="right"
        label="操作"
        min-width="150"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            v-if="showSubmitButton(scope.row.status, scope.row.projectStatus)"
            @click="
              submitDialog(
                scope.row.id,
                scope.row.content,
                scope.row.figure,
                scope.row.type
              )
            "
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
            v-if="showDeleteButton(scope.row.status)"
            @click="deleteDialog(scope.row.id)"
          >
            删除
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            v-if="showReviewButton(scope.row.status)"
            @click="reviewDialog(scope.row.id)"
          >
            审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 提交经费 -->
  <el-dialog
    v-model="centerDialogVisibleSubmit"
    title="提交经费"
    width="500"
    center
  >
    <span> 确认提交？提交后不可修改 </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisibleSubmit = false">取消</el-button>
        <el-button type="primary" @click="submitFundApply()"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 修改经费 -->
  <el-dialog
    v-model="centerDialogVisibleModify"
    title="修改经费"
    width="600"
    center
  >
    <div style="display: flex; flex-direction: column; align-items: center">
      <el-form :model="formModify" label-width="auto" style="width: 70%">
        <el-form-item label="经费类型">
          <el-select v-model="formModify.type" placeholder="请选择类型">
            <el-option
              v-for="item in optionTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="经费金额">
          <el-input
            v-model="formModify.figure"
            type="number"
            placeholder="请输入经费金额"
          />
        </el-form-item>

        <el-form-item label="经费内容">
          <el-input
            v-model="formModify.content"
            type="textarea"
            placeholder="请输入经费内容"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisibleModify = false">取消</el-button>
        <el-button type="primary" @click="fundModify()"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 删除经费 -->
  <el-dialog v-model="centerDialogVisible" title="提示" width="500" center>
    <span> 确认删除？删除后不可修改 </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteFundApply()"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 审核经费 -->
  <el-dialog v-model="centerDialogVisible2" title="审核经费" width="600" center>
    <div style="display: flex; flex-direction: row; margin-bottom: 20px">
      <label for="" style="margin-right: 20px">审核内容</label>
      <el-input
        v-model="formReview.content"
        type="textarea"
        placeholder="请输入审核内容"
        style="width: 80%"
      />
    </div>
    <label for="" style="margin-right: 20px">确认同意</label>
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
        <el-button type="primary" @click="reviewFundApply()"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
  
<style scoped>
.container {
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

.el-table >>> .success-row th {
  background: #edf6fb !important;
  background: #525fad !important;
  color: #fff !important;
}

@media screen and (min-width: 1500px) {
  .el-table {
    width: 95%;
  }
}
</style>