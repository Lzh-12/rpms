<script setup>
import { ref, onMounted, watchEffect } from "vue";
// import { Search } from "@element-plus/icons-vue";
import { getMyTask, finishTask, ensureTask } from "@/api/task/index.js";
// import { useRoute } from "vue-router";
// import { projectMy } from "@/api/project/index.js";
import { convertTimestamp, formatTime } from "@/utils/timeConverter.js";
import {
  taskStatusContant,
  taskStatusMap,
  projectStatusMap,
} from "@/constants/statusConstants.js";
import { ElMessage } from "element-plus";
import { tableRowClassName } from "@/utils/tableUtils.js";

// 项目编号
const selectValue = ref(null);
const formTask = ref({
  id: null,
});
// 使用 watchEffect 监听 value 的变化
watchEffect(() => {
  formTask.value.id = selectValue.value;
});

const tableData = ref([]);
// 所有任务列表的接口
const getTaskMy = async () => {
  getMyTask()
    .then((response) => {
      if (response.data.code === 0) {
        tableData.value = response.data.data.map((item) => ({
          ...item,
          id: BigInt(item.id).toString(),
          projectId: BigInt(item.projectId).toString(),
          projectStatus: projectStatusMap[item.projectStatus],
          status: taskStatusMap[item.status],
          result: item.result === "" ? "暂无" : item.result,
          gmtSubmit:
            item.gmtSubmit === 0 ? "未提交" : convertTimestamp(item.gmtSubmit),
          gmtEnsure:
            item.gmtEnsure === 0 ? "未确认" : convertTimestamp(item.gmtEnsure),
          gmtFinish:
            item.gmtFinish === 0 ? "未完成" : convertTimestamp(item.gmtFinish),
          gmtDeadline: convertTimestamp(item.gmtDeadline),
          relativeSubmit: formatTime(item.gmtSubmit).toString(),
          relativeEnsure:
            item.gmtEnsure === 0
              ? "未确认"
              : formatTime(item.gmtEnsure).toString(),
          relativeFinish:
            item.gmtFinish === 0
              ? "未完成"
              : formatTime(item.gmtFinish).toString(),
          relativeDeadline: formatTime(item.gmtDeadline).toString(),
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

onMounted(() => {
  getTaskMy();
});

// ------------------------- 确认任务
const showEnsureButton = (status) => {
  return status === taskStatusContant.STATUS_SUBMIT;
};
const centerDialogVisibleEnsure = ref(false);
const formEnsure = ref({
  id: null,
});
function taskEnsureDialog(id) {
  formEnsure.value.id = BigInt(id);
  centerDialogVisibleEnsure.value = true;
}
const taskEnsure = async () => {
  ensureTask(formEnsure.value)
    .then((response) => {
      if (response.data.code === 0) {
        getTaskMy();
      } else {
        ElMessage.error(response.data.msg || "确认失败");
      }
    })
    .catch((error) => {
      ElMessage.error("确认错误");
      console.log("确认错误", error);
    })
    .finally(() => {
      centerDialogVisibleEnsure.value = false;
    });
};

// ------------------------- 完成任务
const showFinishButton = (status) => {
  return (
    status === taskStatusContant.STATUS_SUBMIT ||
    status === taskStatusContant.STATUS_AGREE
  );
};
const centerDialogVisibleFinish = ref(false);
const formFinish = ref({
  id: null,
  result: "",
});
function taskFinishDialog(id) {
  formFinish.value.id = BigInt(id);
  centerDialogVisibleFinish.value = true;
}
const taskFinish = async () => {
  finishTask(formFinish.value)
    .then((response) => {
      if (response.data.code === 0) {
        ElMessage.success(response.data.msg || "提交成功");
        getTaskMy();
      } else {
        ElMessage.error(response.data.msg || "提交失败");
      }
    })
    .catch((error) => {
      ElMessage.error("提交错误");
      console.log("提交错误", error);
    })
    .finally(() => {
      centerDialogVisibleFinish.value = false;
      formFinish.value.result = "";
    });
};
</script>

<template>
  <div class="container">
    <div class="container-content">
      <div class="table">
        <el-table
          :data="tableData"
          style="width: 100%"
          stripe
          :header-row-class-name="tableRowClassName"
        >
          <el-table-column
            prop="content"
            label="任务内容"
            min-width="150"
            max-widt="240"
            show-overflow-tooltip
          />
          <el-table-column
            prop="status"
            label="任务状态"
            min-width="120"
            max-width="180"
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
            label="提交时间"
            min-width="180"
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
                  <div>创建时间: {{ scope.row.gmtSubmit }}</div>
                </template>
                <template #reference>
                  {{ scope.row.relativeSubmit }}
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="确认时间"
            min-width="180"
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
                  <div>确认时间: {{ scope.row.gmtEnsure }}</div>
                </template>
                <template #reference>
                  {{ scope.row.relativeEnsure }}
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="完成时间"
            min-width="180"
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
                  <div>完成时间: {{ scope.row.gmtFinish }}</div>
                </template>
                <template #reference>
                  {{ scope.row.relativeFinish }}
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="截止时间"
            min-width="180"
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
                  <div>截止时间: {{ scope.row.gmtDeadline }}</div>
                </template>
                <template #reference>
                  {{ scope.row.relativeDeadline }}
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="result"
            label="任务结果"
            min-width="150"
            max-width="290"
            show-overflow-tooltip
          />
          <el-table-column
            fixed="right"
            label="操作"
            min-width="120"
            max-width="220"
          >
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                style="margin-right: 0"
                v-if="showEnsureButton(scope.row.status, scope.row.executorId)"
                @click="taskEnsureDialog(scope.row.id)"
              >
                确认
              </el-button>
              <el-button
                link
                type="primary"
                size="small"
                style="margin-right: 0"
                v-if="showFinishButton(scope.row.status, scope.row.executorId)"
                @click="taskFinishDialog(scope.row.id)"
              >
                完成
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 确认任务 -->
      <el-dialog
        v-model="centerDialogVisibleEnsure"
        title="确认任务"
        width="500"
        center
      >
        <span>是否对该任务进行确认？</span>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="centerDialogVisibleEnsure = false"
              >取消</el-button
            >
            <el-button type="primary" @click="taskEnsure">确认</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 完成任务 -->
      <el-dialog
        v-model="centerDialogVisibleFinish"
        title="完成任务"
        width="600"
        center
      >
        <div
          style="display: flex; align-items: center; justify-content: center"
        >
          <el-form-item label="任务结果">
            <el-input
              v-model="formFinish.result"
              type="textarea"
              style="width: 500px"
            />
          </el-form-item>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="centerDialogVisibleFinish = false"
              >取消</el-button
            >
            <el-button type="primary" @click="taskFinish">确认</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
.container {
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 93vh;
  padding-left: 20px;
  padding-right: 20px;
}

.container-task {
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
  margin-bottom: 10px;
  width: 100%;
}

.container-task-label {
  border-left: 5px solid #273897;
  padding-left: 5px;
  margin-top: 5px;
  margin-bottom: 10px;
}

.container-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 15px;
  padding-bottom: 30px;
}

.publish-content {
  width: 90%;
  margin-top: 5px;
}

.container-textarea {
  width: 90%;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-content: center;
}

.container-button {
  margin-top: 30px;
}

.el-table >>> .success-row th {
  background: #525fad !important;
  color: #fff !important;
}

/* .el-button {
  margin-right: 100px;
} */

.table {
  background-color: #ffffff;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

/* @media screen and (min-width: 1500px) {
  .el-table {
    width: 90%;
  }
} */
</style>