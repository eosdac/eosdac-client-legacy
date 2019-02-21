import store from '../store'

const Guards = {
  logInCheck (to, from, next) {
    if (!store.getters['user/getAccountName']) {
      next({ path: '' })
    } else {
      next()
    }
  },
  custodianCheck (to, from, next) {
    let isCustodian = store.getters['user/getIsCustodian'];
    if (!isCustodian) {
      next({path: ''});
    } else {
      next();
    }
  }
};

const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/index-loggedout') },
      { path: 'settings', component: () => import('pages/settings.vue') },
      { path: 'constitution', component: () => import('pages/constitution.vue') },
      { path: 'vote-custodians', component: () => import('pages/vote-custodians.vue') },
      { path: 'profile/:accountname', component: () => import('pages/profile') },
      { path: 'credits', component: () => import('pages/credits.vue') },
      { path: 'dev-tools', component: () => import('pages/dev/dev-tools-home') },
      { path: 'manage-candidateship', component: () => import('pages/manage-candidateship.vue') },
      { path: 'verify/:token', component: () => import('pages/verify-token')},
      
    ]
  },
  {
    path: '/custodian',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/index-loggedout') },
      { path: 'msig-proposals', component: () => import('pages/custodian/msig-proposals') },
      { path: 'my-payments', component: () => import('pages/custodian/my-payments') }
      
    ],
    beforeEnter: Guards.custodianCheck
    
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
