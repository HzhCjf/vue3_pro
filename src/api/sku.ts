import request from '@/utils/request'
import  type {Page} from './page'

enum URLS  {
    SKU_INFO = '/product/saveSkuInfo',
    SKU_LIST_BY_SPUID='/product/findBySpuId',
    SKU_INFO_LIST='/product/list',
    SKU_TOP='/product/onSale',
    SKU_BOTTOM='/product/cancelSale',
    SKU_BY_ID = '/product/getSkuById',
    DELETE_BY_ID='/product/deleteSku'
}

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
//sku图片列表
export interface skuImageListType{
    // 图片id
    id:number,
    // spu的id
    spuId:number,
    imgName:string,
    imgUrl:string,
    isDefault:boolean
}
// 平台属性
export interface skuAttrValueListType{
    // 平台属性id
    attrId:number,
    // 平台属性值id
    valueId:number
}
// 销售属性
export interface skuSaleAttrValueListType{
    // 销售属性id
    saleAttrId:number,
    // 销售属性值id
    saleAttrValueId:number
}


// sku列表
export interface skuListType{
    /**
     * 所属分类ID
     */
    category3Id: number;
    /**
     * 创建时间
     */
    createTime: string;
    /**
     * SKU的ID
     */
    id: number;
    /**
     * 是否上架
     */
    isSale: number;
    /**
     * 价格
     */
    price: number;
    /**
     * 默认图片
     */
    skuDefaultImg: string;
    /**
     * SKU规格描述
     */
    skuDesc: string;
    /**
     * SKU名称
     */
    skuName: string;
    /**
     * 所属SPU的ID
     */
    spuId: number;
    /**
     * 所属品牌ID
     */
    tmId: number;
    /**
     * 重量
     */
    weight: string;
}

// 获取指定id的类型
export interface skuByIdType extends skuListType{
    skuImageList:skuImageListType[],
    skuAttrValueList:skuAttrValueListType &{
        id:number,
        skuId:number,
        attrName:string,
        valueName:string
    }[],
    skuSaleAttrValueList:skuSaleAttrValueListType &{
        id:number,
        skuId:number,
        spuId:number,
        saleAttrName:string,
        saleAttrValueName:string
    }[]
}

// 添加sku
export function reqSaveSkuInfo(data:addSaveSkuInfo){
    return request.post(URLS.SKU_INFO,data)
}

// 请求指定spu下的sku列表
export function reqSkuList(spuId:number){
    return request.get<any,skuListType[]>(URLS.SKU_LIST_BY_SPUID + '/' + spuId)
}

// 获取所有sku列表
export function reqSkuInfoList(page=1,limit=5){
    return request.get<any,Page<skuListType[]>>(`${URLS.SKU_INFO_LIST}/${page}/${limit}`)
}

// 上架
export function reqTopSale(id:number){
    return request.get<any,null>(`${URLS.SKU_TOP}/${id}`)
}
// 下架
export function reqBottomSale(id:number){
    return request.get<any,null>(`${URLS.SKU_BOTTOM}/${id}`)
}

// 请求指定id的sku
export function reqSkuById(skuId:number){
    return request.get<any,skuByIdType>(`${URLS.SKU_BY_ID}/${skuId}`)
}

// 删除指定的sku
export function reqDeleteSku(skuId:number){
    return request.delete<any,null>(`${URLS.DELETE_BY_ID}/${skuId}`)
}