<script setup>
import { ref, onMounted, watch } from "vue";
import router from "@/router";
import {
  projectMembers,
  projectReview,
  projectApproved,
  projectUnapproved,
} from "@/api/project/index.js";
import { Search } from "@element-plus/icons-vue";
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

// const total = ref(20); // 数据总数
// const pageSize = ref(20); // 每页显示20条数据
// const currentPage = ref(1); // 当前页码
// const pages = ref({
//   page: 0, // 当前页码
// });
// 当页码改变时触发的函数
// const handleCurrentChange = (newPage) => {
//   currentPage.value = newPage;
//   // 调用API获取数据
//   fetchProjects();
// };

// const fetchPages = async () => {
//   projectTallyPages()
//     .then((response) => {
//       if (response.data.code === 0) {
//         total.value = response.data.data;
//       } else {
//         alert("加载失败");
//       }
//     })
//     .catch((error) => {
//       alert("加载错误");
//       console.log("加载错误", error);
//     });
// };

const table = ref([]); // 表格数据
// 获取项目统计信息
const fetchProjects = async () => {
  // pages.value.page = Number(currentPage.value) - 1;

  // console.log(currentPage.value, pages.value.page);
  // projectTally(pages.value)
  projectApproved()
    .then((response) => {
      if (response.data.code === 0) {
        showMode.value = true;
        table.value = response.data.data.map((item) => ({
          ...item,
          id: BigInt(item.id).toString(),
          leaderId: BigInt(item.leaderId).toString(),
          reviewerId: BigInt(item.reviewerId).toString(),
          budget: BigInt(item.budget).toString(),
          status: projectStatusMap[item.status],
          gmtReview: convertTimestamp(item.gmtReview),
          gmtConclude:
            item.gmtConclude === 0
              ? "未结项"
              : convertTimestamp(item.gmtConclude),
          taskNum: BigInt(item.taskNum).toString(),
          memberNum: BigInt(item.memberNum).toString(),
          achieveNum: BigInt(item.achieveNum).toString(),
          fundNum: BigInt(item.fundNum).toString(),
          relativeReview: formatTime(item.gmtReview).toString(),
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
  // fetchPages();
  getUnapprovedProjects();
});

// ---------------------- 获取未通过的项目列表
const getUnapprovedProjects = async () => {
  projectUnapproved()
    .then((response) => {
      if (response.data.code === 0) {
        showMode.value = false;
        table.value = response.data.data.map((item) => ({
          ...item,
          id: BigInt(item.id).toString(),
          leaderId: BigInt(item.leaderId).toString(),
          reviewerId: BigInt(item.reviewerId).toString(),
          status: projectStatusMap[item.status],
          gmtSubmit: convertTimestamp(item.gmtSubmit),
          gmtReview: item.gmtReview === 0 ? "未审核" : convertTimestamp(item.gmtReview),
          relativeSubmit: formatTime(item.gmtReview), 
          relativeReview: item.gmtReview === 0 ? "未审核" : formatTime(item.gmtReview).toString(),
        }));
        tableData.value = table.value;
      } else {
        alert(response.data.msg || "加载失败");
      }
    })
    .catch((error) => {
      alert("加载错误");
      console.log("加载错误", error);
    });
};

// 获取项目详情的函数
function getDetail(number) {
  console.log(number);
  router.push(`/admin/project/my/detail/${number}`);
}

// 切换项目列表
const showMode = ref(true);
const showReviewButton = (status) => {
  // 项目处于"已提交"才可以进行审核
  return status === projectStatusContant.STATUS_SUBMIT && !showMode.value;
};

/* 对话框进行操作 */

// ------------------- 查看成员
const centerDialogVisibleMember = ref(false);
const formMember = ref({
  id: null,
});
const getMemberDialog = (id) => {
  formMember.value.id = id; // 项目id
  centerDialogVisibleMember.value = true;
};
const memberData = ref([]);
// 监听对话框的显示状态，当对话框显示时加载数据
watch(centerDialogVisibleMember, (newValue) => {
  if (newValue) {
    getMemberProject();
  }
});
// 查看成员接口
const getMemberProject = async () => {
  projectMembers(formMember.value)
    .then((response) => {
      if (response.data.code === 0) {
        memberData.value = response.data.data.map((item) => ({
          ...item,
          id: BigInt(item.id),
        }));
        alert(response.data.msg || "查看成功");
      } else {
        alert(response.data.msg || "查看失败");
      }
    })
    .catch((error) => {
      console.error("查看发生错误:", error);
      alert("查看发生错误");
    });
};

// ------------------ 审核项目
const centerDialogVisibleReview = ref(false);
const formReview = ref({
  id: null,
  approved: true,
  content: "",
});
const reviewDialog = (id) => {
  formReview.value.id = BigInt(id); // 项目id
  formReview.value.approved = true;
  centerDialogVisibleReview.value = true;
};
// 审核项目接口
const reviewProject = async () => {
  console.log(formReview.value);
  projectReview(formReview.value)
    .then((response) => {
      if (response.data.code === 0) {
        // currentPage.value = 1;
        fetchProjects();
        alert(response.data.msg || "审核成功");
      } else {
        alert(response.data.msg || "审核失败");
      }
    })
    .catch((error) => {
      console.error("审核发生错误:", error);
      alert("审核发生错误");
    })
    .finally(() => {
      centerDialogVisibleReview.value = false;
      formReview.value.id = null;
      formReview.value.approved = true;
      formReview.value.content = "";
    });
};

// 单选按钮的值数组
const option = ref(["同意", "拒绝"]);
// 监听选中值的变化
// 选中的值
const selectedOption = ref(option.value[0]);

// 监听选中值的变化
watch(selectedOption, () => {
  if (selectedOption.value === "同意") {
    formReview.value.approved = true;
  } else {
    formReview.value.approved = false;
  }
});
</script>

<template>
  <!-- 项目管理 - 项目申报 -->
  <div class="container">
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
      <el-button @click="fetchProjects">已通过的项目</el-button>
      <el-button @click="getUnapprovedProjects">未通过的项目</el-button>
    </div>
    <!-- 展示申报的项目 -->
    <div class="container-show">
      <!-- 申报项目展示-->
      <div class="container-show-content">
        <el-table :data="tableData" style="width: 100%; margin-bottom: 50px">
          <el-table-column
            fixed
            prop="title"
            label="标题"
            min-width="120"
            max-width="220"
            show-overflow-tooltip
          />
          <el-table-column
            prop="leaderName"
            label="负责人"
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
                  <div>用户名: {{ scope.row.leaderName }}</div>
                  <div>邮箱: {{ scope.row.leaderEmail }}</div>
                </template>
                <template #reference>
                  <el-tag effect="plain" type="success">{{
                    scope.row.leaderName
                  }}</el-tag>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="项目状态"
            min-width="100"
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
            v-if="showMode.value"
            prop="budget"
            label="项目预算"
            min-width="100"
            max-width="180"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="!showMode"
            label="提交时间"
            min-width="110"
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
            min-width="110"
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
            label="审核内容"
            min-width="100"
            max-width="220"
            show-overflow-tooltip
          />
          <el-table-column prop="gmtConclude" label="结项时间" min-width="150" max-width="250" v-if="showMode.value">
            <template #default="scope">
              <el-popover
                effect="light"
                trigger="hover"
                placement="top"
                width="auto"
                min-width="110"
                max-width="200"
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
            v-if="showMode.value"
            prop="taskNum"
            label="任务数"
            min-width="100"
            max-widt="200"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="showMode.value"
            prop="memberNum"
            label="成员数"
            min-width="100"
            max-widt="200"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="showMode.value"
            prop="achieveNum"
            label="成果数"
            min-width="100"
            max-widt="200"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="showMode.value"
            prop="fundNum"
            label="总花费"
            min-width="100"
            max-widt="200"
            show-overflow-tooltip
          />
          <el-table-column
            fixed="right"
            label="操作"
            min-width="150"
            max-width="200"
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
                @click="getMemberDialog(scope.row.id)"
                >管理成员</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                v-if="showReviewButton(scope.row.status)"
                @click="reviewDialog(scope.row.id)"
                >审核</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-pagination
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          :total="total"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
        /> -->
      </div>
    </div>

    <!-- 管理成员 -->
    <el-dialog
      v-model="centerDialogVisibleMember"
      title="项目成员"
      min-width="850"
      max-width="1200"
      align-center
    >
      <div>
        <el-table :data="memberData" stripe style="width: 100%">
          <el-table-column
            prop="email"
            label="用户邮箱"
            min-width="120"
            max-width="240"
            show-overflow-tooltip
          />
          <el-table-column
            prop="name"
            label="用户名"
            min-width="100"
            max-width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="phone"
            label="用户手机号"
            min-width="100"
            max-width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="qq"
            label="QQ"
            min-width="100"
            max-width="180"
          />
          <el-table-column
            prop="qq"
            label="微信号"
            min-width="100"
            max-width="180"
          />
          <el-table-column
            prop="institution"
            label="所属机构"
            min-width="100"
            max-width="180"
          />
        </el-table>
      </div>
    </el-dialog>

    <!-- 审核项目 -->
    <el-dialog
      v-model="centerDialogVisibleReview"
      title="审核项目"
      width="600"
      align-center
    >
      <div style="display: flex; flex-direction: column">
        <div style="display: flex; flex-direction: row; margin-bottom: 30px">
          <label for="" style="margin-right: 40px">审核意见</label>
          <div>
            <label v-for="(value, index) in option" :key="index">
              <input type="radio" :value="value" v-model="selectedOption" />
              {{ value }}
            </label>
          </div>
        </div>
        <div style="display: flex; flex-direction: row">
          <label for="" style="margin-right: 40px; width: 60px">审核内容</label>
          <el-input
            type="textarea"
            style="width: 450px"
            :rows="4"
            placeholder="请输入审核内容"
            v-model="formReview.content"
          ></el-input>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisibleReview = false">取消</el-button>
          <el-button type="primary" @click="reviewProject">确定</el-button>
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
  color: #3937a3;
}

.container-show-button {
  height: 60px;
  border-bottom: 2px solid #f0e9e9;
}

.container-show-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.el-table-column {
  width: 20%;
}
/* 媒体查询：当屏幕宽度小于 768px 时 */
@media screen and (max-width: 768px) {
  .el-table {
    width: 100%; /* 让表格宽度自适应 */
  }
}
</style>