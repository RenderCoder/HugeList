import React, {PureComponent, useState, ReactElement} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import ListComponent from './component/list';
import ToolComponent from './component/tool';

export default function page(): ReactElement {
  const listData: String[] = ['hello', 'world', '!!!'];
  return (
    <>
      <Text style={styles.title}>Huge List</Text>
      <ToolComponent />
      <ListComponent data={listData} />
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    padding: 12,
    fontSize: 40,
  },
});
