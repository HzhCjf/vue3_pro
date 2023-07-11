<template>
  <div>
    <categorySelector></categorySelector>
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
</script>

<style lang="less" scoped>
  
</style>