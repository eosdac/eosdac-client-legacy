
import Guards from './guards';

let routes_extension;
try{
  routes_extension = require('../extensions/router/routes').default;
}
catch(e){
  routes_extension = [];
}


const routes = [
  ...routes_extension,
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
      { path: 'manage-candidateship', component: () => import('pages/manage-candidateship.vue') },
      { path: 'verify/:token', component: () => import('pages/verify-token')},
      
    ]
  },

  {
    path: '/dev-tools',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/home') },
      { path: 'memberclient', component: () => import('pages/dev/dev-tools-home') },
      { path: 'playground', component: () => import('pages/dev/playground') },
      { path: 'transactions', component: () => import('pages/dev/transactions') }

    ]
  },
  
  {
    path: '/custodian',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/home') },
      { path: 'review-msigs', component: () => import('pages/custodian/review-msigs') },
      { path: 'create-msigs', component: () => import('pages/custodian/create-msigs'), beforeEnter: Guards.custodianCheck},
      { path: 'review-worker-proposals', component: () => import('pages/custodian/review-worker-proposals') },
      { path: 'my-payments', component: () => import('pages/custodian/my-payments'), beforeEnter: Guards.custodianCheck },
      { path: 'dac-financials', component: () => import('pages/custodian/dac-financials') }      
    ]
    
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
