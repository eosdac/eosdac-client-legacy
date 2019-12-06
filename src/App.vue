<template>
  <div id="q-app">
    <router-view />
    <q-ajax-bar position="left" color="primary-light" size="3px" />
    <sleep-handler />
  </div>
</template>

<script>
import { Notify } from "quasar";
import NodeSelector from "./modules/nodeselector.js";
import sleepHandler from "components/controls/sleep-handler";

export default {
  name: "App",
  components: {
    sleepHandler
  },

  data() {
    return {
      leftDrawerOpen: true,
      loading: true
    };
  },
  methods: {
    checkVersionChange() {
      //check if localstorage needs an update
      let stored_version = this.$store.getters[
        "global/getLocal_storage_version"
      ];
      let pj = require("../package.json");
      const version = pj.local_storage_version;

      this.$store.commit("global/setDapp_version", pj.version); //store the app version too

      if (stored_version === null) {
        console.log(`Loaded LS v${version} for the first time`);
        Notify.create({
          message: `You're ready. Loaded Memberclient v${version}`,
          timeout: 2500,
          type: "info",
          position: "bottom-right"
        });
        this.$store.commit("global/setLocal_storage_version", version);
        return;
      }

      if (stored_version != version) {
        console.log(`Update detected. New LS Version ${version}`);
        Notify.create({
          message: `Detected new LS version v${version}`,
          detail: `The memberclient will auto reload`,
          timeout: 4000,
          type: "info",
          position: "bottom-right"
        });
        setTimeout(this.clearLocalStorage, 4000);
      }
    },

    clearLocalStorage() {
      window.localStorage.clear();
      window.location.reload();
    }
  },

  async mounted() {
    let test = await this.$store.dispatch("global/testEndpoint", false);

    if (test === false) {
      const NS = new NodeSelector(this.$configFile.get("bpnodeapi"));
      let fastest = await NS.get_fastest_node();
      // console.log(fastest)
      this.$store.commit("global/setNode", fastest.node);
    }
    this.loading = true;
    this.$store.dispatch("dac/initRoutine", this);

    // this.$root.$emit('helloc');
    await this.$store.dispatch("global/connectScatter");
    this.loading = false;
    this.checkVersionChange();
  },

  meta() {
    return {
      title: this.$t("meta.title", {
        dacName: this.$configFile.get("dacname")
      }),
      noscript: {
        default: this.$t("meta.noscript")
      }
    };
  },

  watch: {
    "$route.query.theme": function(v) {
      console.log(v);
      if (v) {
        this.$store.dispatch("ui/loadTheme", JSON.parse(v));
      }
    }
  }
};
</script>
