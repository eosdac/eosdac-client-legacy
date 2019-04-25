<template>
  <q-page class="q-pa-md">
    <q-btn label="test" @click="test" />
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "myWorkerProposals",
  computed: {
    ...mapGetters({
      getAccountName: "user/getAccountName",
      getIsDark: "ui/getIsDark",
      getSettingByName: "user/getSettingByName",
      getEosApi: "global/getEosApi"
    })
  },
  data() {
    return {};
  },
  methods: {
    async test() {
      let wps = await this.getEosApi.getWps({
        account: this.getAccountName,
        dac_scope: this.$configFile.get("authaccountname")
      });
      console.log(wps);
    }
  }
};
</script>

<style></style>
