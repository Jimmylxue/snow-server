import { TUser } from '../type';
import { avatarList, nameList } from './const';

export function getRandomIndex(listCount: number) {
  return Math.floor(Math.random() * listCount);
}

export function randomListOne<T>(list: T[]): T {
  const randomIndex = getRandomIndex(list.length);
  return list[randomIndex];
}

export function getFilterNameList(userList: TUser[]) {
  const filterNameList = nameList.filter(
    (name) => !userList.find((item) => item.name === name),
  );

  return filterNameList.length ? filterNameList : nameList;
}

export function getFilterAvatarList(userList: TUser[]) {
  const filterAvatarList = avatarList.filter(
    (avatar) => !userList.find((item) => item.avatar === avatar.source),
  );

  return filterAvatarList.length ? filterAvatarList : avatarList;
}
