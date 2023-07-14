<template>
  <div>
    <categorySelector :disabled="!isShowViewAttr"></categorySelector>
    <el-card shadow="hover">
      <div v-if="isShowViewAttr">
        <el-button type="primary" icon="ele-Plus" style="margin-top: 20px;margin-bottom: 20px;" :disabled="isAddDisabled"
          @click="AddAttr()">添加属性</el-button>

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
              <el-button type="warning" icon="ele-Edit" style="margin-right: 10px;" @click="AddAttr(row)"></el-button>
              <el-popconfirm title="你确定要删除?" @confirm="deleteAttr(row.id)">
                <template #reference>
                  <el-button type="danger" icon="ele-Delete"></el-button>
                </template>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-else>
        <el-form inline style="margin: 20px 0;">
          <el-form-item label="属性名">
            <el-input placeholder="输入属性名" v-model="addAttrInfoData.attrName" @blur="NoDoubel" @keyup.enter="NoDoubel"
              ref="attrNameRef" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="!addAttrInfoData.attrName" @click="addAttrValue">添加属性值</el-button>
            <el-button @click="isShowViewAttr = true">取消</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="addAttrInfoData.attrValueList" border>
          <el-table-column label="序号" width="100px" type="index"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <span v-if="row.isEdit" @click="editInput(row)">{{ row.valueName }}</span>
              <el-input v-else ref="attrValueInputRef" v-model="row.valueName" style="width: 80%;z-index: 20;"
                @blur="removeDoubel(row, $index)" @keyup.enter="removeDoubel(row, $index)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{ $index }">
              <el-button type="danger" icon="ele-Delete" style="width: 20px;"
                @click="deleteAttrValue($index)"></el-button>
            </template>
          </el-table-column>
        </el-table>

        <div>
          <el-button type="primary" @click="addAttrInfo">保存</el-button>
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
import _ from 'lodash'
//三级联动分类列表
import categorySelector from '@/components/categorySelector/index.vue'
import { ref, watch, nextTick } from 'vue'
// 请求的属性列表的接口
import { reqAttrInfoList, reqAddAttrInfo, reqDeleteAttr } from '@/api/attrInfoList'
// 属性列表的类型
import type { attrInfoListType, addAttrInfoType, addAttrValueEditType } from '@/api/attrInfoList'
// 自定义hooks
import usecategorySelector from '@/hooks/usecategorySelector'
import { ElInput, ElMessage } from 'element-plus'


// 分类id
const { category1Id, category2Id, category3Id } = usecategorySelector()
// 存储属性列表
const attrs = ref<attrInfoListType[]>([])
// 是否显示表格视图(true => 表格视图,false => 添加/修改)
const isShowViewAttr = ref(true)
// 是否禁用添加按钮
const isAddDisabled = ref(true)
// 存储并初始化添加数据
const addAttrInfoData = ref<addAttrInfoType>({
  attrName: '',
  categoryId: Number(category3Id.value),
  categoryLevel: 3,
  attrValueList: []
})

//属性值的input实例
const attrValueInputRef = ref<typeof ElInput | null>(null)
// 属性的input实例
const attrNameRef = ref<typeof ElInput | null>(null)

// 请求属性列表
async function getAttrInfoList() {
  if (category3Id.value !== '') {
    try {
      isAddDisabled.value = false
      attrs.value = await reqAttrInfoList(Number(category1Id.value), Number(category2Id.value), Number(category3Id.value))

    } catch (e) {

      console.log(e);

    }

  } else {
    isAddDisabled.value = true
    attrs.value = []
  }
}

// 监听三级分类的id
watch(category3Id, () => {
  // 当三级分类的id的值不为空字符串的时候调用函数
  getAttrInfoList()
},{immediate:true})

