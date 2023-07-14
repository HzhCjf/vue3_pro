import requst from '@/utils/request'
import type { Page } from './page'

enum URLS {
    GET_SPU_LIST='/product',
    ADD_SPU = '/product/saveSpuInfo',
    SALEATTRLIST = '/product/baseSaleAttrList'
}

// spu列表的类型
export interface spuListType{
    id:number,
    spuName:string,
    description:string,
    category3Id:number,
    tmId:number
}

// 添加spu的类型
export interface addSPUType{
    // spu所属分类id
    category3Id:number,
    // spu名称
    spuName:string,
    // spu所属品牌id
    tmId:string,
    // spu简介
    description:string,
    // spu图片列表
    spuImageList:spuImageListType[],
    // spu销售属性列表
    spuSaleAttrList:spuSaleAttrListType[]
}

// 添加spu的图片列表类型
export interface spuImageListType{
    // 图片名称
    imgName:string,
    // 图片地址
    imgUrl:string,
}

// 添加spu的销售属性列表
export interface spuSaleAttrListType{
    // 基础销售属性id(不是由自己写的,是从后端请求来的)
    baseSaleAttrId:number,
    // 基础销售属性名称(不是由自己写的,是从后端请求来的)
    saleAttrName:string,
    // spu销售属性值列表
    spuSaleAttrValueList:spuSaleAttrValueListType[]
}

// 添加spu的销售属性值的列表
export interface spuSaleAttrValueListType{
    // 所在的销售属性id
    baseSaleAttrId:string,
    // 所在的销售属性名
    saleAttrName:string,
    // 销售属性值
    saleAttrValueName:string
}

// 获取基础属性列表
export interface saleAttrListType{
    id:number,
    name:string
}

// 请求spu列表
export function reqSPUList(category3Id:number,page=1,limit=5){
    return requst.get<any,Page<spuListType[]>>(`${URLS.GET_SPU_LIST}/${page}/${limit}`,{params:{category3Id}})
}

// 添加spu
export function reqSPUInfoType(data:addSPUType){
    return requst.post<any,null>(URLS.ADD_SPU,data)
}

// 获取基础销售属性列表
export function reqSaleAttrList(){
    return requst.get<any,saleAttrListType[]>(URLS.SALEATTRLIST)
}
