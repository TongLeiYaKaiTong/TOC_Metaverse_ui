import request from '@/utils/request'

// 查询SysApi列表
export function listFeedApi(query) {
  return request({
    url: '/api/v1/sys-feed',
    method: 'get',
    params: query
  })
}

// 查询SysApi详细
export function getFeedApi(id) {
  return request({
    url: '/api/v1/sys-feed/' + id,
    method: 'get'
  })
}

// 新增SysApi
export function addFeedApi(data) {
  return request({
    url: '/api/v1/sys-feed',
    method: 'post',
    data: data
  })
}

// 修改SysApi
export function updateFeedApi(data) {
  return request({
    url: '/api/v1/sys-feed/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除SysApi
export function delFeedApi(data) {
  return request({
    url: '/api/v1/sys-feed',
    method: 'delete',
    data: data
  })
}

