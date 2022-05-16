import request from '@/utils/request'

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

// 查询背景列表
export function listMusicApi(query) {
  return request({
    url: '/api/v1/sys-music',
    method: 'get',
    params: query
  })
}

// 上传背景
export function uploadMusicApi(query) {
  return request({
    url: '/api/v1/sys-music/upload',
    method: 'post',
    data: query
  })
}

// 禁用恢复
export function disableMusicApi(query) {
  return request({
    url: '/api/v1/sys-music/status',
    method: 'post',
    data: query
  })
}

// 删除
export function deleteMusicApi(query) {
  return request({
    url: '/api/v1/sys-music/delete',
    method: 'post',
    data: query
  })
}
