import { Socket } from 'socket.io';
import { TUser, TUserV2 } from '../type';
import { getFilterAvatarList, getFilterNameList, randomListOne } from './utils';

/**
 * 获取所需的用户信息
 */
export function formatUserInfo(socketId: string, userList: TUser[]): TUser {
  const filterNameList = getFilterNameList(userList);
  const filterAvatarList = getFilterAvatarList(userList);
  return {
    socketId,
    name: randomListOne(filterNameList),
    avatar: randomListOne(filterAvatarList).source,
  };
}

/**
 *
 */
export function formatUserInfoV2(socket: Socket): TUserV2 {
  const socketId = socket.id;
  // @ts-ignore
  const user = socket.user;
  return {
    socketId,
    name: user.username,
    avatar: user.avatar,
    userId: user.userId,
  };
}

export function getSocketIdByUserId(userId: number, userList: TUserV2[]) {
  return userList.find((user) => user.userId === userId)?.socketId;
}
