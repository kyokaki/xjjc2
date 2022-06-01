/** When your routing dmdb is too long, you can split it into small modules **/

import Layout from '@/layout'

const computeRouter = {
  path: '/compute',
  component: Layout,
  redirect: '/compute/application',
  name: 'ComputeCoin',
  meta: {
    title: 'ComputeCoin',
    icon: 'nested'
  },
  children: [
    {
      path: 'idcCenter',
      component: () => import('@/views/compute/application'), // Parent router-view
      name: 'IdcCenter',
      meta: { title: '数据中心机房' },
      children: [
        {
          path: 'application',
          component: () => import('@/views/compute/application'),
          name: 'Application',
          meta: { title: '应用' },
          children: [
            {
              path: 'queryPage',
              component: () => import('@/views/compute/application/queryPage'),
              name: 'QueryPage',
              meta: {
                title: '应用查询',
                icon: 'qq'
              }
            },
            {
              path: 'add',
              component: () => import('@/views/compute/application/add'),
              name: 'Add',
              hidden: true,
              meta: { title: '应用新增' }
            },
            {
              path: 'modify',
              component: () => import('@/views/compute/application/modify'),
              name: 'Modify',
              hidden: true,
              meta: { title: '应用修改' }
            }
          ]
        }
      ]
    }
  ]
}

export default computeRouter
