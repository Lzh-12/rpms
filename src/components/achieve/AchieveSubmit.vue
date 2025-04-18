<script setup>
import { ref, onMounted } from "vue";
import { achieveExamine, achieveAll } from "@/api/achieve/index.js";
import { projectMy } from "@/api/project";
import {
  achieveStatusMap,
  projectStatusMap,
} from "@/constants/statusConstants.js";
import { convertTimestamp, formatTime } from "@/utils/timeConverter.js";
import { ElMessage } from "element-plus";
import { tableRowClassName } from "@/utils/tableUtils.js";

// 成果列表
const tableData = ref([]);
const formData = ref({
  id: null,
});
// 获取成果申请列表接口
const allAchieve = async () => {
  if (!form.value.id) {
    ElMessage.warning("请选择项目");
    return;
  }
  formData.value.id = BigInt(form.value.id);

  achieveAll(formData.value)
    .then((response) => {
      if (response.data.code === 0) {
        tableData.value = response.data.data.map((item) => ({
          ...item,
          id: BigInt(item.id).toString(),
          projectId: BigInt(item.projectId).toString(),
          projectStatus: projectStatusMap[item.projectStatus],
          submitterId: BigInt(item.submitterId).toString(),
          status: achieveStatusMap[item.status],
          gmtSubmit: convertTimestamp(item.gmtSubmit).toString(),
          gmtReview:
            item.gmtReview === 0
              ? "未审核"
              : convertTimestamp(item.gmtReview).toString(),
          relativeSubmit: formatTime(item.gmtSubmit).toString(),
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

const formTitle = ref("");
// 审核对话框
const centerDialogVisible2 = ref(false);
const formReview = ref({
  id: null,
  approved: null,
  content: "",
});
const reviewDialog = async (id, title) => {
  centerDialogVisible2.value = true;
  formReview.value.id = BigInt(id);
  formTitle.value = title;
};
const reviewAchieveApply = async () => {
  if (!formReview.value.content) {
    alert("请输入审核内容");
    return;
  }
  achieveExamine(formReview.value)
    .then((response) => {
      if (response.data.code === 0) {
        ElMessage.success(response.data.msg || "审核成功");
        allAchieve();
      } else {
        ElMessage.error(response.data.msg || "审核失败");
      }
    })
    .catch((error) => {
      ElMessage.error("审核错误");
      console.log("审核错误：", error);
    })
    .finally(() => {
      centerDialogVisible2.value = false;
    });
};

// 项目编号
const options = ref([]);
// 提交数据
const form = ref({
  id: null,
});
// 从后端获取选项数据
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
      console.log("加载项目错误:", error);
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
  fetchOptions();
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
      <el-button
        type="primary"
        :icon="Search"
        class="search"
        @click="allAchieve"
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
          label="成果提交人"
          min-width="100"
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
                <div>用户名: {{ scope.row.submitterName }}</div>
                <div>邮箱: {{ scope.row.submitterEmail }}</div>
              </template>
              <template #reference>
                <!-- <el-tag effect="plain" type="success"> -->
                {{ scope.row.submitterName }}
                <!-- </el-tag> -->
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="成果标题"
          min-width="120"
          max-width="300"
          show-overflow-tooltip
        />
        <el-table-column
          prop="content"
          label="成果内容"
          min-width="120"
          max-width="300"
          show-overflow-tooltip
        />
        <el-table-column
          prop="status"
          label="成果状态"
          min-width="100"
          max-width="200"
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
          label="成果类型"
          min-width="100"
          max-width="200"
          show-overflow-tooltip
        />
        <el-table-column
          label="提交时间"
          min-width="100"
          max-width="240"
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
                <div>提交时间: {{ scope.row.gmtSubmit }}</div>
              </template>
              <template #reference>
                {{ scope.row.relativeSubmit }}
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="审核时间"
          min-width="100"
          max-width="240"
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
          min-width="100"
          max-width="200"
        >
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              v-if="scope.row.status === '已提交'"
              @click="reviewDialog(scope.row.id, scope.row.title)"
            >
              审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <el-dialog v-model="centerDialogVisible2" title="审核成果" width="700" center>
    <div
      style="
        display: flex;
        flex-direction: column;
        width: 500;
        align-items: center;
      "
    >
      <div style="display: flex; flex-direction: row; margin-bottom: 20px">
        <label for="" style="white-space: nowrap; margin-right: 20px"
          >成果标题</label
        >
        <el-input v-model="formTitle" style="width: 450px" disabled />
      </div>
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
        <el-button type="primary" @click="reviewAchieveApply()">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
  
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #ffffff;
}

.el-form-item {
  width: 40%;
  margin-right: 20px;
}

.el-table >>> .success-row th {
  background: #525fad !important;
  color: #fff !important;
}

.search {
  margin-bottom: 15px;
}
/* 
@media screen and (min-width: 1500px) {
  .el-table {
    width: 90%;
  }
} */
</style>