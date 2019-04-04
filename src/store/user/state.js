let settings;
try {
  settings = require("../../extensions/statics/config/settings.json");
} catch (e) {
  settings = [];
}

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

  settings: settings
};
