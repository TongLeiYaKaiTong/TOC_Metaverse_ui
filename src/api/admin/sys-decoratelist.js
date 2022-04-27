import request from '@/utils/request'

// 查询妆扮分类
export function listDecorateApi(query) {
  return request({
    url: '/api/v1/sys-decoratelist',
    method: 'get',
    params: query
  })
}

// 新增SysApi
export function addDecorateApi(data) {
  return request({
    url: '/api/v1/sys-decoratelist',
    method: 'post',
    data: data
  })
}

// 修改SysApi
export function updateDecorateApi(data) {
  return request({
    url: '/api/v1/sys-decoratelist/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除SysApi
export function delDecorateApi(data) {
  return request({
    url: '/api/v1/sys-decoratelist',
    method: 'delete',
    data: data
  })
}

