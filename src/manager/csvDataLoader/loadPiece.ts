/**
 * 分块读取文件内容
 */

import RNFS from 'react-native-fs';
import dataConverter from './dataConventer';

let fileContentReadLength: number = 100 * 5;
let __fileContentReadLength: number = fileContentReadLength;

const pointer = {
  current: 0,
  next: 0,
  previous: 0,
};

// direction
// 1: 向后
// -1: 向前
const readFile = (direction = 1, callback = (res: any) => {}) => {
  // 判断指针位置
  let targetPointer = pointer.current;
  if (direction > 0) {
    // next
    targetPointer = pointer.next;
  } else if (direction < 0) {
    // prevoius
    targetPointer = pointer.previous;
  } else {
    // current
    targetPointer = pointer.current;
  }

  // 判断读取长度
  if (targetPointer === 0 && direction < 0) {
    fileContentReadLength = pointer.current;
  } else {
    fileContentReadLength = __fileContentReadLength;
  }

  console.log('targetPointer', targetPointer, fileContentReadLength);

  RNFS.read(
    `${RNFS.DocumentDirectoryPath}/data.csv`,
    fileContentReadLength,
    targetPointer,
    'utf8',
  ).then(res => {
    // console.log('@readFile() res', res)
    if (res.length === 0) {
      callback([]);
      return;
    }
    const {data, nextPointerPosition, validDataStartIndex} = dataConverter(
      res,
      targetPointer,
    );
    // console.log('@rows', JSON.stringify(data, null, '\t'));

    // 更新指针
    // current
    pointer.current = targetPointer || 0;
    // next
    pointer.next = nextPointerPosition || 0;
    // previous
    const endPosition = validDataStartIndex;
    pointer.previous =
      endPosition - fileContentReadLength > 0
        ? endPosition - fileContentReadLength
        : 0;
    if (!pointer.previous) {
      pointer.previous = 0;
    }
    /*
    console.log(
      nextPointerPosition,
      validDataStartIndex,
      JSON.stringify(pointer),
    );
    //*/
    callback(data);
  });
};

export const loadPiece = readFile;
export const setReadLength = (targetLength: number) => {
  __fileContentReadLength = targetLength;
};
