<template>
  <div class="cent">
    <div class="cent-top"><el-input v-model="query.username" /><el-button @click="getUserTop">搜索</el-button></div>

    <div class="userlist-left">
      <el-scrollbar height="200px">
        <div class="left-list" v-for="(item) in userTop">
          <img :src="item.image" class="left-list-img">
          <span class="left-list-title">{{ item.username }}</span>
          <el-button lass="left-list-bu" @click="add(item.id)">添加</el-button>
        </div>
      </el-scrollbar>
    </div>

    <el-divider />

    <div class="userlist-left">
      <el-scrollbar height="300px">
        <div class="left-list" v-for="(item) in agreeList">
          <img :src="item.user.image" class="left-list-img">
          <span class="left-list-title">{{ item.user.username }}</span>
          <div lass="left-list-bu">
            <el-button @click="accept(item.user.id,item.id)">接受</el-button>
            <el-button @click="resolve(item.id)">拒绝</el-button>
          </div>
        </div>
      </el-scrollbar>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
// import {getUserByUserName} from "../../api/user";
// import {addApply,getfriends,agree} from "../../api/apply";
import { ElMessage } from 'element-plus'
import useFriendStore from '../../store/friend';
const FriendStore = useFriendStore();
// import socket from "../../utils/websocket";

// 搜索好友名称
let query = reactive({
  username: ""
}) as any;

// 搜索好友列表
let userTop = ref([]) as any
// 好友申请列表
let agreeList = ref([]) as any


// 发送申请
const add = async (e: number | string) => {
  let res = await FriendStore.addFriendAsync(e)
  if (res == 200) {
    ElMessage.success('申请已发送')
    init()
  } else {
    ElMessage.warning(res.msg)
  }
}

// 同意
const accept = async (e: string | number, resolveId: string | number) => {
  let res = await FriendStore.agreeFriendApplyAsync(e)
  if (res == 200) {
    ElMessage.success('已同意')
    // 然后删除对应的好友申请
    let res2 = await FriendStore.rejectFriendApplyAsync(resolveId)
    if (res2 == 200) { 
      init()
    } else {
      ElMessage.warning(res2.msg)
    }
  } else {
    ElMessage.warning(res.msg)
  }
}
// 拒绝
const resolve = async (e: string | number) => {
  let res = await FriendStore.rejectFriendApplyAsync(e)
  if (res == 200) {
    ElMessage.success('已拒绝')
    init()
  } else {
    ElMessage.warning(res.msg)
  }
}

// 获取基本数据
const getUserTop = async () => {
  userTop.value = []

  agreeList.value = []
  let res = await FriendStore.searchFriendAsync(query.username)
  if (res == 200) {
    userTop.value = FriendStore.searchFriend

  } else {
    ElMessage.warning(res)
  }

}

const init = async () => {
  let res = await FriendStore.getFriendApplyListAsync()
  if (res == 200) {
    agreeList.value = FriendStore.applyList
    console.log(agreeList.value, 'agreeList.value ')

  } else {
    ElMessage.warning(res)
  }
}
onMounted(() => {
  init()
})
</script>

<style scoped>
.cent {

  padding: 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.cent-top {
  display: flex;
}

.userlist-left {
  display: flex;
  flex-direction: column;
}



.left-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-template-areas: 'a b c'
    'a b c';
  justify-items: center;
  align-items: center;
  margin-top: 10px;
}

.left-list-img {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  grid-area: a
}

.left-list-title {
  grid-area: b
}
</style>
