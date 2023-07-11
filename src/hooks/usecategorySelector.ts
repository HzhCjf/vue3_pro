
// 把数据和id和请求函数都返回出去
export default function usecategorySelector() {
    return {
        category1,
        category2,
        category3,

        category1Id,
        category2Id,
        category3Id,

        getCategory1,
        getCategory2,
        getCategory3
    }
}
import { ref } from 'vue'
import type { category1Type, category2Type, category3Type } from '@/api/category'
import { reqCategory1, reqCategory2, reqCategory3 } from '@/api/category'

// 创建分类列表的数据
const category1 = ref<category1Type[]>([])
const category2 = ref<category2Type[]>([])
const category3 = ref<category3Type[]>([])

// 分类列表的id
const category1Id = ref('')
const category2Id = ref('')
const category3Id = ref('')

// 分类列表1的请求数据函数
async function getCategory1() {
    try {
        category1.value = await reqCategory1()
    } catch (e) {

    }

}
// 分类列表2的请求数据函数
async function getCategory2() {
    try {
        category2Id.value = category3Id.value = ''
        category2.value = []
        category3.value = []
        category2.value = await reqCategory2(Number(category1Id.value))
    } catch (e) {

    }

}
// 分类列表3的请求数据函数
async function getCategory3() {
    try {
        category3Id.value = ''
        category3.value = []
        category3.value = await reqCategory3(Number(category2Id.value))
    } catch (e) {

    }

}