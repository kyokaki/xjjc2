import request from '@/utils/request'

export function addPlaybookConfig(data) {
  return request({
    url: '/dev-ops/PlaybookConfig/add',
    method: 'post',
    data
  })
}
