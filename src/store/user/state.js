let settings = require("../../statics/settings.json");
// let extended_settings;
// try {
//   extended_settings = require("../../extensions/statics/config/settings.json");
// } catch (e) {
//   extended_settings = [];
// }

export default {
  //
  isIdle: null,
  language: false,
  isLoaded: false,
  accountName: null,
  profilePicture: null,
  account: null,
  dacBalance: null,
  systemBalance: null,
  agreedTermsVersion: null,
  lastTransaction: null,
  isCandidate: null,
  dacVotes: null,

  msigIsSeenCache: [],
  msigTransferQeue: [],

  settings: settings,
  catDelegations: null
};
