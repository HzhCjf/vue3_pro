<template>
  <div>
    <categorySelector></categorySelector>

    <el-card>
      <el-button type="primary" icon="ele-Plus" style="margin: 20px 0;">添加SPU</el-button>

      <el-table :data="spuList" border stripe size="default" style="margin-bottom: 20px;">
        <el-table-column type="index" width="100" align="center"></el-table-column>
        <el-table-column label="SPU名称" prop="spuName"></el-table-column>
        <el-table-column label="SPU描述" prop="description"></el-table-column>
        <el-table-column label="操作">
          <template #="{row}">
            <el-button type="success" icon="ele-Plus" style="width: 40px;height: 30px;"></el-button>
            <el-button type="warning" icon="ele-Edit" style="width: 40px;height: 30px;"></el-button>
            <el-button type="info" icon="ele-Warning" style="width: 40px;height: 30px;"></el-button>
            <el-button type="danger" icon="ele-Delete" style="width: 40px;height: 30px;"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination :current-page="page" :page-size="limit" :total="total" @current-change="pageChangeHandler" @size-change="limitChangeHandler"  layout="prev,pager,next,jumper,->,sizes,total" :page-sizes="[5, 10, 15]"></el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
 import { defineComponent } from 'vue'
  export default  defineComponent({
    name:'ProductSPUList'
  })
</script>
<script lang="ts" setup>
import categorySelector from '@/components/categorySelector'
import { ref, watch, nextTick } from 'vue'
import usecategorySelector from '@/hooks/usecategorySelector'
import {reqSPUList} from '@/api/spu'
import type {spuListType} from '@/api/spu'
import usePagination from '@/hooks/usePagination'
// 分类id
const { category1Id, category2Id, category3Id } = usecategorySelector()
// 页面的自定义hooks
const {page,limit,total,pageChangeHandler,limitChangeHandler}  = usePagination(getSPUList)

const spuList = ref<spuListType[]>([])

async function getSPUList() {
  if (category3Id.value !== '') {
    try {
      const result = await reqSPUList(Number(category3Id.value),page.value,limit.value)
      spuList.value = result.records
      page.value = result.current
      limit.value = result.size
      total.value = result.total
    } catch (e) { 

      console.log(e);

    }

  }
}
// 监听三级分类的id
watch(category3Id, () => {
  // 当三级分类的id的值不为空字符串的时候调用函数
  getSPUList()
},{immediate:true})

</script>

<style lang="less" scoped>
  
</style>