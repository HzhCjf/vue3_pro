<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="formData.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="formData.tmId">
          <el-option v-for="tm in trademarkList" :key="tm.id" :label="tm.tmName" :value="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input placeholder="SPU描述" type="textarea" rows="4" v-model="formData.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload v-model:file-list="fileList" :action="uploadUrl" list-type="picture-card"
          :on-preview="handlePictureCardPreview">
          <el-icon>
            <ele-Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="baseSaleAttr" style="margin-right: 10px;"
          :placeholder="unuseBaseSaleAttrList.length > 0 ? `还有${unuseBaseSaleAttrList.length}条属性未使用` : '暂无数据'">
          <el-option v-for="baseAttr in unuseBaseSaleAttrList" :key="baseAttr.id" :label="baseAttr.name"
            :value="baseAttr.id + ',' + baseAttr.name"></el-option>
        </el-select>
        <el-button type="primary" @click="addBaseSaleAttrHandler">添加销售属性</el-button>
        <el-table :data="formData.spuSaleAttrList" border stripe>
          <el-table-column label="序号" type="index" width="100px" align="center"></el-table-column>
          <el-table-column label="属性名" prop="saleAttrName">

          </el-table-column>
          <el-table-column label="属性值名称列表">
            <template #="{ row }">
              <el-tag v-for=" item in row.spuSaleAttrValueList" :key="item.saleAttrValueName" closable
                @close="deleteAttrValue(row, item)">
                {{ item.saleAttrValueName }}
              </el-tag>
              <el-input v-if="row.isEixt" style="width: 30%;" ref="attrValueRef" v-model="attrValue"
                @blur="attrValueBlurOrEnterHandler(row)" @keyup.enter="attrValueBlurOrEnterHandler(row)"></el-input>
              <el-button style="width: 30px;height: 30px;" @click="addAttrValueHandler(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{ row }">
              <el-button type="danger" icon="ele-Delete" @click="deleteAttr(row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addSPUInfo">保存</el-button>
        <el-button @click="$emit('addSPUOrSKU', VIEWFORM.LIST)">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog v-model="isShowPreview" :title="preview?.name" @close="preview = null">
      <el-carousel height="70vh">
        <el-carousel-item v-for="item in fileList" :key="item.name">
          <img :src="item.url" :style="{ objectFit: 'cover', width: '100%', height: '100%' }">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ProductAttrSPUForm'
})
</script>
<script lang="ts" setup>
import { VIEWFORM } from '../enum'
import { reqSPUInfoType, reqSaleAttrList, reqUpdateImageList, reqUpdateSaleAttrList, reqUpdateAttrInfo } from '@/api/spu'
import type { addSPUType, saleAttrListType, spuSaleAttrListType, spuSaleAttrValueListType, spuListType, updateSpuInfoType, updateSpuSaleAttrListType, updateSpuImageList } from '@/api/spu'
import usecategorySelector from '@/hooks/usecategorySelector'
import { reqTrademarkList2 } from '@/api/trademark'
import type { trademarkDataType } from '@/api/trademark'
import type { UploadUserFile, UploadFile } from 'element-plus'
import { ref, computed, nextTick } from 'vue'
import { ElInput, ElMessage } from 'element-plus'

const emits = defineEmits(['addSPUOrSKU'])
// 用环境变量地址,本地和打包时使用不同的地址
const uploadUrl = `${import.meta.env.VITE_API_URL}/product/upload`
//属性值
const attrValue = ref('')


// 分类id
const { category1Id, category2Id, category3Id } = usecategorySelector()
const formData = ref<addSPUType | updateSpuInfoType>({
  category3Id: Number(category3Id.value),
  // spu名称
  spuName: '',
  // spu所属品牌id
  tmId: '',
  // spu简介
  description: '',
  // spu图片列表
  spuImageList: [],
  // spu销售属性列表
  spuSaleAttrList: []
})


// 属性值的input实例
const attrValueRef = ref<typeof ElInput | null>(null)

//品牌列表
const trademarkList = ref<trademarkDataType[]>([])

// 图片列表
const fileList = ref<UploadUserFile[]>([])
// 预览图片列表的变量
const preview = ref<UploadFile | null>(null)
// 当预览图片的数据存在就显示
const isShowPreview = ref(computed(() => !!preview.value))
// 获取的基础销售属性
const baseSaleAttrList = ref<saleAttrListType[]>([])
// 用户选择的基础销售属性
const baseSaleAttr = ref('')

