import request from '@/utils/request'

export interface addSaveSkuInfo{
    // 所属spu的id
    spuId:number,
    // 品牌id
    tmId:number,
    // 分类id
    category3Id:number,
    // sku名称
    skuName:string,
    // 价格
    price:number,
    // 重量
    weight:number,
    //sku规格描述
    skuDesc:string,
    // sku默认图片
    skuDefaultImg:string,
    // sku图片列表
    skuImageList:skuImageListType[],
    // 平台属性
    skuAttrValueList:skuAttrValueListType[],
    // 销售属性
    skuSaleAttrValueList:skuSaleAttrValueListType[]
}
// 平台属性
export interface skuImageListType{
    // 图片id
    id:number,
    // spu的id
    spuId:number,
    imgName:string,
    imgUrl:string,
    isDefault:boolean
}
// 销售属性
export interface skuAttrValueListType{
    // 平台属性id
    attrId:number,
    // 平台属性值id
    valueId:number
}

export interface skuSaleAttrValueListType{
    // 销售属性id
    saleAttrId:number,
    // 销售属性值id
    saleAttrValueId:number
}