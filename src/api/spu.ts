import requst from '@/utils/request'
import type { Page } from './page'

enum URLS {
    GET_SPU_LIST='/product'
}


export interface spuListType{
    id:number,
    spuName:string,
    description:string,
    category3Id:number,
    tmId:number
}

export function reqSPUList(category3Id:number,page=1,limit=5){
    return requst.get<any,Page<spuListType[]>>(`${URLS.GET_SPU_LIST}/${page}/${limit}`,{params:{category3Id}})
}
