import React, {ReactElement, useState, useEffect} from 'react';
import {
  FlatList,
  TouchableOpacity,
  Text,
  ImageBackground,
  ImageSourcePropType,
  View,
  StyleSheet,
} from 'react-native';
import {
  copyFile,
  collect,
  getData,
  getDataObject,
  getDataCount,
} from '../../../manager/csvDataLoader';
import ImageAssetsForMaterial from '../assets/material';

type Props = {
  data: String[];
};

const __CONSTANT__ = {
  CellHeight: 220,
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

  const getIndexForNumber = (targetNumber: number) => {
    if (viewableItems[targetNumber]) {
      return viewableItems[targetNumber].index || 0;
    }
    return 0;
  };

  __collectActionTimeoutId = setTimeout(() => {
    __collectActionTimeoutId = null;
    const startIndex = getIndexForNumber(0) * 2;
    const endIndex = getIndexForNumber(viewableItems.length - 1) * 2 + 1;
    collect(startIndex, 1, (success: boolean) => {
      collect(endIndex, 1, refreshList);
    });
  }, 100);
};

const useDidMount = (callback: () => void) => {
  useEffect(callback, []);
};

export default function component(props: Props) {
  const [refreshFlag, setRefreshFlag] = useState(new Date().getTime());
  const [listData, setListData] = useState<number[]>(new Array(0).fill(0));

  useDidMount(() => {
    refreshList = refresh;
    copyFile(false).then(() => {
      getDataCount().then((dataCount: number) => {
        setListData(new Array(dataCount >> 1).fill(0));
        refresh();
      });
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
    const cardIndex = {
      left: index * 2,
      right: index * 2 + 1,
    };

    const generateCard = (index: number) => {
      const data: Cell | undefined = allData[index];
      const imageSource: ImageSourcePropType = data
        ? ImageAssetsForMaterial[data.imageFile]
        : [];
      const {productName, categoryName, price} = data || {
        productName: '...',
        categoryName: '',
        price: '',
      };
      return (
        <View style={style.cellContainer}>
          <View style={style.cell}>
            <ImageBackground source={imageSource} style={style.cellImage}>
              <Text>{data ? '' : 'Loading'}</Text>
            </ImageBackground>
            <View style={style.cellDescriptionContainer}>
              <Text>{productName}</Text>
              <Text>{categoryName}</Text>
              <Text>$ {Number(price).toFixed(2)}</Text>
            </View>
          </View>
        </View>
      );
    };
    return (
      <View style={style.rowContainer}>
        {generateCard(cardIndex.left)}
        {generateCard(cardIndex.right)}
      </View>
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
      length: __CONSTANT__.CellHeight,
      offset: index * __CONSTANT__.CellHeight,
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

const style = StyleSheet.create({
  list: {
    flex: 1,
  },
  cellContainer: {
    height: __CONSTANT__.CellHeight,
    padding: 12,
    width: '50%',
  },
  cell: {
    padding: 0,
    // borderWidth: 0,
    // borderTopColor: 'rgba(0,0,0,0.1)',
    // borderTopWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#e6e9ef',
  },
  cellDescriptionContainer: {
    padding: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  cellImage: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
