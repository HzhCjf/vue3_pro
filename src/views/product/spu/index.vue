<template>
  <div>
    <categorySelector :disabled="ViewForm != VIEWFORM.LIST"></categorySelector>

    <el-card style="margin-top: 20px;">
      <ProductAttrSPUlist v-if="ViewForm == VIEWFORM.LIST" @addSPUOrSKU="addSPUOrSKU"></ProductAttrSPUlist>
      <SPUForm v-if="ViewForm == VIEWFORM.SPUFORM" @addSPUOrSKU="addSPUOrSKU"></SPUForm>
      <SKUForm v-if="ViewForm == VIEWFORM.SKUFORM" @addSPUOrSKU="addSPUOrSKU"></SKUForm>
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
import categorySelector from '@/components/categorySelector'
import ProductAttrSPUlist from './list/index.vue'
import SPUForm from './SPUForm/index.vue'
import SKUForm from './SKUForm/index.vue'
import {VIEWFORM} from './enum'


const ViewForm = ref<VIEWFORM>(VIEWFORM.LIST)

function addSPUOrSKU(value:VIEWFORM){
  ViewForm.value = value
}
</script>

<style lang="less" scoped>
  
</style>