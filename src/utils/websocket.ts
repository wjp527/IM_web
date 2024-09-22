// WebSocket封装
// WebSocket
import useWebSocketStore from '../store/websocket'
const webSocketStore = useWebSocketStore()

// 连接websocket
let url = 'ws://127.0.0.1:8004/ws'

// 定义socket接口
interface socket {
  websocket: any
  init: () => any
  send: (e: any) => void
}

const socket: socket = {
  // 定义websocket对象
  websocket: null,
  // 初始化websocket
  init: () => {
    // 1、连接websocket
    socket.websocket = new WebSocket(url)
    // 2、接受消息
    socket.websocket.onmessage = (e: any) => {
      let data = JSON.parse(e.data)
      console.log('websocket接收到消息', data)
      if (data == 3) {
        // 视频通话
      } else {
        const web = webSocketStore
        web.msg = e.data
      }
      // console.log('websocket接收到消息', e)
    },
      // 3、关闭
      socket.websocket.onclose = (e: any) => {
        console.log('websocket关闭', e)
      }
  },
  // 发送消息
  send: (e: any) => {
    // readyStatus: 0 代表没有链接成功
    if (socket.websocket.readyState == 0) {
      // 延迟发送消息
      setTimeout(() => {
        socket.websocket.send(JSON.stringify(e))
      }, 100)
    } else {
      // 发送消息
      socket.websocket.send(JSON.stringify(e))
    }
  }
}

export default socket