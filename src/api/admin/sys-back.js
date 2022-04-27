import request from '@/utils/request'

// 查询SysApi列表
export function listBackApi(query) {
  return request({
    url: '/api/v1/sys-background',
    method: 'get',
    params: query
  })
}

// 查询SysApi详细
export function getBackApi(id) {
  return request({
    url: '/api/v1/sys-background/' + id,
    method: 'get'
  })
}

// 新增SysApi
export function addBackApi(data) {
  return request({
    url: '/api/v1/sys-background',
    method: 'post',
    data: data
  })
}

// 修改SysApi
export function updateBackApi(data) {
  return request({
    url: '/api/v1/sys-background/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除SysApi
export function delBackApi(data) {
  return request({
    url: '/api/v1/sys-background',
    method: 'delete',
    data: data
  })
}

