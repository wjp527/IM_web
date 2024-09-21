<template>
  <div class="home">  
    <h3>{{  uid }}</h3>
    <el-scrollbar  ref="scrollbarRef" @scroll="scroll"> 
      <div class="chat-list" v-for="(item,index) in messageList" :key="index">
        <!-- {{ item.from_id uid }} --> 
                        <div :class="[item.from_id  != uid?'chat-list-right':'chat-list-left']">
                            <img :src="item.from_id != uid? item.from_image : item.from_image" class="list-img">  
                            <div :class="item.from_id  != uid?'right-msg':'left-msg'">{{item.content}}</div>
                        </div>
                        </div>
      <!-- <div class="chat-list-left">
               <img src="https://cdn.uviewui.com/uview/album/2.jpg" class="list-img">
               <div class="left-msg">啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊</div>
           </div>
           <div class="chat-list-right">
               <img src="https://cdn.uviewui.com/uview/album/2.jpg" class="list-img">
               <div class="right-msg">3123123123eijfewijewifjeiowjfiowejfoweijfeowijeoifjewoijfeiowjfeowijfeiojfewoijeiofjeefjweiojfeoi</div>
           </div> -->

    </el-scrollbar>

    <div class="chat-boom">
            <el-input
                    class="textarea"
                    type="textarea"
                    :rows="7"
                    placeholder="Please input"
                    v-model="text"
            />
            <el-button type="primary"  >视频通话</el-button>
            <el-button type="primary" >发送</el-button>
        </div>
  </div>
</template>

<script lang="ts" setup>
import { ref , onMounted, watch} from 'vue'
import { useRoute,useRouter , onBeforeRouteUpdate} from 'vue-router'
import useMessageStore from '../../store/message';
import { ElMessage } from 'element-plus';
const messageStore = useMessageStore()

let route = useRoute();
let router = useRouter() as any
let uid = ref('') as any

// 聊天内容
const text = ref('') as any
// 滚动
const scroll = () => {

}

onBeforeRouteUpdate((to) => {
  uid.value = route.query.uid
})



const getUid = () => {
  uid.value = route.query.uid
  getlist()
}

const messageList = ref([]) as any
const getlist = async() => {
 
  let res:any = await messageStore.getMessageListAsync(uid.value)

  if(res == 200) {
    messageList.value = messageStore.messageList
    console.log(messageStore.messageList,'messageStore.messageList')
  } else {
    ElMessage.error('获取失败')
  }
}
onMounted(() => {
  getUid()
})

watch(route, (newValue, oldValue) => {
  uid.value = newValue.query.uid
  getlist()  
})

</script>

<style scoped>
  
 .chat{
        background: rgb(247,247,247);
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .chat-boom{
        display: flex;
        justify-content: space-between;
        align-items: end;
    }
    .list-img{
        width: 40px;
        height: 40px;
        border-radius: 5px;
    }
    .chat-list{
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .chat-list-left{
        padding: 20px;
        display: flex;
        flex-direction: row;
    }
    .chat-list-right{
        padding: 20px;
        display: flex;
        flex-direction: row-reverse;
    }
    .left-msg{
        margin-left: 5px;
        background-color: #ffffff;
        font-size: 15px;
        border-radius: 6px;
        max-width: 200px;
        word-wrap:break-word
    }
    .right-msg{
        margin-right: 7px;
        background-color: #ffffff;
        font-size: 15px;
        border-radius: 6px;
        max-width: 200px;
        word-wrap:break-word
    }
</style>
