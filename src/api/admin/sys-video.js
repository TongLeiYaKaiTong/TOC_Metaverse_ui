import request from '@/utils/request'

// 查询SysApi列表
export function listVideoApi(query) {
  return request({
    url: '/api/v1/sys-video',
    method: 'get',
    params: query
  })
}
