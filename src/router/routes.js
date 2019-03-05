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
  },
  memberCheck (to, from, next) {
    let status = store.getters['user/getMemberStatus'];
    if (status !== 'member') {
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
      { path: '', component: () => import('pages/home') },
      { path: 'dashboard', component: () => import('pages/dashboard'), beforeEnter: Guards.logInCheck },
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
      { path: '', component: () => import('pages/home') },
      { path: 'review-msigs', component: () => import('pages/custodian/review-msigs') },
      { path: 'create-msigs', component: () => import('pages/custodian/create-msigs') },
      { path: 'review-worker-proposals', component: () => import('pages/custodian/review-worker-proposals') },
      { path: 'my-payments', component: () => import('pages/custodian/my-payments') }
      
    ],
    beforeEnter: Guards.custodianCheck
  },

  {
    path: '/member',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/home') },
      { path: 'new-worker-proposal', component: () => import('pages/member/new-worker-proposal') },
      { path: 'my-worker-proposals', component: () => import('pages/member/my-worker-proposals') },
    ],
    beforeEnter: Guards.memberCheck
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
