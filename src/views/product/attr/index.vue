<template>
  <div>
    <categorySelector></categorySelector>
    <el-card shadow="hover">
      <el-button type="primary" icon="ele-Plus" style="margin-top: 20px;margin-bottom: 20px;">添加属性</el-button>

      <el-table :data="attrs" border stripe>
        <el-table-column label="序号" type="index" width="100px"></el-table-column>
        <el-table-column label="属性名称" prop="attrName"></el-table-column>
        <el-table-column label="属性值名称列表">
          <template #="{row}">
            <el-tag v-for="attrValue in row.attrValueList" :key="attrValue.id">{{ attrValue.valueName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #="{row}">
            <el-button type="warning" icon="ele-Edit" style="margin-right: 30px;"></el-button>
            <el-button type="danger" icon="ele-Delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ProductAttrList'
})
</script>
<script lang="ts" setup>
//三级联动分类列表
import categorySelector from '@/components/categorySelector/index.vue'
import { ref ,watch} from 'vue'
// 请求的属性列表的接口
import { reqAttrInfoList } from '@/api/attrInfoList'
// 属性列表的类型
import type { attrInfoListType } from '@/api/attrInfoList'
// 自定义hooks
import usecategorySelector from '@/hooks/usecategorySelector'


// 分类id
const { category1Id, category2Id, category3Id } = usecategorySelector()
// 存储属性列表
const attrs = ref<attrInfoListType[]>([])

// 监听三级分类的id
watch(category3Id, async () => {
  // 当三级分类的id的值不为空字符串的时候调用函数
  if (category3Id.value !== '') {
    try {
      attrs.value = await reqAttrInfoList(Number(category1Id.value), Number(category2Id.value), Number(category3Id.value))

    } catch (e) {
      console.log(e);
      
    }

  }
})


</script>

<style lang="less" scoped></style>