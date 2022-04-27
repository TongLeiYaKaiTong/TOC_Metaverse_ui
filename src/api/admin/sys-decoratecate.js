import request from '@/utils/request'

// 查询妆扮分类
export function listCateApi(query) {
  return request({
    url: '/api/v1/sys-cate',
    method: 'get',
    params: query
  })
}

// 新增SysApi
export function addCateApi(data) {
  return request({
    url: '/api/v1/sys-cate',
    method: 'post',
    data: data
  })
}

// 修改SysApi
export function updateCateApi(data) {
  return request({
    url: '/api/v1/sys-cate/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除SysApi
export function delCateApi(data) {
  return request({
    url: '/api/v1/sys-cate',
    method: 'delete',
    data: data
  })
}

