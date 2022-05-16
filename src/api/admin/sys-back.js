import request from '@/utils/request'

// 查询背景列表
export function listBackApi(query) {
  return request({
    url: '/api/v1/sys-background',
    method: 'get',
    params: query
  })
}

// 上传背景
export function uploadBackApi(query) {
  return request({
    url: '/api/v1/sys-background/upload',
    method: 'post',
    data: query
  })
}

// 禁用恢复
export function disableBackApi(query) {
  return request({
    url: '/api/v1/sys-background/status',
    method: 'post',
    data: query
  })
}

// 删除
export function deleteBackApi(query) {
  return request({
    url: '/api/v1/sys-background/delete',
    method: 'post',
    data: query
  })
}