// 未被使用过的属性
const unuseBaseSaleAttrList = computed(() => {
  // 定义一个数据来存储进行返回
  const newAttr: saleAttrListType[] = []
  // 遍历循环系统的数据
  baseSaleAttrList.value.forEach(item => {
    // 在formData中查找是否有跟系统数据里面相同的
    const isEixt = (formData.value as addSPUType).spuSaleAttrList.find(item2 => {
      return item2.baseSaleAttrId == item.id
    })

    // 如果formData里面没有,就说明这个属性还未被使用,所以添加到里面去
    if (!isEixt) {
      newAttr.push(item)
    }

  })
  return newAttr
})

// 接收传来的属性数据
const props = defineProps<{
  data?: spuListType
}>()

// 如果有,就说明点击的是修改
if (props?.data) {
  (formData.value as updateSpuInfoType).id = props.data.id
  formData.value.category3Id = props.data.category3Id
  formData.value.description = props.data.description
  formData.value.spuName = props.data.spuName
  formData.value.tmId = props.data.tmId.toString()

  getImageList()
  getUpdateAttrList()
}

// 获取编辑的图片列表
async function getImageList() {
  try {
    const result = await reqUpdateImageList(props.data!.id)
    fileList.value = result.map((item) => {
      return {
        name: item.imgName,
        url: item.imgUrl,
        response: { data: item.imgUrl }
      }
    })
  } catch (e) { }
}

//获取销售属性列表
async function getUpdateAttrList(){
  try{
    formData.value.spuSaleAttrList = await reqUpdateSaleAttrList(props.data!.id)
  }catch(e){}
}

getTrademarkList()
getBaseSaleAttrList()
// 请求品牌列表
async function getTrademarkList() {
  trademarkList.value = await reqTrademarkList2()
}
// console.log(preview);
// 预览图片
function handlePictureCardPreview(uploadFile: UploadFile) {
  preview.value = uploadFile
}

// 请求基础属性列表
async function getBaseSaleAttrList() {
  try {
    baseSaleAttrList.value = await reqSaleAttrList()
  } catch (e) {

  }
}

// 添加基础销售属性
function addBaseSaleAttrHandler() {
  const [id, saleAttrName] = baseSaleAttr.value.split(',')
  if (baseSaleAttr.value != '') {
    (formData.value as addSPUType).spuSaleAttrList.push({
      baseSaleAttrId: Number(id),
      saleAttrName,
      spuSaleAttrValueList: [],
      isEixt: false
    })
  }
  baseSaleAttr.value = ''
}

// 添加属性值
function addAttrValueHandler(row: spuSaleAttrListType) {
  row.isEixt = true
  nextTick(() => {
    attrValueRef.value?.focus()
  })

}

// 属性值失焦
function attrValueBlurOrEnterHandler(row: spuSaleAttrListType) {
  const newValue = attrValue.value.trim()
  if (newValue == '') {
    row.isEixt = false
    return
  }
  const isFind = row.spuSaleAttrValueList.find(item => {
    return item.saleAttrValueName == newValue
  })
  // console.log(isFind);

  if (isFind) {
    ElMessage.error('属性值不可重复')
    nextTick(() => {
      attrValueRef.value?.focus()
    })
    attrValue.value = ''
    return
  }
  const { baseSaleAttrId, saleAttrName } = row
  row.spuSaleAttrValueList.push({
    baseSaleAttrId: baseSaleAttrId.toString(),
    saleAttrName,
    saleAttrValueName: attrValue.value
  })

  row.isEixt = false
  attrValue.value = ''
}

// 删除属性值
function deleteAttrValue(row: spuSaleAttrListType, item: spuSaleAttrValueListType) {
  row.spuSaleAttrValueList = row.spuSaleAttrValueList.filter(attrValue => attrValue != item)

}


// 删除属性
function deleteAttr(row: spuSaleAttrListType) {
  formData.value.spuSaleAttrList = (formData.value as addSPUType).spuSaleAttrList.filter(item => item != row)
  ElMessage.success('删除成功')
}

// 添加spu
async function addSPUInfo() {
  const messageTitle = (formData.value as updateSpuInfoType).id ? '修改':'添加'
  try {
    // 把数组里面的图片赋给formData里面
    formData.value.spuImageList = fileList.value.map((item) => {
      return {
        imgName: item.name,
        imgUrl: (item.response as { data: string }).data
      }
    })
    if(messageTitle ==='修改'){
      await reqUpdateAttrInfo(formData.value as updateSpuInfoType)
    }else{
      await reqSPUInfoType(formData.value as addSPUType)
    }
    
    emits('addSPUOrSKU', VIEWFORM.LIST)
    ElMessage.success(messageTitle + 'SPU成功')
  } catch (e) {
    ElMessage.error(messageTitle + '添加SPU失败')
  }

}



</script>

<style lang="less" scoped></style>