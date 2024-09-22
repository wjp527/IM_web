<template>
  <div class="home">
    <h3>{{ uid }}</h3>
    <el-scrollbar ref="scrollbarRef" @scroll="scroll">
      <div class="chat-list" v-for="(item, index) in messageList" :key="index">
        <div :class="[item.from_id != uid ? 'chat-list-right' : 'chat-list-left']">
          <img :src="item.from_id != uid ? item.from_image : item.from_image" class="list-img" />
          <div :class="item.from_id != uid ? 'right-msg' : 'left-msg'">{{ item.content }}</div>
        </div>
      </div>
    </el-scrollbar>

    <div class="chat-boom">
      <el-input class="textarea" type="textarea" :rows="7" placeholder="Please input" v-model="text" />
      <el-button type="primary">视频通话</el-button>
      <el-button type="primary" @click="send">发送</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch,nextTick } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import useMessageStore from '../../store/message'
import { ElMessage } from 'element-plus'
const messageStore = useMessageStore()
import useUserStore from '../../store/user'
const userStore = useUserStore()
// WebSocket
import useWebSocketStore from '../../store/websocket/index'
const webSocketStore = useWebSocketStore()
import socket from '../../utils/websocket'

// 实现自动滚动到底部
const scrollbarRef = ref()

let route = useRoute() 
let uid = ref('') as any

// 聊天内容
const text = ref('') as any
// 滚动
const scroll = () => {}

onBeforeRouteUpdate(to => {
  uid.value = route.query.uid
})

const getUid = () => {
  uid.value = route.query.uid
  getlist()
}

const messageList = ref([]) as any
const getlist = async () => {
  let res: any = await messageStore.getMessageListAsync(uid.value)

  if (res == 200) {
    messageList.value = messageStore.messageList
     // 自动滚动到最底部
     scrollToBottom()

  } else {
    ElMessage.error('获取失败')
  }
}

watch(route, (newValue, oldValue) => {
  uid.value = newValue.query.uid
  getlist()
})

// 发送消息
let sendMsg = ref({
  to_id: 0,
  content: '',
  type: 1, // 1 文字 2 图片 3 视频
})
const send = async () => {
  sendMsg.value.to_id = parseInt(uid.value)
  sendMsg.value.content = text.value
  let res = await messageStore.sendMessageAsync(sendMsg.value)
  if (res == 200) {
    socket.send({
      from_id: userStore.userInfo.id,
      to_id: sendMsg.value.to_id,
      content: sendMsg.value.content,
      type: 2,
    })
    // 刷新页面
    getlist()
    // 清空表单
    text.value = ''
  } else {
    ElMessage.error(res.msg)
  }
}

// 登录WebSocket
const loginWebSocket = () => {
  Promise.resolve()
    .then(() => {
      socket.init()
    })
    .then(() => {
      socket.send({
        uid: userStore.userInfo.id, 
        to_id: sendMsg.value.to_id,
        content: sendMsg.value.content,
        type: sendMsg.value.type,
      })
    })
}

webSocketStore.$subscribe((mutation, state) => {
  let msg = JSON.parse(state.msg)
  if (msg.type == 2) {
    getlist()
  }
})

// 自动滚动到底部的方法
const scrollToBottom = () => {
  nextTick(() => {
    const scrollbar = scrollbarRef.value // 获取到 el-scrollbar 的 DOM 实例
    if (scrollbar) {
      scrollbar.scrollTo({
        top: scrollbar.wrapRef.scrollHeight,
        behavior: 'smooth', // 使用平滑滚动
      })
    }
  })
}
onMounted(() => {
  getUid()

  // 登录WebSocket
  loginWebSocket()
  scrollToBottom()
})
</script>

<style scoped>
.chat {
  background: rgb(247, 247, 247);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.chat-boom {
  display: flex;
  justify-content: space-between;
  align-items: end;
}
.list-img {
  width: 40px;
  height: 40px;
  border-radius: 5px;
}
.chat-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.chat-list-left {
  padding: 20px;
  display: flex;
  flex-direction: row;
}
.chat-list-right {
  padding: 20px;
  display: flex;
  flex-direction: row-reverse;
}
.left-msg {
  margin-left: 5px;
  background-color: #ffffff;
  font-size: 15px;
  border-radius: 6px;
  max-width: 200px;
  word-wrap: break-word;
}
.right-msg {
  margin-right: 7px;
  background-color: #ffffff;
  font-size: 15px;
  border-radius: 6px;
  max-width: 200px;
  word-wrap: break-word;
}

.el-scrollbar {
      height: 325px !important;
      overflow: hidden !important;
    }
</style>
