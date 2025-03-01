<script setup>
import { ref, onMounted, watch } from "vue";
import router from "@/router";
import { projectMy, projectMembers } from "@/api/project/index.js";
import { useRoute } from "vue-router";
import { Search } from "@element-plus/icons-vue";
import { projectStatusMap } from "@/constants/statusConstants.js";
import { convertTimestamp, formatTime } from "@/utils/timeConverter.js";

// 用户id
const route = useRoute();
const temp = route.query.loginId;
const loginId = BigInt(temp);
console.log("loginId:", loginId);

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
      if (response.data.code === 0) {
        console.log(response.data);
        table.value = response.data.data.map((item) => ({
          ...item,
          id: BigInt(item.id).toString(),
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
        tableData.value = table.value; // 显示在页面的数据
      } else {
        alert(response.data.msg || "加载失败");
      }
    })
    .catch((error) => {
      console.error("获取项目数据失败:", error);
    });
};

// 加载后端的数据
onMounted(() => {
  fetchProjects();
});

// 获取项目详情的函数
function getDetail(number) {
  console.log(number);
  router.push(`/member/project/my/detail/${number}`);
}

// ------------------- 查看成员
const centerDialogVisibleMember = ref(false);
const formMember = ref({
  id: null,
});
const getMemberDialog = (id) => {
  formMember.value.id = BigInt(id); // 项目id
  centerDialogVisibleMember.value = true;
};
const memberData = ref([]); // 成员列表
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
      <el-button type="primary" :icon="Search" @click="searchProjects()"
        >查询</el-button
      >
      <el-button @click="fetchProjects">全部</el-button>
    </div>

    <!-- 展示申报的项目 -->
    <div class="container-show">
      <!-- 申报项目展示-->
      <div class="container-show-content">
        <el-table :data="tableData" style="margin-bottom: 60px">
          <el-table-column
            fixed
            prop="title"
            label="项目标题"
            class-name="title"
            show-overflow-tooltip
          />
          <el-table-column
            prop="leaderName"
            label="项目负责人"
            class-name="status"
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
          <el-table-column prop="status" label="项目状态" class-name="status">
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
            label="项目创建时间"
            class-name="time"
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
            label="项目修改时间"
            class-name="time"
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
            label="项目审核时间"
            class-name="time"
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
            label="项目结项时间"
            class-name="time"
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
            label="Operations"
            class-name="operation"
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
                >查看成员</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 管理成员 -->
    <el-dialog
      v-model="centerDialogVisibleMember"
      title="项目成员"
      width="700"
      align-center
    >
      <div>
        <el-table :data="memberData" stripe style="width: 100%">
          <el-table-column fixed prop="id" label="用户id" width="150" />
          <el-table-column prop="email" label="用户邮箱" width="120" />
          <el-table-column prop="name" label="用户名" width="100" />
          <el-table-column prop="phone" label="用户手机号" width="100" />
          <el-table-column fixed="right" label="操作" width="100">
            <template #default> </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <div class="dialog-footer"></div>
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
  justify-content: center;
}

.el-table {
  width: 100%;
}

.el-table-column {
  width: 15%;
}

/* 表格的宽度 */
.title {
  width: 150px;
}

.status {
  width: 130px;
}

.time {
  width: 150px;
}

.operation {
  width: 150px;
}

/* 媒体查询：当屏幕宽度大于 1500px 时 */
@media screen and (min-width: 1500px) {
  .title {
    width: 180px;
  }

  .status {
    width: 180px;
  }

  .time {
    width: 220px;
  }

  .operation {
    width: 200px;
  }
}
</style>