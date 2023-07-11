<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <el-button type="primary" icon="ele-Plus" @click="ShowDialog()">添加</el-button>
      </template>
      <el-table :data="trademarkList">
        <el-table-column label="序号" type="index" width="100"></el-table-column>
        <el-table-column label="品牌名称" prop="tmName"></el-table-column>
        <el-table-column label="品牌LOGO">
          <template v-slot='{ row }'>
            <img :src="row.logoUrl" width="100" alt="">
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #="{ row, column, $index }">
            <el-button type="warning" icon="ele-Edit" @click="ShowDialog(row)">修改</el-button>
            <el-button type="danger" icon="ele-Delete" @click="deleteUser(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination :total='total' @current-change="currentChangeHandler" :page-size="limit" :page-sizes="[5, 10, 15]"
        :current-page="page" layout="prev, pager, next, jumper,sizes, ->, total" @size-change="sizeChange"
        style="margin-top: 20px;"></el-pagination>
    </el-card>
    <el-dialog v-model="isShowDialog" :title="DialogTitle + '品牌'" modal show-close>
      <template #>
        <el-form label-width="100px" :model="addTrademarkItem" :rules="rules" ref="formRef">
          <el-form-item label="品牌名称" prop="tmName">
            <el-input style="width: 80%;" v-model="addTrademarkItem.tmName" />
          </el-form-item>
          <el-form-item label="品牌LOGO" prop="logoUrl">
            <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false"
              :on-success="addTrademarkLogoUrl" :before-upload="beforeUpload">
              <img v-if="addTrademarkItem.logoUrl" :src="addTrademarkItem.logoUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <ele-Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="closeAdd">取消</el-button>
        <el-button type="primary" @click="addTrademark">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ProductTrademarkList'
})
</script>
<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { reqTrademarkList, reqDeleteTrademarkItem, reqAddTrademarkItem, reqCancelTrademarkItem } from '@/api/trademark'
import type { trademarkDataType, addTrademarkItemType, editTrademarkItemType } from '@/api/trademark'
import type { UploadFile, UploadFiles, FormRules, UploadRawFile } from 'element-plus'
import { ElMessage } from 'element-plus'
// 品牌内容
const trademarkList = ref<trademarkDataType[]>([])
// 总条数
const total = ref(0)
// 当前页
const page = ref(1)
// 每页条数
const limit = ref(5)
// 是否显示对话框的变量
const isShowDialog = ref(false)
// 添加品牌的内容
const addTrademarkItem = ref<addTrademarkItemType | editTrademarkItemType>({
  tmName: '',
  logoUrl: ''
})
// 用环境变量地址,本地和打包时使用不同的地址
const uploadUrl = `${import.meta.env.VITE_API_URL}/product/upload`
// 绑定表单
const formRef = ref()
const DialogTitle = ref('')


// 表单验证规则
const rules: FormRules = {
  tmName: [
    {
      // 必填
      required: true,
      // 最小个数
      min: 1,
      // 最大个数
      max: 20,
      // 校验错误提示
      message: '品牌名称必须填写',
      // 触发时机
      trigger: 'blur'
    }
  ],
  logoUrl: [
    {
      // 必填
      required: true,
      // 触发时机
      trigger: 'blur',
      // 自定义校验规则回调函数,rule为规则,value是当前的值,callbakc为回调函数,当里面有值的时候为失败,没有值为成功
      validator(rule: any, value: string, callback) {
        // 当没有图片地址的时候
        if (value === '') {
          // 失败回调
          callback('品牌logo必须上传')
        } else {
          // 把地址取到最后一个.后面,然后+1位,不要.,拿到图片格式
          const ext = value.substring(value.lastIndexOf('.') + 1)
          // 当图片格式不是以下几种的时候直接调用失败回调
          if (['png', 'jpg', 'gif'].includes(ext)) {
            callback()
          } else {
            callback('请上传正确的logo图片格式!(png,jpg,gif)')
          }
        }
      }
    }
  ]
}

// 请求品牌列表
async function getTrademark() {
  try {
    const result = await reqTrademarkList(page.value, limit.value)
    trademarkList.value = result.records
    total.value = result.total
    page.value = result.current
    limit.value = result.size
  } catch (error) {
    console.log(error);

  }
}
// 调用请求
getTrademark()

// 在当前页改变的时候重新请求列表数据
function currentChangeHandler(value: number) {
  page.value = value
  getTrademark()
}

// 当每页条数改变时重新请求
function sizeChange(value: number) {
  limit.value = value
  getTrademark()
}

// 删除单个品牌
async function deleteUser(id: string) {
  await reqDeleteTrademarkItem(id),
    getTrademark()
}

// 是否显示对话框或者编辑
function ShowDialog(data?: trademarkDataType) {
  isShowDialog.value = true
  if (data) {
    addTrademarkItem.value = { ...data }
    DialogTitle.value = '修改'
  } else {
    addTrademarkItem.value = {
      tmName: '',
      logoUrl: ''
    },
    DialogTitle.value = '添加'
  }

  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

// 添加品牌
async function addTrademark() {

  try {
    // 调用 formRef.value.validate() 方法来对这个表单中指定的数据（model、rules）进行校验
    await formRef.value.validate()
    // 编辑
    if ((addTrademarkItem.value as editTrademarkItemType).id) {
      await reqCancelTrademarkItem(addTrademarkItem.value as editTrademarkItemType)
      isShowDialog.value = false
      getTrademark()
      ElMessage.success('修改成功')
    } else {
      // 添加
      await reqAddTrademarkItem(addTrademarkItem.value)
      isShowDialog.value = false
      page.value = Math.ceil((total.value + 1) / limit.value)
      getTrademark()
      ElMessage.success('添加成功')
    }

  } catch (e) {
      ElMessage.success(`${DialogTitle}失败`)
  }

}

// 对话框的取消按钮
function closeAdd() {
  isShowDialog.value = false
}

// 上传图片前的回调
function beforeUpload(rawFile: UploadRawFile) {
  if (["image/png", "image/jpg", "image/gif", 'image/jpeg'].includes(rawFile.type)) {

    return true;
  } else {
    return false
  }
}

// 品牌图片缩略图
//response: 上传接口返回的数据
//uploadFile: 当前上传的文件的信息
//uploadFiles：已经上传的文件信息（包含当前这一个文件）
function addTrademarkLogoUrl(response: { code: number, data: string }, uploadFile: UploadFile, uploadFiles: UploadFiles) {
  if (response.code === 200) {
    addTrademarkItem.value.logoUrl = response.data
  }

}




</script>


<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>