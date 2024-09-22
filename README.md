# 聊天室 demo

使用的技术: webRtc,websocket 实时通讯

```vue
<script lang="ts" setup>
// WebSocket
import useWebSocketStore from '../../store/websocket/index'
const webSocketStore = useWebSocketStore()
import socket from '../../utils/websocket'

// 发送消息
let sendMsg = ref({
  to_id: 0,
  content: '',
  type: 1, // 1 文字 2 图片 3 视频
})

// 登录WebSocket
const loginWebSocket = () => {
  Promise.resolve()
    .then(() => {
      socket.init()
    })
    .then(() => {
      socket.send({
        uid: userStore.userInfo.id, // 发送者用户id
        to_id: sendMsg.value.to_id, // 接收者用户id
        content: sendMsg.value.content, // 消息内容
        type: sendMsg.value.type, // 消息类型
      })
    })
}

const send = async () => {
  sendMsg.value.to_id = parseInt(uid.value)
  sendMsg.value.content = text.value
  let res = await messageStore.sendMessageAsync(sendMsg.value)
  if (res == 200) {
    socket.send({
      from_id: userStore.userInfo.id, // 发送者用户id
      to_id: sendMsg.value.to_id, // 接收者用户id
      content: sendMsg.value.content, // 消息内容
      type: 2, // 消息类型
    })
    // 刷新页面
    getlist()
    // 清空表单
    text.value = ''
  } else {
    ElMessage.error(res.msg)
  }
}

// 实时接受消息
webSocketStore.$subscribe((mutation, state) => {
  let msg = JSON.parse(state.msg)
  if (msg.type == 2) {
    getlist()
  }
})

onMounted(() => {
  getUid()

  // 登录WebSocket
  loginWebSocket()
  scrollToBottom()
})
</script>
```

`实现自动滚动到底部`

```vue
<el-scrollbar ref="scrollbarRef" @scroll="scroll">
      <div class="chat-list" v-for="(item, index) in messageList" :key="index">
        <div :class="[item.from_id != uid ? 'chat-list-right' : 'chat-list-left']">
          <img :src="item.from_id != uid ? item.from_image : item.from_image" class="list-img" />
          <div :class="item.from_id != uid ? 'right-msg' : 'left-msg'">{{ item.content }}</div>
        </div>
      </div>
  </el-scrollbar>

<script lang="ts" setup>
const scrollbarRef = ref()
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
// 之后在刚进入页面，发送消息的时候执行，即可实现自动滚动到底部
</script>
```
