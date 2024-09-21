import { defineStore } from "pinia"

import {
  // 获取聊天数据列表
  getMessageList
} from "../../api/message"

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
        console.log(this.messageList)
        return 200
      } else {
        return res.msg
      }
    }

  }
})

export default useMessageStore