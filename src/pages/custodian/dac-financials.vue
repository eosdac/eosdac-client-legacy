<template>
  <q-page class="q-pa-md">
    <p class="text-text2">
      The following EOS accounts represent value flow over time within the DAC
      and can be useful for budgeting and decision making.
    </p>
    <div class="row gutter-sm">
      <div class="col-xs-12 col-lg-6">
        <div class="bg-bg1 q-pa-md round-borders shadow-5">
          <balance-timeline
            :account="this.$configFile.get('bpaccount')"
            :contract="this.$configFile.get('systemtokencontract')"
            :symbol="this.$configFile.get('systemtokensymbol')"
            description="The EOS Mainnet block producer account for eosDAC which receives Block Producer rewards."
          />
        </div>
      </div>

      <div class="col-xs-12 col-lg-6">
        <div class="bg-bg1 q-pa-md round-borders shadow-5">
          <balance-timeline
            :account="this.$configFile.get('treasuryaccount')"
            :contract="this.$configFile.get('systemtokencontract')"
            :symbol="this.$configFile.get('systemtokensymbol')"
            description="The DAC owner account where DAC funds are secured and controlled by a 12-account multisig permission system of elected custodians."
          />
        </div>
      </div>
      <div class="col-xs-12 col-lg-6">
        <div class="bg-bg1 q-pa-md round-borders shadow-5">
          <balance-timeline
            :account="`dacocoiogmbh`"
            :contract="this.$configFile.get('systemtokencontract')"
            :symbol="this.$configFile.get('systemtokensymbol')"
            description="The current eosDAC service provider account which manages payroll, employment contracts, and real-world interactions on behalf of the DAC."
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import balanceTimeline from "components/ui/balance-timeline";

export default {
  name: "dacFinancials",
  components: {
    balanceTimeline
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      // getEosApi: 'global/getEosApi'
    })
  }
};
</script>

<style></style>
