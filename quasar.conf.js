// Configuration for your app

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      'config-loader',
      'axios',
      'i18n',
      'vuelidate',
      'helper',
      'idle-vue',
      'profile-cache',
      'iconfont-loader',
      'medium-editor'
      

    ],
    css: [
      'app.styl',
      'github-markdown.css',
      '~medium-editor/dist/css/medium-editor.min.css',
      'json-pretty-html.css'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons' // optional, you are not bound to it
      // 'ionicons',
      // 'mdi',
      // 'fontawesome'
    ],
    supportIE: false,
    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack(cfg) {
        cfg.resolve.extensions = [ ...cfg.resolve.extensions, '.json' ]

        cfg.module.rules.push({
          test: /\.json$/i,
          type: 'javascript/auto',
          loader: 'json-loader',
        })

        cfg.module.rules.push({
          resourceQuery: /blockType=i18n/,
          use: [
            {loader: '@kazupon/vue-i18n-loader'},
          ]
        })

        for (const rule of cfg.module.rules) {
          if (!rule.oneOf) continue
          for (const ruleOneOf of rule.oneOf) {
            ruleOneOf.use = ruleOneOf.use.filter(u => u.loader !== 'postcss-loader')
          }
        }
      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QListHeader',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QItemSeparator',
        'QItemTile',
        'QInput',
        'QToggle',
        'QColorPicker',
        'QSelect',
        'QPopover',
        'QBtnDropdown',
        'QSpinner',
        'QField',
        'QAjaxBar',
        'QScrollObservable',
        'QSpinnerOval',
        'QModal',
        'QTabs',
        'QTab',
        'QTabPane',
        'QRouteTab',
        'QProgress',
        'QSearch',
        'QPagination',
        'QCard',
        'QCollapsible',
        'QChip',
        'QScrollArea',
        'QCheckbox',
        'QCarousel',
        'QCarouselSlide',
        'QCarouselControl',
        'QStepper',
        'QStep',
        'QStepperNavigation',
        'QDatetimePicker',
        'QUploader'
        

      ],
      directives: [
        'Ripple',
        'CloseOverlay',
        'BackToTop'
      ],
      // Quasar plugins
      plugins: [
        'Notify',
        'Dialog'
      ],
      // iconSet: ctx.theme.mat ? 'material-icons' : 'ionicons'
      i18n: 'en-us' // Quasar language
    },
    // animations: 'all' --- includes all animations
    animations: ['fadeInDown', 'fadeOutUp', 'flipInX', 'flipOutX'],
    ssr: {
      pwa: false
    },
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack (cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
