export default [
  {path: '/', name: '主页', icon: 'smile', component: './Index'},
  {path: '/interface_info/:id', name: '查看接口', icon: 'smile', component: './interfaceInfo', hideInMenu: true},
  {
    path: '/user',
    layout: false,
    routes: [{name: '登录', path: '/user/login', component: './user/login'}],
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {name: '接口管理', icon: 'table', path: '/admin/interface_info', component: './admin/InterfaceInfo'},
      {name: '接口分析', icon: 'analysis', path: '/admin/interface_analysis', component: './admin/InterfaceAnalysis'},
    ],
  },
  // {path: '/', redirect: '/welcome'},
  {path: '*', layout: false, component: './404'},
];
