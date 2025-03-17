 <script setup>
import { ref, onMounted, watch, watchEffect } from "vue";
import { Search } from "@element-plus/icons-vue";
import router from "@/router";
import { useRoute } from "vue-router";
import {
  projectMy,
  projectModify,
  projectDelete,
  projectMembers,
  projectSubmit,
  projectManageMember,
  projectConclude,
  projectApply,
  projectMyCreate,
} from "@/api/project/index.js";
import {
  projectStatusContant,
  projectStatusMap,
} from "@/constants/statusConstants.js";
import { convertTimestamp, formatTime } from "@/utils/timeConverter.js";

// 项目标题
const projectTitle = ref("");
// 选择项目
const tableData = ref([]);

// 查询项目
const searchProjects = () => {
  if (!projectTitle.value) {
    alert("请选择项目");
    return;
  }
  const matchedItem = table.value.find(
    (item) => item.title === projectTitle.value
  );
  if (matchedItem) {
    tableData.value = [matchedItem];
  } else {
    console.log("未找到匹配的项目");
    alert("未找到该项目");
  }
  projectTitle.value = "";
};

const table = ref([]); // 表格数据

// 获取项目数据
const fetchProjects = async () => {
  projectMy()
    .then((response) => {
      console.log(response);
      if (response.data.code === 0) {
        showMode.value = false;
        table.value = response.data.data.map((item) => ({
          ...item,
          id: BigInt(item.id),
          status: projectStatusMap[item.status],
          gmtModify:
            item.gmtModify === 0
              ? "未修改"
              : convertTimestamp(item.gmtModify).toString(),
          gmtCreate: convertTimestamp(item.gmtCreate).toString(),
          gmtReview:
            item.gmtReview === 0
              ? "未审核"
              : convertTimestamp(item.gmtReview).toString(),
          gmtConclude:
            item.gmtConclude === 0
              ? "未结项"
              : convertTimestamp(item.gmtConclude).toString(),
          relativeModify:
            item.gmtModify === 0
              ? "未修改"
              : formatTime(item.gmtModify).toString(),
          relativeCreate: formatTime(item.gmtCreate).toString(),
          relativeReview:
            item.gmtReview === 0
              ? "未审核"
              : formatTime(item.gmtReview).toString(),
          relativeConclude:
            item.gmtConclude === 0
              ? "未结题"
              : formatTime(item.gmtConclude).toString(),
        }));
        tableData.value = table.value;
      } else {
        alert(response.data.msg || "加载失败");
      }
    })
    .catch((error) => {
      console.error("获取项目数据失败:", error);
    });
};

// 获取项目数据
onMounted(() => {
  fetchProjects();
});

const showMode = ref(false);
// ---------------------- 获取创建的项目列表
const createProjects = async () => {
  projectMyCreate()
    .then((response) => {
      if (response.data.code === 0) {
        showMode.value = true;
        table.value = response.data.data.map((item) => ({
          ...item,
          id: BigInt(item.id),
          status: projectStatusMap[item.status] || "未知状态",
          gmtModify:
            item.gmtModify === 0
              ? "未修改"
              : convertTimestamp(item.gmtModify).toString(),
          gmtCreate: convertTimestamp(item.gmtCreate).toString(),
          gmtReview:
            item.gmtReview === 0
              ? "未审核"
              : convertTimestamp(item.gmtReview).toString(),
          gmtConclude:
            item.gmtConclude === 0
              ? "未结项"
              : convertTimestamp(item.gmtConclude).toString(),
          relativeModify:
            item.gmtModify === 0
              ? "未修改"
              : formatTime(item.gmtModify).toString(),
          relativeCreate: formatTime(item.gmtCreate).toString(),
          relativeReview:
            item.gmtReview === 0
              ? "未审核"
              : formatTime(item.gmtReview).toString(),
          relativeConclude:
            item.gmtConclude === 0
              ? "未结题"
              : formatTime(item.gmtConclude).toString(),
        }));
        tableData.value = table.value;
      } else {
        alert(response.data.msg || "加载失败");
      }
    })
    .catch((error) => {
      console.error("获取项目数据失败:", error);
    });
};

