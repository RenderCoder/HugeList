import React, {ReactElement, useState} from 'react';
import {FlatList, TouchableOpacity, Text} from 'react-native';


type Props = {
    data: String[]
}

export default function component(props: Props) {
  const renderItem = ({item}: {item: String}): ReactElement => {
    return (
      <TouchableOpacity style={style.cell}>
        <Text>{item}</Text>
      </TouchableOpacity>
    );
  };

  const data = props.data;

  return (
    <FlatList
      style={style.list}
      data={data}
      extraData={data}
      renderItem={renderItem}
      keyExtractor={index => index.toString()}
    />
  );
}

const style = {
  list: {
    flex: 1,
  },
  cell: {
    padding: 12,
    borderWidth: 0,
    borderTopColor: 'rgba(0,0,0,0.1)',
    borderTopWidth: 1,
  },
};
