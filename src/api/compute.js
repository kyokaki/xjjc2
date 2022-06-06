import request from '@/utils/request'

export function queryAccountBlockList(data) {
  return request({
    url: '/compute/Compute/queryAccountBlockList',
    method: 'post',
    data
  })
}
