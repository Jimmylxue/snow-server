import { TUser } from '../type';
import { getFilterAvatarList, getFilterNameList, randomListOne } from './utils';

export function formatUserInfo(socketId: string, userList: TUser[]): TUser {
  const filterNameList = getFilterNameList(userList);
  const filterAvatarList = getFilterAvatarList(userList);
  return {
    socketId,
    name: randomListOne(filterNameList),
    avatar: randomListOne(filterAvatarList).source,
  };
}
