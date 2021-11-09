

 const layouts = [
    {
    path: '/',
    component: resolve => {
      require(['@/views/layout.vue'], resolve)
    },
    children: [{
      path: '',
      name: 'home',
      meta:{
        title:'首页',
        auth: true
      },
      component: resolve => {
        require(['@/views/home/index.vue'], resolve)
      },
    },{
      path: '/events',
      name: 'events',
      meta:{
        title:'事件监控',
        auth: true
      },
      component: resolve => {
        require(['@/views/events/index.vue'], resolve)
      },
    },{
      path: '/flow',
      name: 'flow',
      meta:{
        title:'交通参数',
        auth: true
      },
      component: resolve => {
        require(['@/views/flow/index.vue'], resolve)
      },
    },{
      path: '/statistics',
      name: 'statistics',
      meta:{
        title:'统计分析',
        auth: true
      },
      component: resolve => {
        require(['@/views/statistics/index.vue'], resolve)
      },
    },{
      path: '/feedbacks',
      name: 'feedbacks',
      meta:{
        title:'意见反馈',
        auth: true
      },
      component: resolve => {
        require(['@/views/feedbacks/index.vue'], resolve)
      },
    },{
      path: '/monitor',
      name: 'monitor',
      meta:{
        title:'系统状态',
        auth: true
      },
      component: resolve => {
        require(['@/views/monitor/index.vue'], resolve)
      },
    },{
      path: '/correct',
      name: 'correct',
      meta:{
        title:'相机预置点校准',
        auth: true
      },
      component: resolve => {
        require(['@/views/correct/index.vue'], resolve)
      },
    }]
  },
  {
    path: '/login',
    name: 'login',
    meta:{
      title:'事件监控',
      auth: false
    },
    component: resolve => {
      require(['@/views/login/index.vue'], resolve)
    },
  },
]
const routes = [...layouts]
export default routes
