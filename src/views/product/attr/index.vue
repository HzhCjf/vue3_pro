<template>
  <div>
    <categorySelector :disabled="!isShowViewAttr"></categorySelector>
    <el-card shadow="hover">
      <div v-if="isShowViewAttr">
        <el-button type="primary" icon="ele-Plus" style="margin-top: 20px;margin-bottom: 20px;" :disabled="isAddDisabled"
          @click="AddAttr">添加属性</el-button>

        <el-table :data="attrs" border stripe>
          <el-table-column label="序号" type="index" width="100px" align="center"></el-table-column>
          <el-table-column label="属性名称" prop="attrName" width="200px"></el-table-column>
          <el-table-column label="属性值名称列表">
            <template #="{ row }">
              <el-tag type="success" v-for="attrValue in row.attrValueList" :key="attrValue.id">{{ attrValue.valueName
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200px">
            <template #="{ row }">
              <el-button type="warning" icon="ele-Edit" style="margin-right: 10px;"></el-button>
              <el-button type="danger" icon="ele-Delete" @click="deleteAttr(row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-else>
        <el-form inline style="margin: 20px 0;">
          <el-form-item label="属性名">
             <el-input placeholder="输入属性名" v-model="addAttrInfo.attrName"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">添加属性值</el-button>
            <el-button @click="isShowViewAttr = true">取消</el-button>
          </el-form-item>
        </el-form>

        <el-table>
          <el-table-column label="序号" width="100px"></el-table-column>
          <el-table-column label="属性值名称"></el-table-column>
          <el-table-column label="操作"></el-table-column>
        </el-table>

        <div>
          <el-button type="primary">保存</el-button>
          <el-button @click="isShowViewAttr = true">取消</el-button>
        </div>
      </div>
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
import { ref, watch } from 'vue'
// 请求的属性列表的接口
import { reqAttrInfoList,reqAddAttrInfo } from '@/api/attrInfoList'
// 属性列表的类型
import type { attrInfoListType,addAttrInfoType } from '@/api/attrInfoList'
// 自定义hooks
import usecategorySelector from '@/hooks/usecategorySelector'


// 分类id
const { category1Id, category2Id, category3Id } = usecategorySelector()
// 存储属性列表
const attrs = ref<attrInfoListType[]>([])
// 是否显示表格视图(true => 表格视图,false => 添加/修改)
const isShowViewAttr = ref(true)
// 是否禁用添加
const isAddDisabled = ref(true)
const addAttrInfo = ref<addAttrInfoType>({
  attrName:'',
  categoryId:0,
  categoryLevel:0,
  attrValueList:[]
})


// 监听三级分类的id
watch(category3Id, async () => {
  // 当三级分类的id的值不为空字符串的时候调用函数
  if (category3Id.value !== '') {
    try {
      isAddDisabled.value = false
      attrs.value = await reqAttrInfoList(Number(category1Id.value), Number(category2Id.value), Number(category3Id.value))

    } catch (e) {

      console.log(e);

    }

  } else {
    isAddDisabled.value = true
  }
})

// 添加属性/修改属性
function AddAttr() {
  isShowViewAttr.value = false
}

// 删除属性
async function deleteAttr(id: number) {

}


</script>

<style lang="less" scoped></style>