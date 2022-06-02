import request from '@/utils/request'

// 查询SysApi列表
export function listVideoApi(query) {
  return request({
    url: '/api/v1/sys-video',
    method: 'get',
    params: query
  })
}

// 删除
export function deleteVideoApi(data) {
  return request({
    url: '/api/v1/sys-video/delete',
    method: 'post',
    data: data
  })
}

