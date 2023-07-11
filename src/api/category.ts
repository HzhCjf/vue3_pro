import requset from '@/utils/request'

// 请求的路径
enum URLS{
    CATEGORY1= '/product/getCategory1',
    CATEGORY2= '/product/getCategory2',
    CATEGORY3= '/product/getCategory3',
}

// 分类列表1类型
export interface category1Type{
    id:number,
    name:string
}

// 分类列表2类型
export interface category2Type extends category1Type{
    category1Id:number
}   

// 分类列表3类型
export interface category3Type extends category1Type{
    category2Id:number
}   

// 请求分类列表1
export const reqCategory1 = ()=>{
    return requset.get<any,category1Type[]>(URLS.CATEGORY1)
}
// 请求分类列表2
export const reqCategory2 = (category1Id:number)=>{
    return requset.get<any,category2Type[]>(`${URLS.CATEGORY2}/${category1Id}`)
}// 请求分类列表3
export const reqCategory3 = (category2Id:number)=>{
    return requset.get<any,category3Type[]>(`${URLS.CATEGORY3}/${category2Id}`)
}