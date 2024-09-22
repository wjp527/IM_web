<template>
  {{ uid }}{{ tid }}
  <el-button v-if="isaccept" @click="accept">接受</el-button>
  <pre>{{ v1 }}</pre>
  =-=
  <video ref="v1" autoplay playsinline style="width: 300px; height: 300px"></video>
  -=
  <video ref="v2" autoplay playsinline style="width: 300px; height: 300px"></video>
  <pre>{{ v2 }}</pre>
  ++
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useWebsocketStore from '../../store/websocket/index.ts'
import socket from '../../utils/websocket.ts'
import useUserStore from '../../store/user/index.ts'
const userStore = useUserStore()
const web = useWebsocketStore()
let route = useRoute()
const v1 = ref()
const v2 = ref()
const pc = ref(null)
const mystrea = ref()
// const uid = localStorage.getItem("im-userid");
// const tid = route.query.from;
const uid = ref()
const tid = ref()
const isaccept = ref(false)

const accept = () => {
  socket.send({ uid: uid.value, to_id: tid.value, type: 4 })
}

const loginWebsocket = () => {
  Promise.resolve()
    .then(() => {
      socket.init()
    })
    .then(() => {
      //  uid.value = localStorage.getItem("im-userid")
      if (route.query.type == 1) {
        uid.value = userStore.userInfo.id
        tid.value = route.query.from_id
      } else {
        uid.value = userStore.userInfo.id
        tid.value = route.query.from_id
        isaccept.value = true
      }
      socket.send({ uid: uid.value, type: 1 })
    })
    .then(() => {
      if (route.query.type == 1) {
        socket.send({ uid: uid.value, to_id: tid.value, type: 3 })
      }
    })
}

web.$subscribe((mutations, state) => {
  let msg = JSON.parse(state.msg)
  console.log(pc.value, 'pc.value')
  switch (msg.type) {
    case 4:
      sxt().then(res => {
        socket.send({ uid: uid.value, to_id: tid.value, type: 5 })
      })
      break
    case 5:
      sxt().then(res => {
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
      console.log(msg.message)
      pc.value.setRemoteDescription(new RTCSessionDescription(msg.message))
      doAnswer()
      break
    case 7:
      pc.value.setRemoteDescription(new RTCSessionDescription(msg.message))
      break
    case 8:
      console.log('aaa')
      var candidate = new RTCIceCandidate({
        sdpMLineIndex: msg.message.sdpMLineIndex,
        candidate: msg.message.candidate,
      })
      pc.value.addIceCandidate(candidate)

      break
  }
})

const handleCreateOfferError = () => {
  console.log('aa')
}

const createOfferAndSendMessage = sessionDescription => {
  pc.value.setLocalDescription(sessionDescription)
  socket.send({ uid: uid.value, to_id: tid.value, type: 6, message: sessionDescription })
}

const doAnswer = () => {
  if (pc.value == null) {
    createPeerConnection()
  }
  pc.value.createAnswer().then(createAnswerAndSendMessage, handleCreateAnswerError)
}

const handleCreateAnswerError = () => {
  console.log('bbb')
}

const createAnswerAndSendMessage = sessionDescription => {
  pc.value.setLocalDescription(sessionDescription)
  socket.send({ uid: uid.value, to_id: tid.value, type: 7, message: sessionDescription })
  // ws.value.send(JSON.stringify({type:"4",uid:uid.value,to_id:rid.value,message:sessionDescription}))
}

const createPeerConnection = () => {
  try {
    pc.value = new RTCPeerConnection()
    pc.value.onicecandidate = handleIceCandidate
    pc.value.ontrack = handleRemoteStreamAdded

    // 添加本地流到 peer connection
    if (mystrea.value) {
      for (const track of mystrea.value.getTracks()) {
        pc.value.addTrack(track, mystrea.value)
      }
    } else {
      console.error('本地流未初始化')
    }
  } catch (error) {
    console.error('PeerConnection 初始化失败: ', error)
  }
}

const handleRemoteStreamAdded = event => {
  console.log('远程流添加: ', event.stream);  // 打印流信息，确保接收到远程流
  v2.value.srcObject = event.stream;  // 将远程流绑定到 v2 标签
}

const handleIceCandidate = event => {
  if (event.candidate) {
    socket.send({ uid: uid.value, to_id: tid.value, type: 8, message: event.candidate })
  }
}

//开启摄像头
const sxt = () => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then(function (stream) {
        mystrea.value = stream
        v1.value.srcObject = stream // 本地视频流

        console.log('本地流: ', mystrea.value)
        console.log('v1 元素: ', v1.value)
      })
      .catch(function (error) {
        console.error('无法访问摄像头或麦克风: ', error)
      })
  })
}

onMounted(() => {
  loginWebsocket()
})
</script>

<style scoped></style>
