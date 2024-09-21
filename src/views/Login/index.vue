<template>
  <div class="Login">
    <el-card class="card" :body-style="{ padding: '20px' }">
      <h2>视频通话登录</h2>
      <el-form :model="form" ref="formRef" label-width="120px">
        <el-form-item label="账号" prop="username" :rules="usernameRules">
          <el-input v-model="form.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="passwordRules">
          <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">登录</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script lang="ts" setup name="Login">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// 登录接口
import useUserStore from '../../store/user'
const userStore = useUserStore()

import { ElMessage } from 'element-plus'

// 存储token
import { SET_TOKEN } from '../../utils/token'

const router = useRouter()
// Define the form model
const formRef = ref(null) as any;
const form = ref({
  username: 'user1',
  password: '123456'
});

// Define validation rules
const usernameRules = [
  { required: true, message: '请输入账号', trigger: 'blur' }
];

const passwordRules = [
  { required: true, message: '请输入密码', trigger: 'blur' }
];

// Define the submitForm method
const submitForm = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      let res = await userStore.getUserLoginAsync(form.value)
 
      if(res.code == 200) {
        ElMessage.success('登录成功')
        router.push('/list')
        SET_TOKEN(res.data) 
        
      } else {
        ElMessage.error('登录失败')
      }
    
    } else { 
      return false;
    }
  });
};

// Define the resetForm method
const resetForm = () => {
  formRef.value.resetFields();
};

</script>

<style lang="less" scoped>
.Login {
  // width: 500px;
  width: 100vw;
height: 100vh;
display: flex;
    align-items: center;
    justify-content: center;

  .card {
    border-radius: 10px;
  }
 
}
</style>