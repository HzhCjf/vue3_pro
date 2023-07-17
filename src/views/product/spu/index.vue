<template>
  <div>
    <categorySelector :disabled="ViewForm != VIEWFORM.LIST"></categorySelector>

    <el-card style="margin-top: 20px;">
      <ProductAttrSPUlist v-if="ViewForm == VIEWFORM.LIST" @addSPUOrSKU="addSPUOrSKU"></ProductAttrSPUlist>
      <SPUForm v-if="ViewForm == VIEWFORM.SPUFORM" @addSPUOrSKU="addSPUOrSKU" :data="SPUData"></SPUForm>
      <SKUForm v-if="SPUData && ViewForm == VIEWFORM.SKUFORM" @addSPUOrSKU="addSPUOrSKU" :data="SPUData"></SKUForm>
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
import {ref} from 'vue'
import categorySelector from '@/components/categorySelector/index.vue'
import ProductAttrSPUlist from './list/index.vue'
import SPUForm from './SPUForm/index.vue'
import SKUForm from './SKUForm/index.vue'
import {VIEWFORM} from './enum'
import type {spuListType} from '@/api/spu'

const ViewForm = ref<VIEWFORM>(VIEWFORM.LIST)
// 定义一个变量，用于接受列表页面传递上来的当前待编辑spu信息
const SPUData = ref<spuListType>()
function addSPUOrSKU(value:VIEWFORM,data?:spuListType){
  ViewForm.value = value
  SPUData.value = data
}
</script>

<style lang="less" scoped>
  
</style>