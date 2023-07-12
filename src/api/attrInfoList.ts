import requst from '@/utils/request'
import type { type } from 'os'

enum URLS {
    ATTR_INFO_LIST='/product/attrInfoList',
    ADDATTRINFO='/product/saveAttrInfo',
    DELETE_ATTR = `/product/deleteAttr`
}

// 请求属性列表类型
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

// 为属性值里面添加一个isEdit,用来展示和设置的切换
export type addAttrValueEditType = Pick<attrValue,'valueName'> & {
    isEdit?:boolean
}

// 添加属性的类型
export type addAttrInfoType = Omit<attrInfoListType,'id'|'attrValueList'> & {
    id?:number
    attrValueList:addAttrValueEditType[]
}

// 请求属性列表
export function reqAttrInfoList(category1Id:number,category2Id:number,category3Id:number){
    return requst.get<any,attrInfoListType[]>(`${URLS.ATTR_INFO_LIST}/${category1Id}/${category2Id}/${category3Id}`)
}

// 请求添加保存属性
export function reqAddAttrInfo(data:addAttrInfoType){
    return requst.post<any,null>(URLS.ADDATTRINFO,data)
}

// 请求删除属性
export function reqDeleteAttr(id:number){
    return requst.delete<any,null>(`${URLS.DELETE_ATTR}/${id}`)
}