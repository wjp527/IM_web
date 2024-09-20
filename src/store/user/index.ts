import { defineStore } from 'pinia'


import {
  // 用户登录 
  reqLogin
} from '../../api/user/index.ts'
// 引入 登录 校验类型
import { userLoginType } from '../../api/user/type'

const useUserStore = defineStore('user', {
  state: () => ({

  }),
  actions: {
    // 用户登录
    async getUserLoginAsync(payload: userLoginType) {
      let res: any = await reqLogin(payload)
      if (res.code == 200) {
        return res
      } else {
        return res.msg;
      }
    }
  }
})

export default useUserStore