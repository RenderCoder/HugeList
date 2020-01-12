/**
 * 拷贝 csv 文件到 document 目录
 */
import RNFS from 'react-native-fs';

export async function copyFile(skipCopyIfExists: boolean = true) {
  const filePath = `${RNFS.DocumentDirectoryPath}/data.csv`;

  // check if file exists, skip copy
  const fileExists = await RNFS.exists(filePath);
  if (fileExists && skipCopyIfExists) {
    console.log(
      `file has been exists, do not need to copy. skip. (${filePath}`,
    );
    return {error: null, skip: true};
  }

  console.log(`start copy file to ${filePath}`);
  const startTime = new Date().getTime();
  try {
    await RNFS.copyFileAssets('data.csv', filePath);
    const costTime = new Date().getTime() - startTime;
    return {error: null, costTime};
  } catch (error) {
    return {error};
  }
}
