import request from '../../utils/request'
// 类型
import { SendMessageType } from './type'
enum API {
  // 获取消息列表  /messages/list?to=4
  GET_MESSAGE_LIST = '/messages/list?to=',
  // 发送消息 /messages/send
  SEND_MESSAGE = '/messages/send'
}

// 获取消息列表
export function getMessageList(to: number | string
) {
  return request.get(API.GET_MESSAGE_LIST + to)
}

// 发送消息
export function sendMessage(data: SendMessageType) {
  return request.post(API.SEND_MESSAGE, data)
} 