// ------------------- 新增项目
const centerDialogVisibleAdd = ref(false);
// 加载项目类型和项目领域
const optionTypes = ref([]);
const optionAreas = ref([]);
// 监听对话框的显示状态，当对话框显示时加载数据
watch(centerDialogVisibleAdd, (newValue) => {
  if (newValue) {
    optionTypes.value = JSON.parse(localStorage.getItem("projectTypes"));
    optionAreas.value = JSON.parse(localStorage.getItem("projectAreas"));
  }
});
// 申请项目的数据模型
const ProjectData = ref({
  title: "", // 项目标题
  sketch: "", // 项目简述
  content: "", // 项目内容
  budget: null, // 项目预算
  type: null, // 项目类型
  area: null, // 项目领域
});
// 申请项目接口
const applyProject = async () => {
  if (
    !ProjectData.value.title ||
    !ProjectData.value.sketch ||
    !ProjectData.value.content ||
    !ProjectData.value.budget ||
    !ProjectData.value.type ||
    !ProjectData.value.area
  ) {
    alert("请输入完整信息");
    return;
  }
  projectApply(ProjectData.value)
    .then((response) => {
      if (response.data.code === 0) {
        alert(response.data.msg || "申请成功");
      } else {
        alert(response.data.msg || "申请失败");
      }
    })
    .catch((error) => {
      console.log(error);
      alert("申请错误");
    })
    .finally(() => {
      centerDialogVisibleAdd.value = false;
      ProjectData.value.title = "";
      ProjectData.value.sketch = "";
      ProjectData.value.content = "";
      ProjectData.value.budget = null;
      ProjectData.value.type = null;
      ProjectData.value.area = null;
      fetchProjects();
    });
};

// 取消输入的内容
function cancel() {
  ProjectData.value.title = "";
  ProjectData.value.sketch = "";
  ProjectData.value.content = "";
  ProjectData.value.budget = null;
}

// 获取项目详情的函数
function getDetail(number) {
  console.log(number);
  router.push(`/director/project/my/detail/${number}`);
}

// 修改
const showUpdateButton = (status) => {
  // 项目处于"草稿"或"被驳回"才可以进行修改
  return (
    status === projectStatusContant.STATUS_DRAFT ||
    status === projectStatusContant.STATUS_REJECTED
  );
};
// 删除
const showDeleteButton = (status) => {
  // 项目处于"草稿才可以进行删除
  return status === projectStatusContant.STATUS_DRAFT;
};
// 提交
const showsubmitButton = (status) => {
  // 项目处于"预处理"或"被驳回"才可以进行提交
  return (
    status === projectStatusContant.STATUS_DRAFT ||
    status === projectStatusContant.STATUS_REJECTED
  );
};
// 结题
const showConclusionButton = (status) => {
  // 项目处于"已立项"状态才可以进行审核
  return status === projectStatusContant.STATUS_LAUNCHED;
};

/* 对话框进行操作 */

// ------------------- 修改项目
const centerDialogVisibleModify = ref(false);
const formModify = ref({
  id: null,
  title: "",
  sketch: "",
  content: "",
  budget: 0,
  type: null,
  area: null,
});
const updateDialog = (id) => {
  formModify.value.id = id; // 项目id
  centerDialogVisibleModify.value = true;
};
// 修改项目接口
const updateProject = async () => {
  projectModify(formModify.value)
    .then((response) => {
      if (response.data.code === 0) {
        fetchProjects();
        alert(response.data.msg || "修改成功");
      } else {
        alert(response.data.msg || "修改失败");
      }
    })
    .catch((error) => {
      console.error("更新项目时发生错误:", error);
      alert("修改项目时发生错误");
    })
    .finally(() => {
      // 清空数据
      formModify.value.id = null;
      formModify.value.title = "";
      formModify.value.sketch = "";
      formModify.value.content = "";
      formModify.value.budget = 0;
      formModify.value.type = null;
      formModify.value.area = null;
      centerDialogVisibleModify.value = false;
    });
};

