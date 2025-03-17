<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { Search } from "@element-plus/icons-vue";
import {
  submitTask,
  getAllTask,
  getMyTask,
  deleteTask,
  publishTask,
  finishTask,
  ensureTask,
  modifyTask,
} from "@/api/task/index.js";
import { projectMy, projectMembers } from "@/api/project/index.js";
import { useRoute } from "vue-router";
import { convertTimestamp, formatTime } from "@/utils/timeConverter.js";
import {
  taskStatusContant,
  taskStatusMap,
  projectStatusMap,
  projectStatusContant,
} from "@/constants/statusConstants.js";

// 用户id
const route = useRoute();
const temp = route.query.loginId;
const loginId = BigInt(temp);
console.log(loginId);

const showColumn = ref(false);

// 项目id数据模型
const options = ref([]);
// 项目列表
const fetchOptions = async () => {
  projectMy()
    .then((response) => {
      if (response.data.code === 0) {
        // 获取所有项目的id
        options.value = response.data.data.map((item) => ({
          ...item,
          id: BigInt(item.id).toString(),
        }));
      } else {
        alert(response.data.msg || "加载项目失败");
      }
    })
    .catch((error) => {
      alert("加载项目错误");
      console.log("加载项目错误", error);
    });
};
// 加载组件时调用 fetchOptions 函数
onMounted(() => {
  fetchOptions();
  getTaskMy();
});

