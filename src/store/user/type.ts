export interface UserStateType {
  token: string;
  userInfo: UserActionTypes;
}

export interface UserActionTypes {
  id?: number | string;
  to_id?: number | string;
  content?: string,
  type?: number | string,
}