<template>
  <div class="userlist">

    <div class="userlist-left">
      <el-scrollbar>
        <div class="left-list" v-for="(item,index) in friendList" :class="{'left-list-bg' : active == item.id}" @click="startCall(item)" :key="index">
          <img :src="item.image" class="left-list-img">
          <span class="left-list-title">{{item.username}}</span>
        </div>
      </el-scrollbar>
    </div>

    <div class="userlist-right">
      <router-view></router-view>
    </div>
  </div>


</template>

<script lang="ts" setup>
import { onMounted,reactive,ref } from 'vue'
import { useRouter } from 'vue-router'
import useFriendStore from '../../store/friend'
import { ElMessage } from 'element-plus';
const friendStore = useFriendStore()
// import {getlist} from "../../api/friend";

let list = reactive({arr:[{
  id: 0,
  username: '0'
},
{
  id: 1,
  username: '1'
}]});
const active = ref('');
const router = useRouter();

const startCall = (e: any)=>{
  active.value = e.id  // 赋值 为了css
  router.push({ path:'/list/chat',query:{uid:e.id}})
}


let friendList = ref([]) as any
const init = async () => {
  let res = await friendStore.getFriendListAsync()
  if(res == 200) {
    friendList.value = friendStore.friendList
  } else {
    ElMessage.warning('获取好友列表失败')
  }
}
onMounted(()=>{
  init()
})

</script>

<style scoped>
.userlist{
  display: flex;
  height: 100%;
  width: 100%;
}
.userlist-left{
  padding-top: 20px;
  padding-left: 10px;
  flex: 1;
  border-right: #dbd6d6 1px solid;
}
.userlist-right{
  flex: 4;
}


.left-list{
  display: grid;
  grid-template-columns: repeat(2,1fr);
  grid-template-rows:repeat(2,1fr);
  grid-template-areas: 'a b'
                       'a b';
  justify-items: center;
  align-items:center;
  margin-top: 10px;
}
.left-list-bg{
  display: grid;
  grid-template-columns: repeat(2,1fr);
  grid-template-rows:repeat(2,1fr);
  grid-template-areas: 'a b'
  'a b';
  justify-items: center;
  align-items:center;
  margin-top: 10px;

  background-color: #eaeaea;
}
.left-list-img{
  width: 50px;
  height: 50px;
  border-radius: 5px;
  grid-area:a
}
.left-list-title{
  grid-area:b
}

</style>
