<template>
  <q-page class="q-pa-md">
    <!-- <vote-delegation /> -->
    <!-- <abi-viewer /> -->
    <!-- <msig-transfer /> -->
    <div class="q-pa-md round-borders bg-bg1 bg-logo shadow-4">
      <q-select
        class="q-mb-md"
        stack-label="Select contract"
        color="primary-light"
        dark
        v-model="selected_contract"
        :options="getContractOptions()"
      />
      <contract-settings :contract="selected_contract" />
    </div>
    <app-manifest />
    <table-parser />
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
// import abiViewer from "components/controls/abi-viewer";
// import voteDelegation from "components/controls/vote-delegation";
import contractSettings from "components/controls/contract-settings";
import appManifest from "components/controls/app-manifest";
import tableParser from "components/controls/table-parser";

export default {
  name: "playground",
  components: {
    // abiViewer,
    // voteDelegation,
    tableParser,
    appManifest,
    contractSettings
  },
  data() {
    return {
      abi: "",
      wasm: "",
      test: "",
      selected_contract: ""
    };
  },
  computed: {
    ...mapGetters({
      // getDacApi: 'global/getDacApi'
    })
  },
  methods: {
    getContractOptions() {
      let contracts = [
        this.$configFile.get("custodiancontract"),
        this.$configFile.get("wpcontract")
      ];
      return contracts.map(c => {
        return { value: c, label: c };
      });
    }
  }
};
</script>