// ------------------- 删除项目
const centerDialogVisibleDelete = ref(false);
const formDelete = ref({
  id: null,
});
const deleteDialog = (id) => {
  formDelete.value.id = BigInt(id); // 项目id
  centerDialogVisibleDelete.value = true;
};
// 删除项目接口
const deleteProject = async () => {

  console.log(formDelete.value)
  projectDelete(formDelete.value)
    .then((response) => {
      if (response.data.code === 0) {
        createProjects();
        alert(response.data.msg || "删除成功");
      } else {
        alert(response.data.msg || "删除失败");
      }
    })
    .catch((error) => {
      console.error("删除项目时发生错误:", error);
      alert("删除项目时发生错误");
    })
    .finally(() => {
      formDelete.value.id = null;
      centerDialogVisibleDelete.value = false;
    });
};

// ------------------- 查看成员
const centerDialogVisibleMember = ref(false);
const formMember = ref({
  id: null,
});
const getMemberDialog = (id) => {
  formMember.value.id = id; // 项目id
  formManageMember.value.id = id; // 邀请成员
  formDeleteMember.value.id = id; // 删除成员
  centerDialogVisibleMember.value = true;
};
const memberData = ref([]);
// 监听对话框的显示状态，当对话框显示时加载数据
watch(centerDialogVisibleMember, (newValue) => {
  if (newValue) {
    getMemberProject();
  }
});
// 获取项目成员接口
const getMemberProject = async () => {
  projectMembers(formMember.value)
    .then((response) => {
      if (response.data.code === 0) {
        memberData.value = response.data.data.map((item) => ({
          ...item,
          id: BigInt(item.id),
        }));
        // alert(response.data.msg || "查看成功");
      } else {
        alert(response.data.msg || "查看失败");
      }
    })
    .catch((error) => {
      console.error("查看发生错误:", error);
      alert("查看发生错误");
    })
    .finally(() => {
      centerDialogVisibleMember.value = true;
    });
};

// ------------------- 邀请|踢出项目成员
// const visible = ref(false)
const formDeleteMember = ref({
  id: null,
  email: "",
  is: null,
});
// 邀请|踢出成员接口
const deleteMember = async (email) => {
  formDeleteMember.value.email = email;
  formDeleteMember.value.is = false; // 表示踢出成员
  projectManageMember(formDeleteMember.value)
    .then((response) => {
      if (response.data.code === 0) {
        getMemberProject();
        alert(response.data.msg || "删除成功");
      } else {
        alert(response.data.msg || "删除失败");
      }
    })
    .catch((error) => {
      console.error("删除发生错误:", error);
      alert("删除发生错误");
    });
};

// 邀请成员
const formManageMember = ref({
  id: null,
  email: "",
  is: null,
});
const email = ref("");
// 使用 watchEffect 监听 email 的变化
watchEffect(() => {
  formManageMember.value.email = email.value;
});
const innerVisible = ref(false);
const inviteMember = async () => {
  formManageMember.value.is = true; // 表示邀请成员
  projectManageMember(formManageMember.value)
    .then((response) => {
      if (response.data.code === 0) {
        getMemberProject();
        alert(response.data.msg || "邀请成功");
      } else {
        alert(response.data.msg || "邀请失败");
      }
    })
    .catch((error) => {
      console.error("邀请发生错误:", error);
      alert("邀请发生错误");
    })
    .finally(() => {
      innerVisible.value = false; // 关闭对话框
    });
};

// ----------------- 提交项目
const centerDialogVisibleSubmit = ref(false);
const formSubmit = ref({
  id: null,
});
const submitDialog = (id) => {
  formSubmit.value.id = id; // 项目id
  centerDialogVisibleSubmit.value = true;
};
// 提交项目接口
const submitProject = async () => {
  projectSubmit(formSubmit.value)
    .then((response) => {
      if (response.data.code === 0) {
        fetchProjects();
        alert(response.data.msg || "提交成功");
      } else {
        alert(response.data.msg || "提交失败");
      }
    })
    .catch((error) => {
      console.error("提交项目发生错误:", error);
      alert("提交项目发生错误");
    })
    .finally(() => {
      centerDialogVisibleSubmit.value = false;
    });
};

