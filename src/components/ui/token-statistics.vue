<template>
  <div>
    <div class="row gutter-sm">
      <div class="col-xs-12 col-md-4">
        <div class="bg-bg1 round-borders shadow-4 q-pa-md full-height">
          <div v-if="market_data">
            <div>value {{ market_data.current_price.usd.toFixed(4) }} USD</div>
            <div v-if="market_data.price_change_percentage_24h >= 0">
              <span class="text-positive">
                +{{ market_data.price_change_percentage_24h }}%</span
              >
              (24h)
            </div>
            <div v-else>
              <span class="text-negative">
                {{ market_data.price_change_percentage_24h }}%</span
              >
              (24h)
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-md-4">
        <div class="bg-bg1 round-borders shadow-4 q-pa-md full-height">
          <pre>{{ $configFile.configFile.contracts.token }}</pre>
        </div>
      </div>
      <div class="col-xs-12 col-md-4">
        <div class="bg-bg1 round-borders shadow-4 q-pa-md full-height">
          ddddd
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  // name: 'ComponentName',
  components: {},
  data() {
    return {
      membercounts: "",
      market_data: ""
    };
  },
  computed: {
    ...mapGetters({
      getCustodians: "dac/getCustodians",
      getAccountName: "user/getAccountName",
      getIsDark: "ui/getIsDark"
    }),
    getCustNames() {
      if (this.getCustodians) {
        return this.getCustodians.map(c => {
          return c.cust_name;
        });
      } else {
        return [];
      }
    }
  },
  async mounted() {
    this.membercounts = await this.$store.dispatch("dac/fetchMemberCounts");
    this.market_data = await this.$store.dispatch("dac/fetchTokenMarketData");
    // this.price_history = await this.$store.dispatch(
    //   "dac/fetchTokenHistoryPrice"
    // );
  }
};
</script>

<style></style>
