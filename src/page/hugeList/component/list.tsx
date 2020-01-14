import React, {ReactElement, useState, useEffect} from 'react';
import {FlatList, TouchableOpacity, Text} from 'react-native';
import {
  collect,
  getData,
  getDataObject,
  getDataCount,
} from '../../../manager/csvDataLoader';

type Props = {
  data: String[];
};

interface ViewToken {
  item: any;
  key: string;
  index: number | null;
  isViewable: boolean;
  section?: any;
}

let refreshList = () => {};
let __collectActionTimeoutId: number | null = null;
const onViewableItemsChanged = ({
  viewableItems,
  changed,
}: {
  viewableItems: Array<ViewToken>;
  changed: Array<ViewToken>;
}) => {
  if (__collectActionTimeoutId !== null) {
    clearTimeout(__collectActionTimeoutId);
    __collectActionTimeoutId = null;
  }
  __collectActionTimeoutId = setTimeout(() => {
    __collectActionTimeoutId = null;
    collect(viewableItems[0].index || 0, 1, (success: boolean) => {
      collect(
        viewableItems[viewableItems.length - 1].index || 0,
        1,
        refreshList,
      );
    });
  }, 100);
};

const useDidMount = (callback: () => void) => {
  useEffect(callback, []);
};

export default function component(props: Props) {
  const [refreshFlag, setRefreshFlag] = useState(new Date().getTime());
  const [listData, setListData] = useState<number[]>(new Array(0).fill(0));

  // let listData = new Array(1000).fill(0).map((_, index: number) => index);

  useDidMount(() => {
    refreshList = refresh;
    getDataCount().then((dataCount: number) => {
      setListData(new Array(dataCount).fill(0));
      refresh();
    });
  });

  const refresh = () => {
    setRefreshFlag(new Date().getTime());
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: number;
    index: number;
  }): ReactElement => {
    const allData = getDataObject();
    if (!allData[index]) {
      return (
        <TouchableOpacity style={style.cell}>
          <Text>Loading...</Text>
        </TouchableOpacity>
      );
    }

    const data: Cell = allData[index];
    return (
      <TouchableOpacity style={style.cell}>
        <Text>
          {data.categoryName} {data.productName} {data.price}
        </Text>
      </TouchableOpacity>
    );
  };

  const getItemLayout = (
    data: number[] | null,
    index: number,
  ): {
    length: number;
    offset: number;
    index: number;
  } => {
    return {
      length: 100,
      offset: index * 100,
      index: index,
    };
  };

  return (
    <FlatList
      style={style.list}
      data={listData}
      extraData={refreshFlag}
      renderItem={renderItem}
      keyExtractor={(_: number, index: number) => `${index}`}
      getItemLayout={getItemLayout}
      onViewableItemsChanged={onViewableItemsChanged}
    />
  );
}

const style = {
  list: {
    flex: 1,
  },
  cell: {
    height: 100,
    padding: 12,
    borderWidth: 0,
    borderTopColor: 'rgba(0,0,0,0.1)',
    borderTopWidth: 1,
  },
};
