<template>
  <div>ProductAttrSKUForm</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ProductAttrSKUForm'
})
</script>
<script lang="ts" setup>
import { ref } from 'vue'
import type { spuListType } from '@/api/spu'
import type { addSaveSkuInfo } from '@/api/sku'
const props = defineProps<{
  data: spuListType
}>()

const formData = ref<addSaveSkuInfo>({
  spuId: props.data.id,
  tmId: props.data.tmId,
  category3Id: props.data.category3Id,

  skuName: "",
  price: 0,
  weight: 0,
  skuDesc: "",

  skuAttrValueList: [],
  skuSaleAttrValueList: [],

  skuImageList: [],
  skuDefaultImg: "",
})
</script>

<style lang="less" scoped></style>