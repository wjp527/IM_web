<template>
  <div class="home">
    <h3>{{ uid }}</h3>
    <el-button v-show="isAccept" type="primary" @click="handleAccept">接受</el-button>
    <video ref="v1" autoplay playsinline style="width: 300px; height: 300px"></video>
    <video ref="v2" autoplay playsinline style="width: 300px; height: 300px"></video>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'

// WebSocket
import useWebSocketStore from '../../store/websocket/index'
const webSocketStore = useWebSocketStore()
import socket from '../../utils/websocket'

let route = useRoute()

let uid = ref('') // 当前用户
let tid = ref('') // 对方用户

let payloadType: any = ref(0) // 接受页面传来的参数
let isAccept = ref(false) // 是否接受了视频通话请求

let mystrea: any = ref('') // 本地流
let pc = ref()
let v1 = ref('') as any
let v2 = ref('') as any

payloadType.value = route.query.type // 获取参数
// 登录WebSocket
const loginWebSocket = () => {
  Promise.resolve()
    .then(() => {
      socket.init()
    })
    .then(() => {
      console.log(payloadType.value, '==')
      if (payloadType.value == 1) {
        // 主动发送一个请求视频通话消息
        uid.value = '1'
        tid.value = '4'
      } else {
        uid.value = '4'
        tid.value = '1'
        isAccept.value = true
      }
    })
    .then(() => {
      // 主动发送一个请求视频通话消息
      if (payloadType.value == 1) {
        socket.send({
          uid: uid.value,
          to_id: tid.value,
          type: 3,
        })
      }
    })
}

// 接受
const handleAccept = () => {
  socket.send({
    uid: uid.value,
    to_id: tid.value,
    type: 4,
  })
}


const web = webSocketStore
web.$subscribe((mutation, state) => {
  let msg = JSON.parse(state.msg)
  switch (msg.type) {
    case 4: // 接受视频通话请求
      sxt().then(() => {
        socket.send({
          uid: uid.value,
          to_id: tid.value,
          type: 5,
        })
      })
      break
    case 5:
      sxt().then(() => {
        if (pc.value == null) {
          createPeerConnection()
        }
        pc.value.createOffer(createOfferAndSendMessage, handleCreateOfferError)
      })
      break
    case 6:
      if (pc.value == null) {
        createPeerConnection()
      }
      pc.value.setRemoteDescription(new RTCSessionDescription(msg.message))
      doAnswer()
      break
    case 7:
      pc.value.setRemoteDescription(new RTCSessionDescription(msg.message))

      break

    case 8:
      var candidate = new RTCIceCandidate({
        sdpMLineIndex: msg.message.sdpMLineIndex,
        candidate: msg.message.candidate,
      })
      pc.value.addIceCandidate(candidate)
      break
  }
})

const doAnswer = () => {
  if (pc.value == null) {
    createPeerConnection()
  }
  pc.value.createAnswer().then(createAnswerAndSendMessage, handleCreateAnswerError)
}

const createAnswerAndSendMessage = (sessionDescription: any) => {
  pc.value.setLocalDescription(sessionDescription)
  socket.send({
    uid: uid.value,
    to_id: tid.value,
    type: 7,
    message: sessionDescription,
  })
}

const handleCreateAnswerError = () => {
  console.log('handleCreateAnswerError错误')
}

const createOfferAndSendMessage = (sessionDescription: any) => {
  pc.value.setLocalDescription(sessionDescription)
  socket.send({
    uid: uid.value,
    to_id: tid.value,
    type: 6,
    message: sessionDescription,
  })
}
const handleCreateOfferError = () => {
  console.log('handleCreateOfferError失败')
}
// 开启摄像头
const sxt = () => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then(function (value) {
        mystrea.value = value
        v1.value.srcObject = value // 自己的流
        console.log(v1.value)
      })
      .then(() => resolve())
      .catch(() => reject())
  })
}

let createPeerConnection = () => {
  pc.value = new RTCPeerConnection(null)
  pc.value.onicecandidate = handleIceCandidate
  pc.value.onaddstream = handleRemoteStreamAdded
  for (const trac of mystrea.value.getTracks()) {
    pc.value.addTrack(trac, mystrea.value)
  }
}

const handleIceCandidate = (event: any) => {
  if (event.candidate) {
    socket.send({
      uid: uid.value,
      to_id: tid.value,
      type: 8,
      message: event.candidate,
    })
  }
}

const handleRemoteStreamAdded = event => {
  v2.value.srcObject = event.stream
}


onMounted(() => {
  // 登录WebSocket
  loginWebSocket()
})
watch(route, (newValue, oldValue) => {
  // uid.value = newValue.query.uid
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
</style>
