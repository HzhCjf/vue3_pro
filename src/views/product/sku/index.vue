<template>
  <div>
    <el-card>
      <el-table :data="skus">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="名称" prop="skuName"></el-table-column>
        <el-table-column label="描述" prop="skuDesc"></el-table-column>
        <el-table-column label="默认图片">
          <template #="{ row }">
            <img :src="row.skuDefaultImg" width="100" alt="">
          </template>
        </el-table-column>
        <el-table-column label="重量" prop="weight"></el-table-column>
        <el-table-column label="价格" prop="price"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button v-if="!row.isSale" type="info" icon="ele-Top" @click="topSale(row)"></el-button>
            <el-button v-else type="success" icon="ele-Bottom" @click="bottomSale(row)"></el-button>
            <el-button type="primary" icon="ele-Edit"></el-button>
            <el-button type="info" icon="ele-InfoFilled" @click="showSkuDrawer(row)"></el-button>
            <el-button type="danger" icon="ele-Delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :total="total" :current-page="page" :page-size="limit" :page-sizes="[5, 10, 15, 20]"
        @current-change="pageChangeHandler" @size-change="limitChangeHandler"
        layout="prev,pager,next,jumper,->,sizes,total"></el-pagination>
      <el-drawer v-model="isShowSkuDrawer" :title="skuById?.skuName" @close="closeDrawer" style="width: 500px;">
        <el-row >
          <el-col class="title" :span="6">名称</el-col>
          <el-col class="content" :span="16">{{ skuById?.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col class="title" :span="6">描述</el-col>
          <el-col class="content"  :span="16">{{ skuById?.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col class="title" :span="6">价格</el-col>
          <el-col class="content" :span="16">{{ skuById?.price }}</el-col>
        </el-row>
        <el-row>
          <el-col class="title" :span="6">平台属性</el-col>
          <el-col class="content" :span="16">
            <el-tag type="success" v-for="item in skuById?.skuAttrValueList" :key="item.id">{{ item.attrName }}-{{ item.valueName
            }}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="title" :span="6">销售属性</el-col>
          <el-col class="content" :span="16">
            <el-tag type="success" v-for="item in skuById?.skuSaleAttrValueList" :key="item.id">{{ item.saleAttrName }}-{{
              item.saleAttrValueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="title" :span="6">商品图片</el-col>
          <el-col class="content" :span="16">
            <el-carousel indicator-position="outside">
              <el-carousel-item v-for="item in skuById?.skuImageList" :key="item.id">
                <img :src="item.imgUrl" style="width: 100%;height: 100%;" alt="">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </el-drawer>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ProductSKUList'
})
</script>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import { reqSkuInfoList, reqTopSale, reqBottomSale, reqSkuById } from '@/api/sku'
import type { skuListType, skuByIdType } from '@/api/sku'
import usePagination from '@/hooks/usePagination'

const {
  page,
  limit,
  total,
  pageChangeHandler,
  limitChangeHandler
} = usePagination(getSkuListInfo)

// sku列表
const skus = ref<skuListType[]>([])
// sku属性
const showSkus = ref<skuListType | null>(null)
// 指定id的sku
const skuById = ref<skuByIdType>()
// 是否显示抽屉,sku详情
const isShowSkuDrawer = computed(() => !!showSkus.value)

// 获取sku列表
async function getSkuListInfo() {
  const result = await reqSkuInfoList(page.value, limit.value)
  skus.value = result.records
  total.value = result.total
}



getSkuListInfo()

// 上架
async function topSale(row: skuListType) {
  await reqTopSale(row.id)
  getSkuListInfo()
}

// 上架
async function bottomSale(row: skuListType) {
  await reqBottomSale(row.id)
  getSkuListInfo()
}

// 获取指定id的sku
async function showSkuDrawer(row: skuListType) {
  showSkus.value = row;
  try {
    skuById.value = await reqSkuById(row.id)
  } catch (e) {

  }
}

// 关闭抽屉的事件函数
function closeDrawer() {
  showSkus.value = null
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