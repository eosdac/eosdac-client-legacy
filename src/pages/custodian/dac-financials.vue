<template>
  <q-page class="q-pa-md">
    <p class="text-text2">
      The following EOS accounts represent value flow over time within the DAC
      and can be useful for budgeting and decision making.
    </p>

    <div class="row gutter-sm">
      <div
        v-for="(account, i) in financialaccounts"
        class="col-xs-12 col-sm-6 col-lg-4"
        :key="`fc${i}`"
      >
        <div class="bg-bg1 round-borders shadow-5 overflow-hidden">
          <div class="bg-primary q-pa-sm row justify-between items-center">
            <span class="uppercase">{{ account.account }}</span>
            <xspan class="q-caption" :value="account.balance" />
            <help-btn
              content="account.description"
              title="Title"
              color="text1"
              size="sm"
            />
          </div>
          <div class="q-pa-md">
            <balance-timeline
              :responsive="true"
              :height="200"
              ref="balance"
              :account="account.account"
              :contract="account.contract"
              :symbol="account.symbol"
              :show_balance="false"
              :legend="false"
              @onbalance="account.balance = $event"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import balanceTimeline from "components/ui/balance-timeline";
import helpBtn from "components/controls/help-btn";
import xspan from "components/ui/xspan";
export default {
  name: "dacFinancials",
  components: {
    balanceTimeline,
    helpBtn,
    xspan
  },
  data() {
    return {
      financialaccounts: [
        {
          account: this.$configFile.get("bpaccount"),
          contract: this.$configFile.get("systemtokencontract"),
          symbol: this.$configFile.get("systemtokensymbol"),
          balance: null,
          description:
            "The EOS Mainnet block producer account for eosDAC which receives Block Producer rewards."
        },
        {
          account: this.$configFile.get("treasuryaccount"),
          contract: this.$configFile.get("systemtokencontract"),
          symbol: this.$configFile.get("systemtokensymbol"),
          balance: null,
          description:
            "The DAC owner account where DAC funds are secured and controlled by a 12-account multisig permission system of elected custodians."
        },
        {
          account: "dacocoiogmbh",
          contract: this.$configFile.get("systemtokencontract"),
          symbol: this.$configFile.get("systemtokensymbol"),
          balance: null,
          description:
            "The current eosDAC service provider account which manages payroll, employment contracts, and real-world interactions on behalf of the DAC."
        }
      ]
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
