import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import global from "./global";
import user from "./user";
import dac from "./dac";
import ui from "./ui";

let store_extension;
try {
  store_extension = require("../extensions/store/store_extension").default;
} catch (e) {
  store_extension = {
    modules: {},
    plugins: []
  };
}

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    ...store_extension.modules,
    global,
    user,
    dac,
    ui
  },
  plugins: [
    ...store_extension.plugins,
    createPersistedState({
      key: "global",
      paths: [
        "global.active_network",
        "global.dapp_version",
        "global.local_storage_version"
      ]
    }),
    createPersistedState({
      key: "user",
      paths: ["user.settings", "user.language", "user.msigIsSeenCache"]
    })
  ]
});

export default store;
