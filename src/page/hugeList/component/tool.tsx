import React, {ReactElement} from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {copyFile, readFile, loadPiece} from '../../../manager/csvDataLoader';

export default function component() {
  const buttons: ReactElement[] = [];
  const $generateButton = (title: String, onPress: () => void): void => {
    const button = (
      <TouchableOpacity
        onPress={onPress}
        style={styles.button}
        key={buttons.length.toString()}>
        <Text>{title}</Text>
      </TouchableOpacity>
    );
    buttons.push(button);
  };

  $generateButton('拷贝文件', async () => {
    const result = await copyFile(false);
    console.log(`拷贝文件结果`, result);
  });

  $generateButton('直接读取文件', async () => {
    console.log(`直接读取文件 - 开始`);
    const startTime = new Date().getTime();
    try {
      const result = await readFile();
      const costTime = new Date().getTime() - startTime;
      console.log('读取文件成功', result, costTime);
    } catch (error) {
      console.log('读取文件失败', error);
    }
  });

  $generateButton('读取 Next', async () => {
    loadPiece(1, res => {
      console.log(res.map(item => item.key));
    });
  });

  $generateButton('读取 Previous', async () => {
    loadPiece(-1, res => {
      console.log(res.map(item => item.key));
    });
  });

  return <View style={styles.container}>{buttons}</View>;
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  button: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
  },
});
