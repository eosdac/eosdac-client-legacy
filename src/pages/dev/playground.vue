<template>
  <q-page class="q-pa-md">
    <!-- <vote-delegation /> -->
    <!-- <abi-viewer /> -->
    <!-- <msig-transfer /> -->
    <contract-settings />
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
// import abiViewer from "components/controls/abi-viewer";
// import voteDelegation from "components/controls/vote-delegation";
import contractSettings from "components/controls/contract-settings";
// import msigTransfer from "components/controls/msig-transfer";

export default {
  name: "playground",
  components: {
    // abiViewer,
    // voteDelegation,
    // msigTransfer,
    contractSettings
  },
  data() {
    return {
      abi: "",
      wasm: "",
      test: ""
    };
  },
  computed: {
    ...mapGetters({
      // getDacApi: 'global/getDacApi'
    })
  },
  methods: {}
};
</script>
