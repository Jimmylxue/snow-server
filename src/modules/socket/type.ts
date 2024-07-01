export type TUser = {
  socketId: string;
  name: string;
  avatar: string;
  userId?: number;
};

export enum MESSAGE_TYPE {
  '登录消息',
  '登出消息',
  '系统消息',
  '个人消息',
}

export type TMessage = {
  type: MESSAGE_TYPE;
  text: string;
  createTime: string;
  memberInfo?: TUser;
  userList?: TUser[];
};

export type TSendSomeOneMessage = {
  type: MESSAGE_TYPE.个人消息;
  text: string;
  toSocketId: string;
  fromSocketId: string;
  createTime: string;
};
