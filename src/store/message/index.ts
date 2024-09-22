import { defineStore } from "pinia"

import {
  // 获取聊天数据列表
  getMessageList,
  // 发送消息
  sendMessage
} from "../../api/message"

// 类型
// import { ListMessageType, Datum } from './type'
import { SendMessageType } from '../../api/message/type'

const useMessageStore = defineStore("message", {
  state: () => ({
    // 聊天数据列表
    messageList: []
  }),

  actions: {
    // 获取聊天数据列表
    async getMessageListAsync(to: number | string) {
      const res: any = await getMessageList(to)
      if (res.code == 200) {
        this.messageList = res.data

        return 200
      } else {
        return res.msg
      }
    },
    // 发送消息
    async sendMessageAsync(data: SendMessageType) {
      const res: any = await sendMessage(data)
      if (res.code == 200) {
        return 200
      } else {
        return res.msg
      }
    }

  }
})

export default useMessageStore