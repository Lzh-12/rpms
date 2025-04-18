<script setup>
import { ref, onMounted } from "vue";
import { projectMy } from "@/api/project/index.js";
import { achieveCreate } from "@/api/achieve/index.js";
import { ElMessage } from "element-plus";

// 提示框
const centerDialogVisible = ref(false);

// 项目编号
const options = ref([]);

// 从后端获取选项数据
const fetchOptions = async () => {
  projectMy()
    .then((response) => {
      if (response.data.code === 0) {
        // 获取所有已立项的项目的id
        options.value = response.data.data
          .filter((item) => item.status === 2)
          .map((item) => ({
            ...item,
            id: BigInt(item.id).toString()
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

// 加载成果类型
const optionTypes = ref([]);
// 加载后端数据
onMounted(() => {
  fetchOptions();
  optionTypes.value = JSON.parse(localStorage.getItem("achieveTypes"));
});

// 创建成果申请模型
const form = ref({
  id: null,
  title: "",
  content: "",
  type: null,
});
const handleSubmit = () => {
  if(!form.value.id ||!form.value.title ||!form.value.type ||!form.value.content){
    ElMessage.warning("请填写完整信息");
    return;
  }
  centerDialogVisible.value = true;
};
// 创建成果申请接口
const onSubmit = async () => {
  form.value.id = BigInt(form.value.id);
  achieveCreate(form.value)
    .then((response) => {
      if (response.data.code === 0) {
        ElMessage.success(response.data.msg || "创建成功");
      } else {
        ElMessage.error(response.data.msg || "创建失败");
      }
    })
    .catch((error) => {
      ElMessage.error("创建错误");
      console.log("创建错误", error);
    })
    .finally(() => {
      form.value.id = null;
      form.value.title = "";
      form.value.content = "";
      form.value.type = null;
      centerDialogVisible.value = false;
    });
};

// 取消提交
const onCancel = () => {
  centerDialogVisible.value = false;
  form.value.id = null;
  form.value.title = "";
  form.value.content = "";
  form.value.type = null;
};

const rules = {
      id: [
        { required: true, message: '请选择项目', trigger: 'change' }
      ],
      title: [
        { required: true, message: '请输入成果标题', trigger: 'blur' },
        { min: 3, message: '成果标题长度不能少于3个字符', trigger: 'blur' }
      ],
      type: [
        { required: true, message: '请选择成果类型', trigger: 'change' }
      ],
      content: [
        { required: true, message: '请输入成果内容', trigger: 'blur' }
      ]
    }
</script>

<template>
  <div class="container">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="auto" style="width: 60%">
      <el-form-item label="项目标题" prop="id">
        <el-select v-model="form.id" placeholder="请选择项目">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="成果标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入成果标题" />
      </el-form-item>
      <el-form-item label="成果类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择类型">
          <el-option
            v-for="item in optionTypes"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="成果内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          placeholder="请输入成果内容"
        />
      </el-form-item>
      <el-form-item class="el-form-button">
        <el-button type="primary" @click="handleSubmit"
          >提交</el-button
        >
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 提示框 -->
  <el-dialog v-model="centerDialogVisible" title="提交成果" width="500" center>
    <span>是否提交成果 {{ form.title }}？</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
  
<style scoped>
.container {
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  padding: 20px;
}

.el-form {
  background-color: #ffffff;
}

.el-form-item {
  margin-bottom: 50px;
}

.el-form-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  padding-left: 40%;
}
</style>