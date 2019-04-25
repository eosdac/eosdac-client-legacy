<template>
  <q-page class="q-pa-md">
    <vote-delegation />
    <!-- <abi-viewer /> -->
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
// import abiViewer from "components/controls/abi-viewer";
import voteDelegation from "components/controls/vote-delegation";

export default {
  name: "playground",
  components: {
    // abiViewer,
    voteDelegation
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
      // getEosApi: 'global/getEosApi'
    })
  },
  methods: {}
};
</script>

<style></style>
