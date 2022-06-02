import request from '@/utils/request'

// 妆扮分类下拉数据
export function optionCategoryApi(query) {
  return request({
    url: '/api/v1/sys-decorate/category/query',
    method: 'get',
    params: query
  })
}

// 查询妆扮分类
export function listCategoryApi(query) {
  return request({
    url: '/api/v1/sys-decorate/category',
    method: 'get',
    params: query
  })
}

// 上传
export function uploadCategoryApi(query) {
  return request({
    url: '/api/v1/sys-decorate/category/upload',
    method: 'post',
    data: query
  })
}

// 修改
export function updateCategoryApi(query) {
  return request({
    url: '/api/v1/sys-decorate/category/update',
    method: 'post',
    data: query
  })
}

// 启停
export function statusCategoryApi(query) {
  return request({
    url: '/api/v1/sys-decorate/category/status',
    method: 'post',
    data: query
  })
}

// 删除
export function deleteCategoryApi(query) {
  return request({
    url: '/api/v1/sys-decorate/category/delete',
    method: 'post',
    data: query
  })
}
