<script setup>
import { ref, onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";
import { projectApproedFund } from "@/api/fund/index.js";
import { projectMy } from "@/api/project/index.js";
import { fundStatusMap } from "@/constants/statusConstants.js";
import { convertTimestamp, formatTime } from "@/utils/timeConverter.js";

// 项目编号
const options = ref([]);
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
        alert(response.data.msg || "加载项目失败");
      }
    })
    .catch((error) => {
      alert("加载项目错误");
      console.log("加载项目错误", error);
    });
};
// 经费类型
const optionTypes = ref([]);
// 创建映射对象，将 type 的整数值映射到对应的 name 字符串
let map = {};
// 加载后端数据
onMounted(() => {
  fetchOptions();
  optionTypes.value = JSON.parse(localStorage.getItem("fundTypes"));
  optionTypes.value.forEach(({ id, name }) => {
    map[id] = name;
  });
});

// 已通过的经费列表的数据模型
const tableData = ref([]);
// 提交数据
const form = ref({
  id: null,
});
// 项目已通过的经费列表的接口
const searchApproved = async () => {
  projectApproedFund(form.value)
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
        alert(response.data.msg || "查询成功");
      } else {
        alert(response.data.msg || "查询失败");
      }
    })
    .catch((error) => {
      alert("查询错误");
      console.log("查询错误", error);
    });
};
</script>

<template>
  <div class="container">
    <div class="container-title">
      <el-form-item label="项目标题">
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
        @click="searchApproved"
        >查询</el-button
      >
    </div>

    <div class="table">
      <el-table :data="tableData">
        <el-table-column
          fixed
          label="经费申请人"
          min-width="120"
          max-width="220"
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
          max-width="260"
          show-overflow-tooltip
        />
        <el-table-column
          prop="figure"
          label="经费金额"
          min-width="100"
          max-width="220"
          show-overflow-tooltip
        />
        <el-table-column prop="status" label="经费状态" width="100">
          <template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="top"
              width="auto"
            >
              <template #default>
                <div>内容: {{ scope.row.figure }}</div>
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
          min-width="130"
          max-widt="220"
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
      </el-table>
    </div>
  </div>
</template>
  
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
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

.el-form-item {
  width: 40%;
  margin-right: 20px;
}

.search {
  margin-bottom: 15px;
}

.table {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #ffffff;
}

.el-table {
  width: 98%;
  padding-bottom: 20px;
}

/* @media screen and (min-width: 1500px) {
  .el-table {
    width: 80%;
  }
} */
</style>