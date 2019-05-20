<template>
  <div class="bg-bg1 round-borders shadow-5 overflow-hidden full-height">
    <div
      class="q-pa-sm row justify-between items-center bg-primary"
      style="height:50px"
    >
      <span class="uppercase">{{ accountname }}</span>
      <xspan class="q-caption" :value="balance" />
      <help-btn
        :content="description"
        :title="accountname"
        color="text1"
        size="sm"
      />
    </div>
    <q-select
      class="no-padding q-ml-xs animate-fade"
      hide-underline
      filter
      autofocus-filter
      v-model="selected_token"
      color="primary-light"
      :dark="getIsDark"
      placeholder="token"
      :options="tokens"
    />
    <div class="q-pa-md">
      <balance-timeline
        :responsive="true"
        :height="230"
        ref="balance"
        :account="accountname"
        :contract="selected_token.contract"
        :symbol="selected_token.symbol"
        :show_balance="false"
        :legend="false"
        @onbalance="balance = $event"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import balanceTimeline from "components/ui/balance-timeline";
import helpBtn from "components/controls/help-btn";
import xspan from "components/ui/xspan";

export default {
  name: "financialAccount",
  components: {
    balanceTimeline,
    helpBtn,
    xspan
  },
  props: {
    accountname: "",
    default_symbol: "",
    defaut_contract: "",
    description: ""
  },
  data() {
    return {
      tokens: [],
      selected_token: "",
      balance: null
    };
  },
  computed: {
    ...mapGetters({
      getIsDark: "ui/getIsDark"
    })
  },
  methods: {
    async setTokens() {
      if (!this.accountname) return;
      let tokens = await this.$axios.get(
        `${this.$configFile.get("memberclientstateapi")}/tokens_owned?account=${
          this.accountname
        }`
      );
      if (tokens.data.results) {
        tokens = tokens.data.results.map(t => {
          return {
            image: t.logo || "",
            value: t,
            label: t.symbol,
            sublabel: t.contract,
            stamp: `${t.precision}`,
            rightTextColor: "blue"
          };
        });

        this.selected_token = tokens.find(
          t => t.value.symbol == "EOS" && t.value.contract == "eosio.token"
        ).value;
        console.log(this.selected_token);
        this.tokens = tokens;
      }
    }
  },
  mounted() {
    this.setTokens();
  }
};
</script>

<style></style>
