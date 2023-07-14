<template>
  <div>
    <el-card>
      <el-form inline :disabled="disabled">
        <el-form-item label="一级分类">
          <!-- 当一级分类改变时请求二级分类 -->
          <el-select v-model="category1Id" @change="getCategory2">
            <el-option v-for="cat1 in category1" :key="cat1.id" :label="cat1.name" :value="cat1.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <!-- 当二级分类改变时请求三级分类 -->
          <el-select v-model="category2Id" @change="getCategory3">
            <el-option v-for="cat2 in category2" :key="cat2.id" :label="cat2.name" :value="cat2.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select v-model="category3Id">
            <el-option v-for="cat3 in category3" :key="cat3.id" :label="cat3.name" :value="cat3.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'CategorySelector'
})
</script>
<script lang="ts" setup>

import usecategorySelector from '@/hooks/usecategorySelector';
import { onMounted } from 'vue';

// 把数据,id,请求方法都解构
const {
  category1,
  category2,
  category3,
  category1Id,
  category2Id,
  category3Id,
  getCategory1,
  getCategory2,
  getCategory3
} = usecategorySelector()

// 初始化就请求分类列表1
onMounted(getCategory1)

withDefaults(
  defineProps<{
    disabled?:boolean
  }>(),
  {
    disabled:false
  }
)

</script>

<style lang="less" scoped></style>../../hooks/usecategorySelector