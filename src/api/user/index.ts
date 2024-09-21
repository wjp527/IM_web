import request from '../../utils/request'
import { userLoginType } from './type'

enum API {
  // 登录
  LOGIN = '/login',
  // 获取用户信息
  GET_USER_INFO = '/user',
}

// 登录
export const reqLogin = (data: userLoginType) => {
  return request.post(API.LOGIN, data)
}

// 获取用户信息
export const reqGetUserInfo = () => {
  return request.get(API.GET_USER_INFO)
}


