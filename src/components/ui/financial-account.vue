<template>
  <div class="bg-bg1 round-borders shadow-5 overflow-hidden full-height ">
    <!-- {{ selected_token }} -->
    <div
      class="q-pa-sm row justify-between items-center bg-primary "
      style="height:50px"
    >
      <q-select
        v-if="tokens"
        class="no-padding q-ml-xs animate-fade"
        hide-underline
        filter
        autofocus-filter
        v-model="selected_token"
        color="primary-light"
        :dark="getIsDark"
        placeholder="token"
        :options="tokens"
        @input="handleTokenSelection"
      />
      <span class="">{{ accountname }}</span>
      <help-btn
        :content="description"
        :title="accountname"
        color="text1"
        size="sm"
      />
    </div>

    <div class="q-pa-md relative-position">
      <xspan
        class="q-caption absolute-right q-mr-md q-mt-sm text-text2"
        :value="balance"
      />
      <balance-timeline
        class="q-mt-xs"
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
    description: "",
    default_symbol: {
      type: String,
      default: "EOS"
    },
    default_contract: {
      type: String,
      default: "eosio.token"
    }
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
      let tokens = {};
      try {
        tokens = await this.$axios.get(
          `${this.$configFile.get(
            "memberclientstateapi"
          )}/tokens_owned?account=${this.accountname}`
        );
      } catch (e) {
        console.log(e);
      }

      if (tokens.data && tokens.data.results) {
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
        this.tokens = tokens;
      } else {
        this.tokens.push({
          value: {
            contract: this.default_contract,
            symbol: this.default_symbol
          },
          label: this.default_symbol
        });
      }

      this.selected_token = this.tokens.find(
        t =>
          t.value.symbol == this.default_symbol &&
          t.value.contract == this.default_contract
      ).value;
    },
    handleTokenSelection(v) {
      this.balance = null;
    }
  },
  mounted() {
    this.setTokens();
  }
};
</script>

<style></style>
