<template>
  <div>
    <el-card>
      <el-table :data="skus">
        <el-table-column label="序号" type="index" width="100px"></el-table-column>
        <el-table-column label="名称" prop="skuName"></el-table-column>
        <el-table-column label="描述" prop="skuDesc"></el-table-column>
        <el-table-column label="默认图片">
          <template #="{ row }">
            <img :src="row.skuDefaultImg" width="100" alt="">
          </template>
        </el-table-column>
        <el-table-column label="重量(KG)" prop="weight"></el-table-column>
        <el-table-column label="价格(元)" prop="price"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button v-if="!row.isSale" type="info" icon="ele-Top" @click="skuTop(row.id)"></el-button>
            <el-button v-else type="success" icon="ele-Bottom" @click="skuBottom(row.id)"></el-button>
            <el-button type="primary" icon="ele-Edit" @click="ElMessage.success('功能正在开发中~~~')"></el-button>
            <el-button type="info" icon="ele-InfoFilled" @click="getSkuById(row)"></el-button>
            <el-button type="danger" icon="ele-Delete" @click="deleteSku(row)"></el-button>
          </template>
        </el-table-column>

      </el-table>

      <el-drawer v-if="skuByIdList"  v-model="isShowSkuDrawer" :title="skuByIdList.skuName" @close="closeDrawer">
        <el-row>
          <el-col class="title" :span="6">名称</el-col>
          <el-col class="content" :span="16">{{ skuByIdList.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col class="title" :span="6">描述</el-col>
          <el-col class="content" :span="16">{{ skuByIdList.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col class="title" :span="6">价格</el-col>
          <el-col class="content" :span="16">{{ skuByIdList.price }}</el-col>
        </el-row>
        <el-row>
          <el-col class="title" :span="6">平台属性</el-col>
          <el-col class="content" :span="16">
            <el-tag type="success" v-for="item in skuByIdList.skuAttrValueList" :key="item.id">{{ item.attrName }}-{{
              item.valueName
            }}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="title" :span="6">销售属性</el-col>
          <el-col class="content" :span="16">
            <el-tag type="success" v-for="item in skuByIdList.skuSaleAttrValueList" :key="item.id">{{ item.saleAttrName }}-{{
              item.saleAttrValueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="title" :span="6">商品图片</el-col>
          <el-col class="content" :span="16">
            <el-carousel indicator-position="outside">
              <el-carousel-item v-for="item in skuByIdList.skuImageList" :key="item.id">
                <el-image :src="item.imgUrl" style="width: 100%;height: 100%;" ></el-image>
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </el-drawer>
      <el-pagination style="margin-top: 20px;" :total="total" :current-page="page" :page-size="limit"
        :page-sizes="[5, 10, 15, 20]" @current-change="pageChangeHandler" @size-change="limitChangeHandler"
        layout="prev,pager,next,jumper,->,sizes,total"></el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
export default defineComponent({
  name: 'ProductSKUList'
})
</script>
<script lang="ts" setup>
import { ref, computed, nextTick } from 'vue'
import { reqSkuInfoList, reqSkuTop, reqSkuBottom, reqSkuById,deleteByIdSku } from '@/api/sku'
import type { skuListType, skuByIdType } from '@/api/sku'
import usePagination from '@/hooks/usePagination'

const {
  page,
  limit,
  total,
  pageChangeHandler,
  limitChangeHandler
} = usePagination(getSkuInfoList)

// 所有的sku列表
const skus = ref<skuListType[]>([])
// 指定id的sku
const showSku = ref<skuListType | null>(null)
// 是否显示抽屉
const isShowSkuDrawer = computed(() => !!showSku.value)
// 指定id的sku列表
const skuByIdList = ref<skuByIdType | null>(null)

// 获取所有的sku列表
async function getSkuInfoList() {
  const result = await reqSkuInfoList(page.value, limit.value)
  skus.value = result.records
  total.value = result.total
}
getSkuInfoList()

// 上架
async function skuTop(id: number) {
  try {
    await reqSkuTop(id)
    getSkuInfoList()
    ElMessage.success('上架成功')
  } catch (e) {
    ElMessage.error('上架失败')
  }

}

// 下架
async function skuBottom(id: number) {
  try {
    await reqSkuBottom(id)
    getSkuInfoList()
    ElMessage.success('下架成功')
  } catch (e) {
    ElMessage.error('下架失败')
  }

}

// 请求指定id的sku
async function getSkuById(row: skuListType) {
  showSku.value = row
  try {
    // nextTick(()=>{
      skuByIdList.value = await reqSkuById(row.id)
    // })
  } catch (e) { }

}

// 关闭抽屉
function closeDrawer() {
  showSku.value = null
}

// 删除sku
async function deleteSku(row:skuListType){
  try{
    await deleteByIdSku(row.id)
    getSkuInfoList()
    ElMessage.success('删除成功')
  }catch(e){
    ElMessage.error('删除失败')
  }
}
</script>

<style scoped>
.title{
  font-weight: 900;
  font-size: 25px;
  text-align: right;
  margin-right: 10px;
  margin-bottom: 20px;
}
.title::after{
  content: ':';
}
.content{
  font-size: 18px;
  margin-bottom: 20px;
  padding-top: 8px;
}
</style>