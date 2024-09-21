// getFriendList

import { defineStore } from "pinia"

import {
  getFriendList,
  // 搜索好友
  searchFriend,
  // 添加好友
  addFriend,
  // 好友申请列表
  getFriendApplyList,
  // 同意好友申请
  agreeFriendApply,
  // 拒绝好友申请
  rejectFriendApply
} from "../../api/friend"

const useFriendStore = defineStore("friend", {
  state: () => ({
    // 好友列表
    friendList: [],
    // 搜索好友
    searchFriend: [],
    // 好友申请
    applyList: []
  }),

  actions: {
    // 获取好友列表
    async getFriendListAsync() {
      const res: any = await getFriendList()

      if (res.code == 200) {
        this.friendList = res.data
        return '200'
      } else {
        return res.msg
      }
    },

    // 搜索好友
    async searchFriendAsync(keyword: string) {
      const res: any = await searchFriend(keyword)
      if (res.code == 200) {
        this.searchFriend = res.data
        return 200
      } else {
        return res.msg
      }
    },
    // 添加好友
    async addFriendAsync(friendId: number | string) {
      const res: any = await addFriend(friendId)
      if (res.code == 200) {
        return 200
      } else {
        return res.msg
      }
    },
    // 好友申请列表
    async getFriendApplyListAsync() {
      const res: any = await getFriendApplyList()
      if (res.code == 200) {
        this.applyList = res.data
        return 200
      } else {
        return res.msg
      }
    },
    // 同意好友申请
    async agreeFriendApplyAsync(applyId: number | string) {
      let res: any = await agreeFriendApply(applyId)
      if (res.code == 200) {
        return 200
      } else {
        return res.msg
      }
    },
    // 拒绝好友申请
    async rejectFriendApplyAsync(applyId: number | string) {
      let res: any = await rejectFriendApply(applyId)
      if (res.code == 200) {
        return 200
      } else {
        return res.msg
      }
    }
  }
})

export default useFriendStore