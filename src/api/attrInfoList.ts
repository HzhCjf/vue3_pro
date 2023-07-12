import requst from '@/utils/request'

enum URLS {
    ATTR_INFO_LIST='/product/attrInfoList',
    ADDATTRINFO='/product/saveAttrInfo'
}

// 请求属性类型
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

// 请求属性值类型
export interface attrValue{
    // 属性值id
    id:number,
    // 属性值的名称
    valueName:string,
    // 所在属性id
    attrId:number
}


// 添加属性的类型
export type addAttrInfoType = Omit<attrInfoListType,'id'|'attrValueList'> & {
    attrValueList:Pick<attrValue,'valueName'>[]
}

// 请求属性
export function reqAttrInfoList(category1Id:number,category2Id:number,category3Id:number){
    return requst.get<any,attrInfoListType[]>(`${URLS.ATTR_INFO_LIST}/${category1Id}/${category2Id}/${category3Id}`)
}

// 请求添加属性
export function reqAddAttrInfo(data:addAttrInfoType){
    return requst.post<any,addAttrInfoType>(URLS.ADDATTRINFO,data)
}