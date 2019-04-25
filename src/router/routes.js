import Guards from "./guards";

let routes_extension;
try {
  routes_extension = require("../extensions/router/routes").default;
} catch (e) {
  routes_extension = [];
}

let routes = [
  {
    path: "/",
    component: () => import("layouts/MyLayout.vue"),
    children: [
      { path: "", component: () => import("../extensions/pages/home") },
      {
        path: "dashboard",
        component: () => import("pages/dashboard"),
        beforeEnter: Guards.logInCheck
      },
      { path: "settings", component: () => import("pages/settings.vue") },
      {
        path: "constitution",
        component: () => import("pages/constitution.vue")
      },
      {
        path: "vote-custodians",
        component: () => import("pages/vote-custodians.vue")
      },
      {
        path: "profile/:accountname",
        component: () => import("pages/profile")
      },
      {
        path: "manage-candidateship",
        component: () => import("pages/manage-candidateship.vue")
      }
    ]
  },

  {
    path: "/dev-tools",
    component: () => import("layouts/MyLayout.vue"),
    children: [
      { path: "", component: () => import("../extensions/pages/home") },
      {
        path: "memberclient",
        component: () => import("pages/dev/dev-tools-home")
      },
      { path: "playground", component: () => import("pages/dev/playground") },
      {
        path: "transactions",
        component: () => import("pages/dev/transactions")
      }
    ]
  },

  {
    path: "/custodian",
    component: () => import("layouts/MyLayout.vue"),
    children: [
      { path: "", component: () => import("../extensions/pages/home") },
      {
        path: "review-msigs",
        component: () => import("pages/custodian/review-msigs")
      },
      {
        path: "create-msigs",
        component: () => import("pages/custodian/create-msigs"),
        beforeEnter: Guards.custodianCheck
      },
      {
        path: "review-worker-proposals",
        component: () => import("pages/custodian/review-worker-proposals")
      },
      {
        path: "my-payments",
        component: () => import("pages/custodian/my-payments"),
        beforeEnter: Guards.custodianCheck
      },
      {
        path: "dac-financials",
        component: () => import("pages/custodian/dac-financials")
      }
    ]
  },

  {
    path: "/member",
    component: () => import("layouts/MyLayout.vue"),
    children: [
      { path: "", component: () => import("../extensions/pages/home") },
      {
        path: "new-worker-proposal",
        component: () => import("pages/member/new-worker-proposal")
      },
      {
        path: "my-worker-proposals",
        component: () => import("pages/member/my-worker-proposals")
      }
    ],
    beforeEnter: Guards.memberCheck
  }
];

//extend the default routes and overwrite when same paths
routes_extension.forEach(re => {
  let existing_path = routes.find(r => r.path.trim() == re.path.trim());
  if (existing_path) {
    re.children.forEach(rep => {
      let i = existing_path.children.findIndex(
        ep => ep.path.trim() == rep.path.trim()
      );
      if (i === -1) {
        existing_path.children.push(rep);
      } else {
        existing_path.children[i] = rep;
      }
    });
  } else {
    routes.push(re);
  }
});

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
