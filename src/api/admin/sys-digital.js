import request from '@/utils/request'

// 查询SysApi列表
export function listDigitalApi(query) {
  return request({
    url: '/api/v1/sys-digital',
    method: 'get',
    params: query
  })
}

// 查询SysApi详细
export function getDigitalApi(id) {
  return request({
    url: '/api/v1/sys-digital/' + id,
    method: 'get'
  })
}

// 新增SysApi
export function addDigitalApi(data) {
  return request({
    url: '/api/v1/sys-digital',
    method: 'post',
    data: data
  })
}

// 修改SysApi
export function updateDigitalApi(data) {
  return request({
    url: '/api/v1/sys-digital/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除SysApi
export function delDigitalApi(data) {
  return request({
    url: '/api/v1/sys-digital',
    method: 'delete',
    data: data
  })
}

