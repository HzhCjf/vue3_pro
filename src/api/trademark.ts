import requset from '@/utils/request'

enum URLS{
    LIST='/product/baseTrademark',
    DELETEITEM='product/baseTrademark/remove',
    ADD='/product/baseTrademark/save'
}

// 品牌的数据类型
export interface trademarkDataType{
    id:number,
    tmName:string,
    logoUrl:string
}

// 请求到的数据类型
export interface trademarkListType{
    records:trademarkDataType[],
    total:number,
    size:number,
    current:number,
    pages:number
}

// 添加品牌类型
export interface addTrademarkItemType{
    tmName:string,
    logoUrl:string
}

// 1.请求品牌列表
export const reqTrademarkList = (page:number,limit:number)=>{
    return requset.get<any,trademarkListType>(`${URLS.LIST}/${page}/${limit}`)
}

// 2.请求删除品牌
export const reqDeleteTrademarkItem = (id:string)=>{
    return requset.delete<any,null>(`${URLS.DELETEITEM}/${id}`)
}

// 3.请求添加品牌
export const reqAddTrademarkItem = (data:addTrademarkItemType)=>{
    return requset.post<any,null>(URLS.ADD,data)
}