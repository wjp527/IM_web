import request from '../../utils/request'

enum API {
  // 获取好友列表
  FRIEND_LIST = '/friend/list',
  // 搜索好友
  SEARCH_FRIEND = '/friend/search?username=',
  // 添加好友
  ADD_FRIEND = '/friend/add?tid=',
  // 好友申请列表 
  FRIEND_APPLY_LIST = '/friend/apply',
  // 同意好友申请
  AGREE_FRIEND_APPLY = '/friend/agree',
  // 拒绝好友申请 = '/friend/reject'
  REJECT_FRIEND_APPLY = '/friend/refuse'
}
// 获取好友列表
export function getFriendList() {
  return request.get(API.FRIEND_LIST)
}

// 搜索好友
export function searchFriend(username: string) {
  return request.get(API.SEARCH_FRIEND + username)
}
// 添加好友
export function addFriend(friendId: number | string) {
  return request.post(API.ADD_FRIEND + friendId)
}

// 好友申请列表
export function getFriendApplyList() {
  return request.get(API.FRIEND_APPLY_LIST)
}

// 同意好友申请
export function agreeFriendApply(applyId: number | string) {
  return request.post(API.AGREE_FRIEND_APPLY, {
    fid: applyId
  })
}
// 拒绝好友申请
export function rejectFriendApply(applyId: number | string) {
  return request.post(API.REJECT_FRIEND_APPLY, {
    id: applyId
  })
} 