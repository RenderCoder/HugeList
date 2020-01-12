const dataPiece = `mage_2.png
COMBO,COMBO_76,2,2,Image_23.png
COMBO,COMBO_77,70,1,Image_17.png
COMBO,COMBO_78,67,1,Imag`

// 分割为数组
const splitData = (dataString) => {
    return dataString.split("\n")
}

// 提取有效数据行
// 并增加 id
const getValidDataRow = (dataArray, startIndex = 0) => {
    // 字符串偏移
    let stringIndex = startIndex

    // 计算有效数据
    const data = dataArray
        // 转换格式
        .map(dataItem => {
            // 切分 cell
            const cells = dataItem.split(',')
            const [categoryName, productName, price, quantity, imageFile] = cells
            // 定义行数据格式
            const cellData = { categoryName, productName, price, quantity, imageFile }
            // 增加合法标记（是否为完整的数据行）
            cellData.valid = cells.length === 5 && /\.png$/ig.test(imageFile)
            // 增加行号标记，当前数据中无索引字段，从 productName 中提取
            const key = (productName || '').match(/[0-9]+$/)
            if (key !== null) {
                cellData.key = Number(key[0])
            }
            // 标记行数据字符串起始位置（在整个数据文件中）
            const dataItemStringLength = dataItem.length
            cellData.position = {
                start: stringIndex,
                length: dataItemStringLength,
            }
            // 标记下一条数据的起始值
            stringIndex = stringIndex + dataItemStringLength

            // 返回数据
            return cellData
        })
        // 过滤有效行
        .filter(dataItem => dataItem.valid)

    // 计算有效内容起始位置
    let validDataStartIndex = null
    let nextPointerPosition = null
    if (data.length > 0) {
        const lastValidDataItem = data[data.length - 1]
        if (lastValidDataItem) {
            nextPointerPosition = lastValidDataItem.position.start + lastValidDataItem.position.length
        }
        
        validDataStartIndex = data[0].position.start
    }


    const result = {
        data,
        nextPointerPosition, // 下一条数据的起始位置
        validDataStartIndex, // 当前有效数据起始位置
    }
    return result
}

const convertData = (dataPiece, startIndex) => {
    let result = splitData(dataPiece)
    // console.log(result)

    result = getValidDataRow(result, startIndex)
    // console.log(result)
    return result
}

// convertData(dataPiece, 101)

export default convertData