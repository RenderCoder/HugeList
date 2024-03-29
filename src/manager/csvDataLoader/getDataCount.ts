/**
 * 获取 CSV 文件数据数据条目数量
 */
import RNFS from 'react-native-fs';
import dataConverter from './dataConventer';

function log(...args: any) {
    if (__DEV__) {
        console.log(...args)
    }
}

export async function getDataCount(): Promise<number> {
  const filePath = `${RNFS.DocumentDirectoryPath}/data.csv`;
  try {
    const fileStat = await RNFS.stat(filePath);
    log(`读取文件数据结果`, fileStat);
    const fileSize: number = Number(fileStat.size);
    const filePieceContent = await RNFS.read(
      filePath,
      300,
      fileSize - 300,
      'utf8',
    );
    log('file piece content: ', filePieceContent);
    const dataRows: Cell[] = dataConverter(filePieceContent, 0).data;
    let lastRow: Cell | null = null;
    if (dataRows.length > 0) {
      lastRow = dataRows[dataRows.length - 1];
      log('lastRow', lastRow);
      return lastRow.key || 0;
    }
    return 0;
  } catch (error) {
    console.log(`read file stat error`, error);
    return 0;
  }
}