// --------------------- 结题项目
const centerDialogVisibleConclusion = ref(false);
const formConclusion = ref({
  id: null,
  title: "",
  content: "",
});
const conclusionDialog = (id, title) => {
  formConclusion.value.id = id; // 项目id
  formConclusion.value.title = title;
  centerDialogVisibleConclusion.value = true;
};
// 结题项目接口
const conclusionProject = async () => {
  if (!formConclusion.value.content) {
    alert("请输入结题内容");
    return;
  }
  projectConclude(formConclusion.value)
    .then((response) => {
      if (response.data.code === 0) {
        alert(response.data.msg || "提交成功");
      } else {
        alert(response.data.msg || "提交失败");
      }
    })
    .catch((error) => {
      console.error("提交项目发生错误:", error);
      alert("提交项目发生错误");
    })
    .finally(() => {
      centerDialogVisibleConclusion.value = false;
    });
};

// --------------------- 负责人不能删除自己
// 用户id
const route = useRoute();
const temp = route.query.loginId;
const loginId = BigInt(temp);
console.log("loginId:", loginId);

const showDelete = (id) => {
  return !(id === loginId);
};
</script>

<template>
  <!-- 项目管理 - 项目申报 -->
  <div class="container">
    <!-- 查询申请的项目 -->
    <div class="container-find">
      <label for="" class="container-find-label">项目标题</label>
      <el-select
        v-model="projectTitle"
        placeholder="请选择项目"
        size="large"
        style="width: 260px; margin-right: 40px"
      >
        <el-option
          v-for="item in table"
          :key="item"
          :label="item.title"
          :value="item.title"
        />
      </el-select>
      <el-button type="primary" :icon="Search" @click="searchProjects"
        >查询</el-button
      >
      <el-button @click="createProjects">我的创建</el-button>
      <el-button @click="fetchProjects">我的参与</el-button>
    </div>

    <!-- 展示申报的项目 -->
    <div class="container-show">
      <!-- 新增项目 -->
      <div class="container-show-button">
        <el-button
          round
          style="color: #3937a3; height: 40px; width: 100px"
          @click="centerDialogVisibleAdd = true"
          >申报项目</el-button
        >
      </div>
      <!-- 申报项目展示-->
      <div class="container-show-content">
        <el-table :data="tableData">
          <el-table-column
            fixed
            prop="title"
            label="标题"
            min-width="100"
            max-width="170"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="showMode.value"
            prop="leaderName"
            label="负责人"
            min-width="100"
            max-width="160"
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
                  <div>用户名: {{ scope.row.leaderName }}</div>
                  <div>邮箱: {{ scope.row.leaderEmail }}</div>
                </template>
                <template #reference>
                  <!-- <el-tag effect="plain" type="success"> -->
                    {{
                    scope.row.leaderName
                  }}
                  <!-- </el-tag> -->
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!showMode.value"
            prop="reviewerName"
            label="审核人"
            min-width="100"
            max-width="160"
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
                  <div>用户名: {{ scope.row.reviewerName }}</div>
                  <div>邮箱: {{ scope.row.reviewerEmail }}</div>
                </template>
                <template #reference>
                  <!-- <el-tag effect="plain" type="success"> -->
                    {{
                    scope.row.reviewerName || "无"
                  }}
                  <!-- </el-tag> -->
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            min-width="90"
            max-width="160"
          >
            <template #default="scope">
              <el-popover
                effect="light"
                trigger="hover"
                placement="top"
                width="auto"
              >
                <template #default>
                  <div>标题: {{ scope.row.title }}</div>
                  <div>状态: {{ scope.row.status }}</div>
                </template>
                <template #reference>
                  <el-tag>{{ scope.row.status }}</el-tag>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            min-width="110"
            max-width="150"
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
            min-width="110"
            max-width="160"
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
            label="审核时间"
            min-width="110"
            max-width="160"
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
            label="结项时间"
            class-name="time"
            show-overflow-tooltip
          >
            <template #default="scope">
              <el-popover
                effect="light"
                trigger="hover"
                placement="top"
                width="auto"
                min-width="110"
                max-width="160"
              >
                <template #default>
                  <div>结项时间: {{ scope.row.gmtConclude }}</div>
                </template>
                <template #reference>
                  {{ scope.row.relativeConclude }}
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            min-width="190"
            max-width="280"
          >
            <template #default="scope">
              <el-button
                link
                type="info"
                size="small"
                @click="getDetail(scope.row.id)"
                >详情</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                v-if="showUpdateButton(scope.row.status)"
                @click="updateDialog(scope.row.id)"
                >修改</el-button
              >
              <el-button
                link
                type="danger"
                size="small"
                v-if="showDeleteButton(scope.row.status)"
                @click="deleteDialog(scope.row.id)"
                >删除</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                @click="getMemberDialog(scope.row.id)"
                >管理成员</el-button
              >
              <el-button
                link
                type="success"
                size="small"
                v-if="showsubmitButton(scope.row.status)"
                @click="submitDialog(scope.row.id)"
                >提交</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                v-if="showConclusionButton(scope.row.status)"
                @click="conclusionDialog(scope.row.id, scope.row.title)"
                >结题</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 新增项目 -->
    <el-dialog
      v-model="centerDialogVisibleAdd"
      title="申请项目"
      width="900"
      center
    >
      <div class="container2">
        <!-- 填写项目信息 -->
        <div class="container-card">
          <div class="container-card-content" id="title">
            <label for="" class="container-card-content-label"
              >项目标题 *</label
            >
            <el-input
              v-model="ProjectData.title"
              width="100%"
              placeholder="项目标题"
              clearable
            />
          </div>
          <div class="container-card-content" id="sketch">
            <label for="" class="container-card-content-label"
              >项目简述 *</label
            >
            <el-input
              v-model="ProjectData.sketch"
              width="100%"
              placeholder="项目简述"
              clearable
            />
          </div>
        </div>
        <div class="container-card">
          <div class="container-card-content" id="budget">
            <label for="" class="container-card-content-label"
              >项目预算 *</label
            >
            <el-input
              v-model="ProjectData.budget"
              width="100%"
              placeholder="项目预算"
              clearable
              type="number"
            />
          </div>
          <div class="container-card-content" id="content">
            <label for="" class="container-card-content-label"
              >项目内容 *</label
            >
            <el-input
              v-model="ProjectData.content"
              width="100%"
              placeholder="项目内容"
              clearable
            />
          </div>
        </div>
        <div class="container-card">
          <div class="container-card-content" id="budget">
            <label for="" class="container-card-content-label"
              >项目类型 *</label
            >
            <el-select
              v-model="ProjectData.type"
              clearable
              placeholder="请选择类型"
              width="100%"
            >
              <el-option
                v-for="item in optionTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
          <div class="container-card-content" id="content">
            <label for="" class="container-card-content-label"
              >项目领域 *</label
            >
            <el-select
              v-model="ProjectData.area"
              clearable
              placeholder="请选择领域"
              width="100%"
            >
              <el-option
                v-for="item in optionAreas"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
        <div class="container-certain">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="applyProject">确定</el-button>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer"></div>
      </template>
    </el-dialog>

    <!-- 修改项目 -->
    <el-dialog
      v-model="centerDialogVisibleModify"
      title="修改项目"
      width="600"
      align-center
    >
      <el-form-item label="项目标题">
        <el-input v-model="formModify.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="项目简述">
        <el-input v-model="formModify.sketch" placeholder="请输入简述" />
      </el-form-item>
      <el-form-item label="项目内容">
        <el-input
          v-model="formModify.content"
          type="textarea"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item label="项目预算">
        <el-input v-model="formModify.budget" placeholder="请输入预算" />
      </el-form-item>
      <el-form-item label="项目类型">
        <el-select
          v-model="ProjectData.type"
          clearable
          placeholder="请选择类型"
        >
          <el-option
            v-for="item in optionTypes"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="项目领域">
        <el-select
          v-model="ProjectData.area"
          clearable
          placeholder="请选择领域"
        >
          <el-option
            v-for="item in optionAreas"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisibleModify = false">取消</el-button>
          <el-button type="primary" @click="updateProject"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 删除项目 -->
    <el-dialog
      v-model="centerDialogVisibleDelete"
      title="删除项目"
      width="500"
      align-center
    >
      <span>确定要删除该项目吗？您将无法恢复已删除的项目</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisibleDelete = false">取消</el-button>
          <el-button type="danger" @click="deleteProject"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 管理成员 -->
    <el-dialog
      v-model="centerDialogVisibleMember"
      title="项目成员"
      min-width="800"
      max-width="1100"
      align-center
    >
      <div>
        <el-table :data="memberData" stripe style="width: 100%">
          <!-- <el-table-column fixed prop="id" label="用户id" min-width="100" max-width="150"/> -->
          <el-table-column
            fixed
            prop="email"
            label="用户邮箱"
            min-width="170"
            max-width="200"
          />
          <el-table-column
            prop="name"
            label="用户名"
            min-width="120"
            max-width="200"
          />
          <el-table-column
            prop="phone"
            label="用户手机号"
            min-width="130"
            max-width="200"
          />
          <el-table-column
            prop="qq"
            label="QQ"
            min-width="120"
            max-width="180"
          />
          <el-table-column
            prop="qq"
            label="微信号"
            min-width="120"
            max-width="180"
          />
          <el-table-column
            prop="institution"
            label="所属机构"
            min-width="100"
            max-width="160"
          />
          <el-table-column fixed="right" label="操作" width="100">
            <template #default="scope">
              <!-- <el-popover :visible="visible" placement="top" :width="160">
                <p>确定删除该成员吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="small" text @click="visible = false"
                    >取消</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteMember(scope.row.email)"
                  >
                    确认
                  </el-button>
                </div>
                <template #reference>
                  <el-button @click="visible = true" v-if="showDelete(scope.row.id)">删除</el-button>
                </template>
              </el-popover> -->
              <el-button
                link
                type="danger"
                size="small"
                v-if="showDelete(scope.row.id)"
                @click="deleteMember(scope.row.email)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 嵌套对话框  -->
      <el-dialog
        v-model="innerVisible"
        width="500"
        title="邀请成员"
        append-to-body
      >
        <span>邮箱地址</span>
        <el-input placeholder="请输入成员邮箱" v-model="email"></el-input>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="innerVisible = false">取消</el-button>
            <el-button type="primary" @click="inviteMember"> 确定 </el-button>
          </div>
        </template>
      </el-dialog>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="innerVisible = true">
            邀请
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 提交项目 -->
    <el-dialog
      v-model="centerDialogVisibleSubmit"
      title="提交项目"
      width="500"
      align-center
    >
      <span>确定要提交该项目吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisibleSubmit = false">取消</el-button>
          <el-button type="primary" @click="submitProject"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 结题项目 -->
    <el-dialog
      v-model="centerDialogVisibleConclusion"
      title="结题项目"
      width="600"
      align-center
    >
      <div style="display: flex">
        <label for="">结题内容</label>
        <el-input
          v-model="formConclusion.content"
          style="width: 500px; margin-left: 10px"
          :autosize="{ minRows: 3, maxRows: 8 }"
          type="textarea"
          placeholder="请输入结题内容"
        />
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisibleConclusion = false"
            >取消</el-button
          >
          <el-button type="danger" @click="conclusionProject">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.el-input {
  width: 300px;
}

