<template>
  <div>
    <el-card>
      <el-table :data="skus">
        <el-table-column label="序号" type="index" width="100px"></el-table-column>
        <el-table-column label="名称" prop="skuName"></el-table-column>
        <el-table-column label="描述" prop="skuDesc"></el-table-column>
        <el-table-column label="默认图片">
          <template #="{ row }">
            <img :src="row.skuDefaultImg" width="100" alt="">
          </template>
        </el-table-column>
        <el-table-column label="重量(KG)" prop="weight"></el-table-column>
        <el-table-column label="价格(元)" prop="price"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button v-if="!row.isSale" type="info" icon="ele-Top" @click="skuTop(row.id)"></el-button>
            <el-button v-else type="success" icon="ele-Bottom" @click="skuBottom(row.id)"></el-button>
            <el-button type="primary" icon="ele-Edit" @click="ElMessage.success('功能正在开发中~~~')"></el-button>
            <el-button type="info" icon="ele-InfoFilled"></el-button>
            <el-button type="danger" icon="ele-Delete"></el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination style="margin-top: 20px;" :total="total" :current-page="page" :page-size="limit"
        :page-sizes="[5, 10, 15, 20]" @current-change="pageChangeHandler" @size-change="limitChangeHandler"
        layout="prev,pager,next,jumper,->,sizes,total"></el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
export default defineComponent({
  name: 'ProductSKUList'
})
</script>
<script lang="ts" setup>
import { ref } from 'vue'
import { reqSkuInfoList, reqSkuTop, reqSkuBottom } from '@/api/sku'
import type { skuListType } from '@/api/sku'
import usePagination from '@/hooks/usePagination'

const {
  page,
  limit,
  total,
  pageChangeHandler,
  limitChangeHandler
} = usePagination(getSkuInfoList)

// 获取所有的sku列表
const skus = ref<skuListType[]>([])
async function getSkuInfoList() {
  const result = await reqSkuInfoList(page.value, limit.value)
  skus.value = result.records
  total.value = result.total
}
getSkuInfoList()

// 上架
async function skuTop(id: number) {
  try {
    await reqSkuTop(id)
    getSkuInfoList()
    ElMessage.success('上架成功')
  } catch (e) {
    ElMessage.error('上架失败')
  }

}

// 下架
async function skuBottom(id: number) {
  try {
    await reqSkuBottom(id)
    getSkuInfoList()
    ElMessage.success('下架成功')
  } catch (e) {
    ElMessage.error('下架失败')
  }

}
</script>

<style lang="less" scoped></style>