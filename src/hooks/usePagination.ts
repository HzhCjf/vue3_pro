import { ref } from 'vue'

export default function usePagination(getSPUList: any) {
    const page = ref(1)
    const limit = ref(5)
    const total = ref(0)

    // 当前页改变
    function pageChangeHandler(value: number) {
        page.value = value
        getSPUList()
    }

    // 每页条数改变
    function limitChangeHandler(value: number) {
        limit.value = value
        getSPUList()
    }

    return{
        page,
        limit,
        total,
        pageChangeHandler,
        limitChangeHandler
    }
}