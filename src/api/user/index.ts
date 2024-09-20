import request from '../../utils/request'
import { userLoginType } from './type'

enum API {
  // 登录
  LOGIN = '/login',
}

// 登录
export const reqLogin = (data: userLoginType) => {
  return request.post(API.LOGIN, data)

}