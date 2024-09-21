import { defineStore } from 'pinia'


import {
  // 用户登录 
  reqLogin,
  // 获取用户信息
  reqGetUserInfo
} from '../../api/user/index.ts'
// 引入 登录 校验类型
import { userLoginType } from '../../api/user/type'

const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: {}
  }),
  actions: {
    // 用户登录
    async getUserLoginAsync(payload: userLoginType) {
      let res: any = await reqLogin(payload)
      if (res.code == 200) {
        this.token = res.data
        return res
      } else {
        return res.msg;
      }
    },
    // 获取用户信息
    async getUserInfoAsync() {
      let res: any = await reqGetUserInfo()
      if (res.code == 200) {
        this.userInfo = res.data
        return res
      } else {
        return res.msg;
      }
    }
  }
})

export default useUserStore