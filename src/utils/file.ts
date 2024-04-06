import { writeFile, access, mkdir } from 'fs';

export function writeAFile(file, destinationPath) {
  return new Promise((resolve, reject) => {
    writeFile(destinationPath, file.buffer, (err) => {
      if (err) {
        reject(err.message);
      }
      console.log('写入成功', file);
      resolve(true);
    });
  });
}

export function hasDir(path: string) {
  return new Promise((resolve) => {
    access(path, (err) => {
      if (err) {
        console.log('路径不存在');
        resolve(false);
      }
      resolve(true);
    });
  });
}

export function mkADir(path) {
  return new Promise((resolve) => {
    mkdir(path, (err) => {
      if (err) {
        console.log('创建目录失败');
        resolve(false);
      }
      resolve(true);
    });
  });
}
