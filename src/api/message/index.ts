import request from '../../utils/request'

enum API {
  // 获取消息列表  /messages/list?to=4
  GET_MESSAGE_LIST = '/messages/list?to=',
}

// 获取消息列表
export function getMessageList(to: number | string
) {
  return request.get(API.GET_MESSAGE_LIST + to)
}