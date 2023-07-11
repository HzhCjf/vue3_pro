import requst from '@/utils/request'

enum URLS {
    ATTR_INFO_LIST='/product/attrInfoList'
}

// 属性
export interface attrInfoListType{
    // 属性id
    id:number,
    // 属性名
    attrName:string,
    // 属性所属类别id
    categoryId:number,
    // 类别等级
    categoryLevel:number,
    // 属性值的数组
    attrValueList:attrValue[]
}

// 属性值
export interface attrValue{
    // 属性值id
    id:number,
    // 属性值的名称
    valueName:string,
    // 所在属性id
    attrId:number
}

export function reqAttrInfoList(category1Id:number,category2Id:number,category3Id:number){
    return requst.get<any,attrInfoListType[]>(`${URLS.ATTR_INFO_LIST}/${category1Id}/${category2Id}/${category3Id}`)
}