/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/charts',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Charts',
  meta: {
    title: '图表',
    icon: 'chart'
  },
  children: [
    // {
    //   path: 'keyboard',
    //   component: () => import('@/views/charts/keyboard'),
    //   name: 'KeyboardChart',
    //   meta: { title: '华丽呼哨的页面', noCache: true }
    // },
    // {
    //   path: 'line',
    //   component: () => import('@/views/charts/line'),
    //   name: 'LineChart',
    //   meta: { title: '折线统计图', noCache: true }
    // },
    // {
    //   path: 'mix-chart',
    //   component: () => import('@/views/charts/mix-chart'),
    //   name: 'MixChart',
    //   meta: { title: '柱状统计图', noCache: true }
    // },
    {
      path: 'my-chart1',
      component: () => import('@/views/excel/upload-excel.vue'),
      name: 'MyChart1',
      meta: { title: '个体效用值表格', noCache: true }
    },
    {
      path: 'my-chart2',
      component: () => import('@/views/excel/upload-excel2.vue'),
      name: 'MyChart2',
      meta: { title: '属性重要性', noCache: true }
    },
    {
      path: 'my-chart3',
      component: () => import('@/views/excel/upload-excel3.vue'),
      name: 'MyChart3',
      meta: { title: '个体效用值条形图', noCache: true }
    },
    {
      path: 'my-chart4',
      component: () => import('@/views/excel/upload-excel4.vue'),
      name: 'MyChart4',
      meta: { title: '男女生对比图', noCache: true }
    }
  ]
}

export default chartsRouter
