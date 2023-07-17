<template>
  <div>
    <el-button type="primary" icon="ele-Plus" style="margin: 20px 0;" @click="$emit('addSPUOrSKU', VIEWFORM.SPUFORM)"
      :disabled="!category3Id">添加SPU</el-button>

    <el-table :data="spuList" border stripe size="default" style="margin-bottom: 20px;" v-loading="isSkuLoading">
      <el-table-column type="index" width="100" align="center"></el-table-column>
      <el-table-column label="SPU名称" prop="spuName"></el-table-column>
      <el-table-column label="SPU描述" prop="description"></el-table-column>
      <el-table-column label="操作">
        <template #="{ row }">
          <el-button type="success" icon="ele-Plus" title="添加sku" style="width: 40px;height: 30px;"
            @click="addSPUOrSKU(VIEWFORM.SKUFORM, row)"></el-button>
          <el-button type="warning" icon="ele-Edit" title="修改spu" style="width: 40px;height: 30px;"
            @click="addSPUOrSKU(VIEWFORM.SPUFORM, row)"></el-button>
          <el-button type="info" icon="ele-Warning" title="查看sku列表" style="width: 40px;height: 30px;"
            @click="getSkuList(row)"></el-button>
          <el-button type="danger" icon="ele-Delete" title="删除spu" style="width: 40px;height: 30px;"
            @click="deleteSpu(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="isShowDialog" :title="showSpuInfo?.spuName" @close="closeSkuDialog">
      <el-table :data="skuList">
        <el-table-column label="名称" prop="skuName"></el-table-column>
        <el-table-column label="价格" prop="price"></el-table-column>
        <el-table-column label="重量" prop="weight"></el-table-column>
        <el-table-column label="默认图片">
          <template #="{ row }">
            <img :src="row.skuDefaultImg" width="100" alt="">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-pagination :current-page="page" :page-size="limit" :total="total" @current-change="pageChangeHandler"
      @size-change="limitChangeHandler" layout="prev,pager,next,jumper,->,sizes,total"
      :page-sizes="[5, 10, 15]"></el-pagination>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
export default defineComponent({
  name: 'ProductAttrSPUlist'
})
</script>
<script lang="ts" setup>
import { ref, watch, nextTick, computed } from 'vue'
import usecategorySelector from '@/hooks/usecategorySelector'
import { reqSPUList, reqDeleteSpu } from '@/api/spu'
import type { spuListType } from '@/api/spu'
import usePagination from '@/hooks/usePagination'
import { VIEWFORM } from '../enum'
import type { skuListType } from '@/api/sku'
import { reqSkuList } from '@/api/sku'
const emits = defineEmits(['addSPUOrSKU'])
function addSPUOrSKU(viewform: VIEWFORM, data?: spuListType) {
  emits('addSPUOrSKU', viewform, data)
}
// 分类id
const { category1Id, category2Id, category3Id } = usecategorySelector()
// 页面的自定义hooks
const { page, limit, total, pageChangeHandler, limitChangeHandler } = usePagination(getSPUList)
// spu列表
const spuList = ref<spuListType[]>([])

// sku列表
const skuList = ref<skuListType[]>([])
const showSpuInfo = ref<spuListType | null>(null)
// 是否显示dialog
const isShowDialog = computed(() => !!showSpuInfo.value)
// sku的数据请求状态
const isSkuLoading = ref(false);

// 获取spu列表
async function getSPUList() {
  if (category3Id.value !== '') {
    try {
      const result = await reqSPUList(Number(category3Id.value), page.value, limit.value)
      spuList.value = result.records
      page.value = result.current
      limit.value = result.size
      total.value = result.total
    } catch (e) {

      console.log(e);

    }

  }
}

// 请求sku列表
async function getSkuList(row: spuListType) {
  showSpuInfo.value = row;
  try {
    // 设置请求状态loading为true
    isSkuLoading.value = true;
    skuList.value = await reqSkuList(row.id)

  } catch (e) { } finally {
    // 无论请求成功还是失败，只要请求完成，改变loading状态
    isSkuLoading.value = false;
  }
}

// 关闭对话框的事件函数
function closeSkuDialog() {
  showSpuInfo.value = null
}

async function deleteSpu(row: spuListType) {
  try {
    await reqDeleteSpu(row.id)
    getSPUList()
    ElMessage.success('删除成功')
  } catch (e) {
    ElMessage.error('删除失败')
  }

}

// 监听三级分类的id
watch(category3Id, () => {
  // 当三级分类的id的值不为空字符串的时候调用函数
  getSPUList()
}, { immediate: true })

</script>

<style lang="less" scoped></style>