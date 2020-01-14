/**
 * 目标数据收集器
 */

import {loadPiece, setReadLength} from './loadPiece';
setReadLength(500);

let dataArray: Cell[] = []; // 存储的数据数组（队列）
let maxLength = 100; // 存储的数据数组（队列）的最大长度
let dataObject: {[key: number]: Cell} = {}; // 存储的数据数组（队列）的对象表达

export const startKey = (): number => {
  if (dataArray.length === 0) {
    return 0;
  }
  return dataArray[0].key || 0;
};

export const endKey = (): number => {
  if (dataArray.length === 0) {
    return 0;
  }
  return dataArray[dataArray.length - 1].key || 0;
};

// 追加尾部数组
const addTail = (newDataArray: Cell[]) => {
  if (dataArray.length > 0) {
    if ((newDataArray[0].key || 0) > endKey() + 1) {
      dataArray = [...newDataArray];
    } else {
      dataArray = dataArray.concat(newDataArray);
    }
  } else {
    dataArray = [...newDataArray];
  }
  // 清理多余数组
  if (dataArray.length > maxLength) {
    dataArray.splice(0, dataArray.length - maxLength);
  }
  // console.log('@addTail', dataArray);
  updateDataObject();
};

// 追加头部数组
const addHead = (newDataArray: Cell[]) => {
  if (dataArray.length > 0) {
    if ((newDataArray[newDataArray.length - 1].key || 0) + 1 < startKey()) {
      dataArray = [...newDataArray];
    } else {
      dataArray = newDataArray.concat(dataArray);
    }
  } else {
    dataArray = [...newDataArray];
  }

  // 清理多余数组
  if (dataArray.length > maxLength) {
    dataArray.splice(
      dataArray.length - 1 - maxLength,
      dataArray.length - maxLength,
    );
  }
  // console.log('@addHead', dataArray);
  updateDataObject();
};

// 更新数据字典（在每次更新数据数组后调用）
const updateDataObject = () => {
  const targetDataObject: {[key: number]: Cell} = {};
  for (let i = 0, len = dataArray.length; i < len; i++) {
    const dataItem: Cell = dataArray[i];
    if (typeof dataItem.key === 'undefined') {
      return;
    }
    targetDataObject[dataItem.key] = dataItem;
  }
  dataObject = targetDataObject;
  // console.log('updateDataObject done.');
};

export let working = false;

export const collect = (
  targetKey: number,
  direction: number = 1,
  callback = (success: boolean) => {},
) => {
  if (working) {
    // console.warn('collect() working... return');
    return;
  }
  // console.log(
  //   `collect(${targetKey}, ${direction}, callback) startKey: ${startKey()} endKey: ${endKey()}`,
  // );
  working = true;

  // 判断已有的存储列表内是否包含
  if (startKey() <= targetKey && targetKey <= endKey()) {
    working = false;
    callback(true);
    return;
  }

  // 判断方向
  if (targetKey > endKey()) {
    direction = 1;
  }
  if (targetKey < startKey()) {
    direction = -1;
  }

  // 未包含，从头开始读取
  loadPiece(direction, res => {
    if (direction > 0) {
      addTail(res);
    } else {
      addHead(res);
    }

    if (startKey() <= targetKey && targetKey <= endKey()) {
      working = false;
      callback(true);
      return;
    }
    if (direction > 0 && targetKey < startKey()) {
      working = false;
      callback(false);
      return;
    }

    if (direction < 0 && targetKey > endKey()) {
      working = false;
      callback(false);
      return;
    }

    working = false;
    collect(targetKey, direction, callback);
  });
};

// addTail([1,2,3])
// addTail([4,5,6])
// addHead([-1,-2,-3])

export default collect;

// 获取存储的数据数组
export const getData = (): Cell[] => {
  return dataArray;
};

// 获取存储的数据对象
export const getDataObject = () => {
  return dataObject;
};
