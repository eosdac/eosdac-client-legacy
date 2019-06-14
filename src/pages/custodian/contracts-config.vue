<template>
  <q-page class="q-pa-md">
    <div
      class="q-pa-md round-borders bg-bg1 bg-logo shadow-4 row"
      style="min-height:200px"
    >
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
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import contractSettings from "components/controls/contract-settings";

export default {
  name: "playground",
  components: {
    contractSettings
  },
  data() {
    return {
      selected_contract: this.$configFile.get("custodiancontract")
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
