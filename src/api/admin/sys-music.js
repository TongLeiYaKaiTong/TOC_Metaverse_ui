import request from '@/utils/request'

// 查询MusicApi列表
export function listMusicApi(query) {
  return request({
    url: '/api/v1/sys-music',
    method: 'get',
    params: query
  })
}

// 查询MusicApi详细
export function getMusicApi(id) {
  return request({
    url: '/api/v1/sys-music/' + id,
    method: 'get'
  })
}

// 新增MusicApi
export function addMusicApi(data) {
  return request({
    url: '/api/v1/sys-music',
    method: 'post',
    data: data
  })
}

// 修改MusicApi
export function updateMusicApi(data) {
  return request({
    url: '/api/v1/sys-music/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除MusicApi
export function delMusicApi(data) {
  return request({
    url: '/api/v1/sys-music',
    method: 'delete',
    data: data
  })
}