// ------------------------------ 提交任务
const centerDialogVisible = ref(false);
// 任务列表数据模型
const tableData = ref([]);
// 提交任务数据模型
const taskData = ref({
  id: null,
  result: "",
});
const showSubmitButton = (projecStatus, status) => {
  // 仅对应项目状态为“已立项”可以提交 仅状态为“草稿”的任务可以提交
  return (
    projecStatus === projectStatusContant.STATUS_LAUNCHED &&
    status === taskStatusContant.STATUS_DRAFT &&
    showColumn.value
  );
};
// 提交对话框
const taskSubmitDialog = (id) => {
  taskData.value.id = BigInt(id); // 任务id
  centerDialogVisible.value = true;
};
// 提交任务接口
const submitContent = async () => {
  submitTask(taskData.value)
    .then((response) => {
      if (response.data.code === 0) {
        getTaskMy();
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
      centerDialogVisible.value = false;
    });
};

// 项目编号
const selectValue = ref(null);
const formTask = ref({
  id: null,
});
// 使用 watchEffect 监听 value 的变化
watchEffect(() => {
  formTask.value.id = selectValue.value;
});
// 获取对应项目的任务列表接口
const getTask = async () => {
  getAllTask(formTask.value)
    .then((response) => {
      if (response.data.code === 0) {
        showColumn.value = true;

        console.log("showColumn", showColumn.value);
        tableData.value = response.data.data.map((item) => ({
          ...item,
          id: BigInt(item.id).toString(),
          projectId: BigInt(item.projectId).toString(),
          projecStatus: projectStatusMap[item.projecStatus],
          executorId: BigInt(item.executorId).toString(),
          status: taskStatusMap[item.status],
          gmtCreate: convertTimestamp(item.gmtCreate),
          gmtSubmit:
            item.gmtSubmit === 0 ? "未提交" : convertTimestamp(item.gmtSubmit),
          gmtEnsure:
            item.gmtEnsure === 0 ? "未确认" : convertTimestamp(item.gmtEnsure),
          gmtFinish:
            item.gmtFinish === 0 ? "未完成" : convertTimestamp(item.gmtFinish),
          gmtDeadline: convertTimestamp(item.gmtDeadline),
          relativeCreate: formatTime(item.gmtCreate).toString(),
          relativeModify: formatTime(item.gmtModify).toString(),
          relativeSubmit:
            item.gmtSubmit === 0
              ? "未提交"
              : formatTime(item.gmtSubmit).toString(),
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
        alert(response.data.msg || "查询成功");
      } else {
        alert(response.data.msg || "查询失败");
      }
    })
    .catch((error) => {
      alert("错误");
      console.log("查询错误：", error);
    });
};

// 当前用户的任务列表的接口
const getTaskMy = async () => {
  getMyTask()
    .then((response) => {
      if (response.data.code === 0) {
        showColumn.value = false;
        tableData.value = response.data.data.map((item) => ({
          ...item,
          id: BigInt(item.id).toString(),
          projectId: BigInt(item.projectId).toString(),
          projecStatus: projectStatusMap[item.projecStatus],
          status: taskStatusMap[item.status],
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
        alert(response.data.msg || "查询成功");
      } else {
        alert(response.data.msg || "查询失败");
      }
    })
    .catch((error) => {
      alert("查询错误");
      console.log("查询错误：", error);
    });
};

// ------------------------ 删除任务
const centerDialogVisible2 = ref(false);

const formDelete = ref({
  id: null,
});
function taskDeleteDialog(id) {
  formDelete.value.id = BigInt(id);
  centerDialogVisible2.value = true;
}
const showDeleteButton = (status) => {
  // “草稿” 状态才能提交
  return status === taskStatusContant.STATUS_DRAFT && showColumn.value;
};
// 删除任务的接口
const deleteContent = async () => {
  console.log(formDelete.value);
  deleteTask(formDelete.value)
    .then((response) => {
      if (response.data.code === 0) {
        // 获取后端数据
        getTaskMy();
        alert(response.data.msg || "删除成功");
      } else {
        alert(response.data.msg || "删除失败");
      }
    })
    .catch((error) => {
      alert("删除错误");
      console.log("删除错误：", error);
    })
    .finally(() => {
      centerDialogVisible2.value = false;
    });
};

// ----------------- 发布任务
const centerDialogVisiblePublish = ref(false);
watchEffect(() => {
  if (centerDialogVisiblePublish.value) {
    fetchOptions(); // 项目id
  }
});
const publishData = ref({
  id: null,
  executor_id: null,
  content: "",
  gmt_deadline: null,
});
const timestamp = ref({
  time: new Date(),
});
const membersData = ref({
  id: null,
});
const optionsMember = ref([]); // 成员信息
// 监听项目id的变化
watchEffect(() => {
  membersData.value.id = publishData.value.id;
});
const getProjectAndMember = async () => {
  if (!membersData.value.id) {
    alert("请先选择项目");
    return;
  }
  projectMembers(membersData.value)
    .then((response) => {
      if (response.data.code === 0) {
        optionsMember.value = response.data.data.map((item) => ({
          ...item,
          id: BigInt(item.id).toString(),
        }));
        alert(response.data.msg || "加载成员成功");
      } else {
        alert(response.data.msg || "加载成员失败");
      }
    })
    .catch((error) => {
      alert("加载成员错误");
      console.log("加载成员错误", error);
    });
};
// 发布任务接口
const taskPublish = async () => {
  if (
    !publishData.value.id ||
    !publishData.value.executor_id ||
    !publishData.value.content ||
    !timestamp.value.time
  ) {
    alert("请确保输入完整数据");
    return;
  }
  // 转换为时间戳
  publishData.value.gmt_deadline = BigInt(timestamp.value.time.getTime());
  publishTask(publishData.value)
    .then((response) => {
      if (response.data.code === 0) {
        alert(response.data.msg || "发布任务成功");
      } else {
        alert(response.data.msg || "发布任务失败");
      }
    })
    .catch((error) => {
      alert("发布任务错误");
      console.log("发布任务错误", error);
    })
    .finally(() => {
      centerDialogVisiblePublish.value = false;
      publishData.value.id = null;
      publishData.value.executor_id = null;
      publishData.value.content = "";
      publishData.value.gmt_deadline = null;
    });
};

// ------------------------- 修改任务
const showModifyButton = (status) => {
  return status === taskStatusContant.STATUS_DRAFT && showColumn.value;
};
const centerDialogVisibleModify = ref(false);
const formModify = ref({
  id: null,
  executor_id: null,
  content: "",
  gmt_deadline: null,
});
function taskModifyDialog(id, executor_id) {
  formModify.value.id = BigInt(id);
  formModify.value.executor_id = BigInt(executor_id);
  centerDialogVisibleModify.value = true;
}
const taskModify = async () => {
  if (!formModify.value.content || !formModify.value.gmt_deadline) {
    alert("请输入完整内容");
    return;
  }
  modifyTask()
    .then((response) => {
      if (response.data.code === 0) {
        getTask(); // 加载任务
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
      formModify.value.content = "";
      formModify.value.gmt_deadline = null;
    });
};

// ------------------------- 确认任务
const showEnsureButton = (status) => {
  return status === taskStatusContant.STATUS_SUBMIT && !showColumn.value;
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
  ensureTask()
    .then((response) => {
      if (response.data.code === 0) {
        getTaskMy();
      } else {
        alert(response.data.msg || "确认失败");
      }
    })
    .catch((error) => {
      alert("确认错误");
      console.log("确认错误", error);
    })
    .finally(() => {
      centerDialogVisibleEnsure.value = false;
    });
};

// ------------------------- 完成任务
const showFinishButton = (status) => {
  return (
    (status === taskStatusContant.STATUS_SUBMIT ||
      status === taskStatusContant.STATUS_AGREE) &&
    !showColumn.value
  );
};
const centerDialogVisibleFinish = ref(false);
const formFinish = ref({
  id: null,
  content: "",
});
function taskFinishDialog(id) {
  formFinish.value.id = BigInt(id);
  centerDialogVisibleFinish.value = true;
}
const taskFinish = async () => {
  finishTask()
    .then((response) => {
      if (response.data.code === 0) {
        getTaskMy();
      } else {
        alert(response.data.msg || "提交失败");
      }
    })
    .catch((error) => {
      alert("提交错误");
      console.log("提交错误", error);
    })
    .finally(() => {
      centerDialogVisibleFinish.value = false;
      formFinish.value.content = "";
    });
};
</script>

<template>
  <div class="container">
    <!-- 需要完成的任务 -->
    <div class="container-task">
      <div class="container-task-select">
        <el-select
          v-model="selectValue"
          placeholder="请选择项目中我发布的任务"
          size="large"
          style="width: 260px; margin-left: 30px; margin-right: 30px"
        >
          <el-option
            v-for="item in options"
            :key="item"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
        <el-button :icon="Search" circle @click="getTask" />
      </div>
      <el-button type="primary" @click="getTaskMy">我的任务</el-button>
    </div>

    <div class="container-content">
      <div style="width: 95%; margin-top: 20px; margin-bottom: 30px">
        <el-button
          type="primary"
          plain
          @click="centerDialogVisiblePublish = true"
          >发布任务</el-button
        >
      </div>
      <div class="table">
        <el-table :data="tableData">
          <el-table-column
            v-if="showColumn"
            fixed
            label="任务执行人"
            min-width="100"
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
                  <div>用户名: {{ scope.row.executorName }}</div>
                  <div>邮箱: {{ scope.row.executorEmail }}</div>
                </template>
                <template #reference>
                  <!-- <el-tag effect="plain" type="success"> -->
                  {{ scope.row.executorName }}
                  <!-- </el-tag> -->
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="项目状态"
            min-width="100"
            max-width="180"
            show-overflow-tooltip
          >
            <template #default="scope">
              <!-- <el-popover
                effect="light"
                trigger="hover"
                placement="top"
                width="auto"
              > -->
              <!-- <template #default> -->
              <!-- <div>状态: {{ scope.row.projecStatus }}</div> -->
              <!-- </template> -->
              <!-- <template #reference> -->
              <el-tag effect="plain" type="success">
                {{ scope.row.projecStatus }}
              </el-tag>
              <!-- </template> -->
              <!-- </el-popover> -->
            </template>
          </el-table-column>
          <el-table-column
            prop="content"
            label="任务内容"
            min-width="150"
            max-width="220"
            show-overflow-tooltip
          />
          <el-table-column
            prop="status"
            label="任务状态"
            min-width="120"
            max-width="180"
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
            v-if="showColumn"
            label="任务创建时间"
            min-width="150"
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
            v-if="showColumn"
            label="任务修改时间"
            min-width="150"
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
            label="任务提交时间"
            min-width="150"
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
                  <div>提交时间: {{ scope.row.gmtSubmit }}</div>
                </template>
                <template #reference>
                  {{ scope.row.relativeSubmit }}
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="任务确认时间"
            min-width="150"
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
            label="任务完成时间"
            min-width="150"
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
            label="任务截止时间"
            min-width="150"
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
            max-width="280"
            show-overflow-tooltip
          />
          <el-table-column
            fixed="right"
            label="操作"
            min-width="150"
            max-width="220"
          >
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                style="margin-right: 0"
                v-if="
                  showSubmitButton(scope.row.projecStatus, scope.row.status)
                "
                @click="taskSubmitDialog(scope.row.id)"
              >
                提交
              </el-button>
              <el-button
                link
                type="primary"
                size="small"
                style="margin-right: 0"
                v-if="showModifyButton(scope.row.projecStatus)"
                @click="taskModifyDialog(scope.row.id, scope.row.executor_id)"
              >
                修改
              </el-button>
              <el-button
                link
                type="danger"
                size="small"
                style="margin-right: 0"
                @click="taskDeleteDialog(scope.row.id)"
                v-if="showDeleteButton(scope.row.projecStatus)"
                >删除</el-button
              >
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
    </div>
  </div>
  <!-- 提交任务 -->
  <el-dialog v-model="centerDialogVisible" title="提交任务" width="500" center>
    <span>确认提交该任务？</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitContent"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 修改任务 -->
  <el-dialog
    v-model="centerDialogVisibleModify"
    title="修改任务"
    width="600"
    center
  >
    <div style="display: flex; flex-direction: column; align-items: center">
      <el-form-item label="任务内容">
        <el-input
          v-model="formModify.content"
          type="textarea"
          style="width: 240px"
        />
      </el-form-item>
      <div>
        <label for="" style="margin-right: 15px">截止时间</label>
        <el-date-picker
          v-model="timestamp.time"
          type="datetime"
          placeholder="选择日期和时间"
        />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisibleModify = false">取消</el-button>
        <el-button type="primary" @click="taskModify">确认</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 删除任务 -->
  <el-dialog v-model="centerDialogVisible2" title="任务结果" width="500" center>
    <span>确认删除任务？</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="deleteContent"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>

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
        <el-button @click="centerDialogVisibleEnsure = false">取消</el-button>
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
    <div style="display: flex; align-items: center; justify-content: center">
      <el-form-item label="任务内容">
        <el-input
          v-model="formFinish.content"
          type="textarea"
          style="width: 400px"
        />
      </el-form-item>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisibleFinish = false">取消</el-button>
        <el-button type="primary" @click="taskFinish">确认</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 发布任务 -->
  <el-dialog
    v-model="centerDialogVisiblePublish"
    title="发布任务"
    width="600"
    center
  >
    <div style="display: flex; flex-direction: column; align-items: center">
      <div style="margin-bottom: 20px">
        <label for="" style="margin-right: 15px">项目标题</label>
        <el-select
          v-model="publishData.id"
          placeholder="请选择项目id"
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
            :key="item"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </div>
      <div style="margin-bottom: 20px">
        <el-button
          style="margin-right: 15px; padding: 0"
          @click="getProjectAndMember"
          >获取成员</el-button
        >
        <el-select
          v-model="publishData.executor_id"
          placeholder="请选择成员id"
          style="width: 240px"
        >
          <el-option
            v-for="item in optionsMember"
            :key="item.id"
            :label="item.email"
            :value="item.id"
          />
        </el-select>
      </div>
      <el-form-item label="项目内容">
        <el-input
          v-model="publishData.content"
          type="textarea"
          style="width: 240px"
        />
      </el-form-item>
      <div>
        <label for="" style="margin-right: 15px">截止时间</label>
        <el-date-picker
          v-model="timestamp.time"
          type="datetime"
          placeholder="选择日期和时间"
        />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisiblePublish = false">取消</el-button>
        <el-button type="primary" @click="taskPublish"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
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
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgb(226, 238, 234);
}

.container-task-select {
  display: flex;
  flex-direction: row;
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

.table {
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