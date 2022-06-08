import request from '@/utils/request'

export function queryAccountBlockList(data) {
  return request({
    url: '/compute/Compute/queryAccountBlockList',
    method: 'post',
    data
  })
}

export function queryAccountBalance(data) {
  return request({
    url: '/compute/Compute/queryAccountBalance',
    method: 'post',
    data
  })
}
