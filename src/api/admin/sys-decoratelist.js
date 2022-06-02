import request from '@/utils/request'

// 查询妆扮
export function listDecorateApi(query) {
  return request({
    url: '/api/v1/sys-decorate',
    method: 'get',
    params: query
  })
}

// 上传
export function uploadDecorateApi(query) {
  return request({
    url: '/api/v1/sys-decorate/upload',
    method: 'post',
    data: query
  })
}

// 修改
export function updateDecorateApi(query) {
  return request({
    url: '/api/v1/sys-decorate/update',
    method: 'post',
    data: query
  })
}

// 启停
export function statusDecorateApi(query) {
  return request({
    url: '/api/v1/sys-decorate/status',
    method: 'post',
    data: query
  })
}

// 删除
export function deleteDecorateApi(query) {
  return request({
    url: '/api/v1/sys-decorate/delete',
    method: 'post',
    data: query
  })
}
