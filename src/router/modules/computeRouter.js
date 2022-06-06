/** When your routing dmdb is too long, you can split it into small modules **/

import Layout from '@/layout'

const computeRouter = {
  path: '/compute',
  component: Layout,
  redirect: '/compute/account',
  name: 'Compute',
  meta: {
    title: 'Compute',
    icon: 'nested'
  },
  children: [
    {
      path: 'account',
      component: () => import('@/views/compute/account'),
      name: 'Account',
      meta: { title: '账户' },
      children: [
        {
          path: 'queryPage',
          component: () => import('@/views/compute/account/queryPage'),
          name: 'QueryPage',
          meta: {
            title: '账户查询',
            icon: 'search'
          }
        },
        {
          path: 'add',
          component: () => import('@/views/compute/account/add'),
          name: 'Add',
          hidden: true,
          meta: { title: '应用新增' }
        },
        {
          path: 'modify',
          component: () => import('@/views/compute/account/modify'),
          name: 'Modify',
          hidden: true,
          meta: { title: '应用修改' }
        }
      ]
    }
  ]
}

export default computeRouter
