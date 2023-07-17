<template>
  <div>
    <el-card>
      <el-form label-width="100px">
        <el-form-item label="SPU名称">{{ data.spuName }}</el-form-item>
        <el-form-item label="SKU名称">
          <el-input v-model="formData.skuName" placeholder="SKU名称"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number :min="1" v-model="formData.price" placeholder="价格"></el-input-number>
        </el-form-item>
        <el-form-item label="重量">
          <el-input-number :min="1" v-model="formData.weight" placeholder="重量"></el-input-number>
        </el-form-item>
        <el-form-item label="规格描述">
          <el-input type="textarea" placeholder="规格描述" :rows="4" v-model="formData.skuDesc"></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
          <ul class="select_container">
            <li class="select_item" v-for="(attr, index) in attrList" :key="attr.id">
              <strong>{{ attr.attrName }}</strong>
              <el-select v-model="skuAttrValueList[index]">
                <el-option v-for="attrValue in attr.attrValueList" :key="attrValue.id" :label="attrValue.valueName"
                  :value="attr.id + ',' + attrValue.id"></el-option>
              </el-select>
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="销售属性">
          <ul class="select_container">
            <li class="select_item" v-for="item, index in saleAttrList" :key="item.id">
              <strong>{{ item.saleAttrName }}</strong>
              <el-select v-model="spuSaleAttrList[index]">
                <el-option v-for="item2 in item.spuSaleAttrValueList" :key="item2.id" :label="item2.saleAttrValueName"
                  :value="item.id + ',' + item2.id"></el-option>
              </el-select>
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="图片列表">
          <el-table :data="ImageList" border stripe ref="tableRef">
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="图片">
              <template #="{ row }">
                <img :src="row.imgUrl" width="100" />
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="imgName"></el-table-column>
            <el-table-column label="操作">
              <template #="{ row }">
                <el-button v-if="row.isDefault" type="success" @click="cancelDefault(row)">取消默认</el-button>
                <el-button v-else type="primary" @click="setDefault(row)">设置默认</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="SaveSkuInfo">保存</el-button>
          <el-button @click="$emit('addSPUOrSKU', VIEWFORM.LIST)">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProductAttrSKUForm'
})
</script>
<script lang="ts" setup>
import { ref } from 'vue'
import type { spuListType, updateSpuSaleAttrListType, updateSpuImageList } from '@/api/spu'
import type { addSaveSkuInfo } from '@/api/sku'
import type { attrInfoListType } from '@/api/attrInfoList'
import { VIEWFORM } from '../enum'
import { reqSaveSkuInfo } from '@/api/sku'
import { reqAttrInfoList } from '@/api/attrInfoList'
import usecategorySelector from '@/hooks/usecategorySelector'
import { reqUpdateSaleAttrList, reqUpdateImageList } from '@/api/spu'
import { ElMessage, type ElTable } from 'element-plus'

const { category1Id, category2Id, category3Id } = usecategorySelector()
const props = defineProps<{
  data: spuListType
}>()

const emits = defineEmits(['addSPUOrSKU'])

// 收集表单数据
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

// 平台属性列表
const attrList = ref<attrInfoListType[]>([])
// 平台属性
const skuAttrValueList = ref<string[]>([])
// 销售属性列表
const saleAttrList = ref<updateSpuSaleAttrListType[]>([])
// 销售属性
const spuSaleAttrList = ref<string[]>([])
// 图片属性列表
const ImageList = ref<SkuImage[]>([])
// 图片属性类型,给图片属性添加了一个是否是默认属性类型
type SkuImage = updateSpuImageList & {
  isDefault: boolean;
};
// 存储当前的默认图片
const defaultImage = ref<SkuImage | null>(null)
// 图片的实例
const tableRef = ref<InstanceType<typeof ElTable> | null>(null);

// 获取平台属性列表
async function getAttrInfoList() {
  try {
    attrList.value = await reqAttrInfoList(Number(category1Id.value), Number(category2Id.value), Number(category3Id.value))
  } catch (e) {

  }

}

// 获取销售属性列表
async function getUpdateSaleAttrList() {
  try {
    saleAttrList.value = await reqUpdateSaleAttrList(props.data.id)
  } catch (e) { }
}

// 获取图片属性列表
async function getIamgeList() {
  try {
    const result = await reqUpdateImageList(props.data.id)
    ImageList.value = result.map(item => {
      return {
        ...item,
        isDefault: false
      }

    })
  } catch (e) {

  }
}

getAttrInfoList()
getUpdateSaleAttrList()
getIamgeList()

// 取消默认
function cancelDefault(row:SkuImage){
  row.isDefault = false
  defaultImage.value = null
  
}

// 设置默认
function setDefault(row:SkuImage){
  if(defaultImage.value){
    cancelDefault(defaultImage.value)
  }
  row.isDefault = true
  defaultImage.value = row
  // 用于多选表格，切换某一行的选中状态， 如果使用了第二个参数，则可直接设置这一行选中与否
  tableRef.value?.toggleRowSelection(row,true)
}

// 提交保存
async function SaveSkuInfo() {
  // 平台属性
  formData.value.skuAttrValueList = skuAttrValueList.value.map(item => {
    const [attrId, valueId] = item.split(',')
    return {
      attrId: Number(attrId),
      valueId: Number(valueId)
    }
  }).filter((item) => item)

  // 销售属性
  formData.value.skuSaleAttrValueList = spuSaleAttrList.value.map(item => {
    const [attrId, attrValueId] = item.split(',')
    return {
      saleAttrId: Number(attrId),
      saleAttrValueId: Number(attrValueId)
    }
  }).filter(item => item)


  // 图片属性
  // 这个实例方法用于获取选择的行
  const ImageRows = tableRef.value?.getSelectionRows()
  if(ImageList){
    formData.value.skuImageList = ImageRows
  }
  // 默认图片
  if(defaultImage.value){
    formData.value.skuDefaultImg = defaultImage.value.imgUrl
  }else{
    formData.value.skuDefaultImg = ''
  }

  try{
    await reqSaveSkuInfo(formData.value)
    ElMessage.success('添加成功')
    emits('addSPUOrSKU',VIEWFORM.LIST)
  }catch(e){
    ElMessage.error('添加失败')
  }
  
}
</script>

<style  scoped>
.select_container {
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  list-style: none;
}

.select_container .select_item {
  display: flex;
  margin: 10px 0;
  width: 33.33%;
}

.select_container .select_item strong {
  width: 100px;
  text-align: right;
  margin-right: 10px;
}

.select_container .select_item strong::after {
  content: ":";
}</style>