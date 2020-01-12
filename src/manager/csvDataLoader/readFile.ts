/**
 * 读取文件到内存
 */

import RNFS from 'react-native-fs';

export async function readFile() {
    const filePath = `${RNFS.DocumentDirectoryPath}/data.csv`;

    return await RNFS.readFile(filePath, 'utf8')
}