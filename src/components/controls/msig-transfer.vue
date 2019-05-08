<template>
  <div class="row gutters-md">
    <div class="col-xs-12 col-lg-6">
      <div class="bg-bg1 round-borders shadow-5 q-pa-md">
        <q-select
          class="q-mb-md"
          v-model="from"
          stack-label="FROM"
          color="primary-light"
          :dark="getIsDark"
          :options="[
            { value: 'eosdacdoshhq', label: 'eosdacdoshhq' },
            { value: 'eosdacserval', label: 'eosdacserval' }
          ]"
          @input="from_balance = null"
        />
        <q-collapsible header-class="no-padding" @show="renderChart">
          <template slot="header">
            <q-chip color="primary" small class="q-mr-sm">
              <xspan :value="from_balance" />
            </q-chip>
            <q-item-main label="" />
            <q-item-side right>
              <q-icon name="mdi-chart-line" color="text1" size="24px" />
            </q-item-side>
          </template>
          <div>
            <balance-timeline
              ref="balance"
              :account="from"
              :contract="this.$configFile.get('systemtokencontract')"
              :symbol="this.$configFile.get('systemtokensymbol')"
              :show_balance="false"
              @onbalance="from_balance = $event"
            />
          </div>
        </q-collapsible>
      </div>
    </div>
  </div>
</template>

<script>
import balanceTimeline from "components/ui/balance-timeline";
import xspan from "components/ui/xspan";
import { mapGetters } from "vuex";
export default {
  name: "msigTransfer",
  components: {
    balanceTimeline,
    xspan
  },
  data() {
    return {
      from: "eosdacserval",
      to: "piecesnbitss",
      quantity: "1.0000 EOS",
      memo: "this is the memo",

      from_balance: null
    };
  },
  computed: {
    ...mapGetters({
      getIsDark: "ui/getIsDark",
      getAccountName: "user/getAccountName",
      getAccount: "user/getAccount"
    })
  },
  methods: {
    renderChart() {
      setTimeout(() => {
        this.$refs.balance.$refs.linechart.render();
      }, 100);
    }
  },
  mounted() {
    console.log("xxxxxxxxxxxxxxx", this.$refs.balance.$refs.linechart);
  }
};
</script>

<style></style>