.el-select {
  width: 300px;
}

.container-find {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 90px;
  margin-bottom: 10px;
  background-color: #ffffff;
}

.container-find-label {
  display: flex;
  justify-content: center;
  margin-right: 30px;
}

.container-show {
  background-color: #ffffff;
  padding: 20px;
}

.container-show-button {
  height: 60px;
  border-bottom: 2px solid #f0e9e9;
}

.container-show-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.container2 {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.container-card {
  display: flex;
  flex-direction: row;
  align-content: center;
  padding-left: 10%;
  border-bottom: 2px solid #f8f5f5;
}

.container-card-content {
  display: flex;
  flex-direction: column;
  margin-right: 80px;
  padding-top: 30px;
  padding-bottom: 30px;
}

.container-card-content-label {
  padding-left: 5px;
  border-left: 5px solid #582c8b;
  color: #8847d3;
  margin-right: 30px;
  margin-bottom: 10px;
}

.container-card-content-title {
  display: flex;
  flex-direction: row;
}

.container-card-content-button {
  margin-top: 10px;
  margin-left: 20px;
}

.container-certain {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
}

/* 媒体查询：当屏幕宽度大于 1500px 时 */
/* @media screen and (min-width: 1500px) {
  .title {
    width: 160px;
  }

  .status {
    width: 160px;
  }

  .time {
    width: 200px;
  }

  .operation {
    width: 450px;
  }
} */
</style>