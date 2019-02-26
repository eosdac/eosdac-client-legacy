export default {
  //
  language: false,
  isLoaded: false,
  accountName:null,
  profilePicture:null,
  account: null,
  dacBalance: null,
  systemBalance: null,
  agreedTermsVersion: null,
  lastTransaction: null,
  isCandidate: null,
  dacVotes: null,
  msigIsSeenCache: [],
  settings: [
    { 
      name: 'toolbar_menu_items',
      type: 'boolean',
      label: 'Toolbar Menu Items',
      sublabel: 'Display balances in the toolbar. (big screens only)',
      value: true,
      group: 'toolbar'
    },
    { 
      name: 'toolbar_profile_image',
      type: 'boolean',
      label: 'Toolbar Profile Image',
      sublabel: 'Display your avatar next to the login button',
      value: true,
      group: 'toolbar'
    },
    { 
      name: 'toolbar_reveal',
      type: 'boolean',
      label: 'Hide Toolbar',
      sublabel: 'Hide toolbar when scrolling down',
      value: false,
      group: 'toolbar'
    },
    { 
      name: 'notify_dac_msg',
      type: 'boolean',
      label: 'Live DAC Notifications',
      sublabel: 'Enable live notifications from actions made on the DAC smart contracts',
      value: true,
      group: 'notify'
    },
    { 
      name: 'notify_success_msg',
      type: 'boolean',
      label: 'Success Notifications',
      sublabel: 'Enable success messages',
      value: true,
      group: 'notify'
    },
    { 
      name: 'notify_info_msg',
      type: 'boolean',
      label: 'Info Notifications',
      sublabel: 'Enable info messages',
      value: true,
      group: 'notify'
    },
    { 
      name: 'notify_error_msg',
      type: 'boolean',
      label: 'Error Notifications',
      sublabel: 'Enable error messages',
      value: true,
      group: 'notify'
    },

    { 
      name: 'debug_data_structure',
      type: 'boolean',
      label: 'Data Structures',
      sublabel: 'Display data structures on the bottom of each page',
      value: false,
      group: 'debug'
    },
    { 
      name: 'debug_dev_tools',
      type: 'boolean',
      label: 'Dev & Debug Tools',
      sublabel: 'debug and dev playyard',
      value: false,
      group: 'debug'
    },
    { 
      name: 'debug_console_log',
      type: 'boolean',
      label: 'Console Logging',
      sublabel: 'toggle logging messages to the browser console',
      value: false,
      group: 'debug'
    },
    
    { 
      name: 'locale_numbers',
      type: 'boolean',
      label: 'Localize Numbers',
      sublabel: 'Toggle number localization',
      value: true,
      group: 'locale'
    },
    { 
      name: 'locale_language',
      type: 'component',
      label: 'lang_selector.choose_your_language',
      value: 'langselector',
      group: 'locale'
    },
    { 
      name: 'trx_delay',
      type: 'number',
      label: 'Set a delay on transactions in seconds',
      value: 0,
      group: 'advanced'
    }
    
  ]

  
}
