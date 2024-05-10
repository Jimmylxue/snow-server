import { avatarList, nameList } from '../const';
import {
  getFilterAvatarList,
  getFilterNameList,
  getRandomIndex,
  randomListOne,
} from '../utils';

describe('>>> getRandomIndex', () => {
  it('index should return 0 when listCount is 0', () => {
    expect(getRandomIndex(0)).toBe(0);
  });

  it('index is smaller than 8 when listCount is 8', () => {
    expect(getRandomIndex(8) < 8).toBeTruthy();
  });
});

describe('>>> randomListOne', () => {
  const arr = ['jimmy', 'xuexue', 'jack'];
  it('function return is include arr when list is arr', () => {
    expect(arr.includes(randomListOne(arr))).toBeTruthy();
  });
});

describe('>>> getFilterNameList', () => {
  it('function should return full nameList when userList length is 0', () => {
    expect(getFilterNameList([])).toEqual(nameList);
  });

  it('filterNameList does not include 丑到无可挑剔 when userList include 丑到无可挑剔', () => {
    expect(
      getFilterNameList([
        {
          name: '丑到无可挑剔',
        },
      ] as any),
    ).toEqual(nameList.filter((item) => item !== '丑到无可挑剔'));
  });

  it('function should return full nameList when userList is full list', () => {
    const fullList = nameList.map((item) => ({
      name: item,
    }));
    expect(getFilterNameList(fullList as any)).toEqual(nameList);
  });
});

describe('>>> getAvatarList', () => {
  it('function should return full avatarList when userList length is 0', () => {
    expect(getFilterAvatarList([])).toEqual(avatarList);
  });

  it('filterNameList does not include https://img1.baidu.com/it/u=4050463138,1499422748&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1673974800&t=db34835adc90ef962e8848d96deb5683 when userList include https://img1.baidu.com/it/u=4050463138,1499422748&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1673974800&t=db34835adc90ef962e8848d96deb5683', () => {
    expect(
      getFilterAvatarList([
        {
          avatar:
            'https://img1.baidu.com/it/u=4050463138,1499422748&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1673974800&t=db34835adc90ef962e8848d96deb5683',
        },
      ] as any),
    ).toEqual(
      avatarList.filter(
        (item) =>
          item.source !==
          'https://img1.baidu.com/it/u=4050463138,1499422748&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1673974800&t=db34835adc90ef962e8848d96deb5683',
      ),
    );
  });

  it('function should return full avatarList when avatarList is full list', () => {
    const fullList = avatarList.map((item) => ({
      avatar: item.source,
    }));
    expect(getFilterAvatarList(fullList as any)).toEqual(avatarList);
  });
});