// 添加属性/修改属性
function AddAttr(row?: attrInfoListType) {
  isShowViewAttr.value = false
  // 如果有row,说明点击的是修改
  if (row) {
    // 把这个属性的数据进行深拷贝到addAttrInfoData里面
    addAttrInfoData.value = _.cloneDeep(row)
    // 点击修改的时候,把input销毁,span显示
    addAttrInfoData.value.attrValueList.forEach((item) => {
      item.isEdit = true
    })
  } else {
    // 没有row,说明点击的是添加,把数据进行初始化
    addAttrInfoData.value = {
      attrName: '',
      categoryId: Number(category3Id.value),
      categoryLevel: 3,
      attrValueList: []
    }
  }

}

// 给指定的属性添加属性值
function addAttrValue() {
  //先判断addAttrInfoData.value.attrValueList里面的valueName 是不是空串  如果是直接retrun
  let isEixt = addAttrInfoData.value.attrValueList.find((item) => item.valueName == "")
  if (isEixt) return

  //给属性值的数组里面添加一个valueName属性
  addAttrInfoData.value.attrValueList.push({
    valueName: '',
    isEdit: false
  })

  // 页面加载完后把焦点聚焦在input元素上
  nextTick(() => {
    attrValueInputRef.value?.focus()
  })
}

// 点击展示属性值的时候显示input框,然后聚焦
function editInput(row: addAttrValueEditType) {
  row.isEdit = false
  nextTick(() => {
    attrValueInputRef.value?.focus()
  })
}

// 失焦和回车键回调事件
function removeDoubel(row: addAttrValueEditType, index: number) {
  row.isEdit = true
  // if (row.valueName.trim() == '') {
  //   row.isEdit = false
  //   nextTick(() => {
  //     attrValueInputRef.value?.focus()
  //   })
  //   ElMessage.error('请输入属性值')
  // }

  // 如果这个属性值不存在或者为空,那就直接删除这个属性值
  if (!row.valueName || !row.valueName.trim()) {
    addAttrInfoData.value.attrValueList.splice(index, 1)
  }

  // 过滤掉与这个属性一样的值
  const filterAttrValue = addAttrInfoData.value.attrValueList.filter(item => item != row)

  // 在这个数据里面查找是否有一样的
  const isExit = filterAttrValue.find(item => item.valueName == row.valueName)
  if (isExit) {
    // 如果有一样的,就清空这个属性值
    row.valueName = ''
    // 重新显示input
    row.isEdit = false
    // 聚焦到这个input
    nextTick(() => {
      attrValueInputRef.value?.focus()
    })
    ElMessage.error('属性值不可重复')
  }

}

// 属性名的失焦和回车
function NoDoubel() {
  // 在attrs里面排除掉自己
  const filterAttr = attrs.value.filter(item => item != addAttrInfoData.value)
  // 然后在已经过滤过的里面进行查找
  const isExit = filterAttr.find(item => item.attrName == addAttrInfoData.value.attrName)
  if (isExit) {
    // 如果有就清空这个input
    addAttrInfoData.value.attrName = ''
    // 重新聚焦到这个input
    nextTick(() => {
      attrNameRef.value?.focus()
    })
    ElMessage.error('属性名不可重名')
  }
}

// 删除属性值
function deleteAttrValue(index: number) {
  addAttrInfoData.value.attrValueList.splice(index, 1)
}

// 添加保存属性
async function addAttrInfo() {
  const messageTitle = addAttrInfoData.value.id ? '修改' : '添加'
  try {
    await reqAddAttrInfo(addAttrInfoData.value)
    isShowViewAttr.value = true
    getAttrInfoList()
    ElMessage.success(messageTitle + '成功')
  } catch (e) {
    ElMessage.error(messageTitle + '失败')
  }

}

// 删除属性
async function deleteAttr(id: number) {
  try {
    await reqDeleteAttr(id)
    getAttrInfoList()
    ElMessage.success('删除成功')
  } catch (e) {
    ElMessage.error('删除失败')
  }

}


</script>

<style lang="less" scoped></style>