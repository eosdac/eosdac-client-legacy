<template>
  <div class="row gutter-sm">
    <div class="col-xs-12 col-lg-6">
      <div class="bg-bg1 round-borders shadow-5 q-pa-md">
        <q-field
          :error="$v.from.$error"
          error-label="Please enter a valid pay amount"
          icon="mdi-account-outline"
        >
          <q-select
            :value="from"
            stack-label="FROM"
            color="primary-light"
            :dark="getIsDark"
            :options="[
              { value: 'eosdacdoshhq', label: 'eosdacdoshhq' },
              { value: 'eosdacserval', label: 'eosdacserval' }
            ]"
            @change="handleFromChange"
          />
        </q-field>
        <q-collapsible header-class="no-padding" @show="renderChart">
          <template slot="header">
            <q-chip color="primary" small class="q-mr-sm">
              <xspan :value="from_balance" />
            </q-chip>
            <xspan :value="getPermission" />
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

    <div class="col-xs-12 col-lg-6">
      <div class="bg-bg1 round-borders shadow-5 q-pa-md">
        <q-field
          :error="$v.to.$error"
          error-label="Please enter a valid accountname"
          icon="mdi-account-outline"
        >
          <q-input stack-label="TO" v-model="to" :dark="getIsDark" />
        </q-field>
      </div>
    </div>

    <div class="col-xs-12 col-lg-6">
      <div class="bg-bg1 round-borders shadow-5 q-pa-md">
        <q-field
          :error="$v.quantity.$error"
          error-label="Please enter a valid pay amount"
          icon="icon-ui-19"
        >
          <div class="row no-wrap items-end">
            <q-input
              class="full-width"
              type="number"
              stack-label="QUANTITY"
              v-model="quantity"
              :dark="getIsDark"
            />
            <div class="on-right">{{ symbol }}</div>
          </div>
        </q-field>
      </div>
    </div>

    <div class="col-xs-12 col-lg-6">
      <div class="bg-bg1 round-borders shadow-5 q-pa-md">
        <q-field
          :error="$v.memo.$error"
          error-label="Memo can't be longer then 255 chars."
          icon="mdi-android-messages"
        >
          <q-input stack-label="MEMO" v-model="memo" :dark="getIsDark" />
        </q-field>
      </div>
    </div>

    <div class="col-xs-12">
      <div class="row justify-end">
        <q-btn color="primary" label="send" @click="proposeMsig" />
      </div>
    </div>
  </div>
</template>

<script>
import balanceTimeline from "components/ui/balance-timeline";
import xspan from "components/ui/xspan";
import { mapGetters } from "vuex";

import { required, maxLength } from "vuelidate/lib/validators";
import { isEosName } from "../../modules/validators.js";
export default {
  name: "msigTransfer",
  components: {
    balanceTimeline,
    xspan
  },
  data() {
    return {
      from: "eosdacserval",
      to: "",
      quantity: "",
      memo: "this is the memo",

      from_balance: null,
      from_permissions: null,
      symbol: "EOS",
      contract: "eosio.token"
    };
  },
  computed: {
    ...mapGetters({
      getIsDark: "ui/getIsDark",
      getAccountName: "user/getAccountName",
      getAccount: "user/getAccount",
      getEosApi: "global/getEosApi"
    }),
    getPermission: function() {
      if (!this.from_permissions) return null;
      const hasXfer = !!this.from_permissions.find(
        fp => fp.perm_name == "xfer"
      );
      return hasXfer ? `xfer` : `active`;
    }
  },
  methods: {
    renderChart() {
      setTimeout(() => {
        this.$refs.balance.$refs.linechart.render();
      }, 100);
    },
    async handleFromChange(v) {
      console.log(v);
      if (v == this.from) return;
      this.from_balance = null;
      this.from = v;
      this.setFromPermissions();
    },
    async setFromPermissions() {
      this.from_permissions = null;
      this.from_permissions = (await this.$store.dispatch("dac/fetchAccount", {
        accountname: this.from
      })).permissions;
    },
    async proposeMsig() {
      this.$v.$touch();
      let action = {
        account: this.contract,
        name: "transfer",
        data: {
          from: this.from,
          to: this.to,
          quantity: this.quantity + ` ${this.symbol}`,
          memo: this.memo
        },
        authorization: [
          {
            actor: this.from,
            permission: this.getPermission
          }
        ]
      };

      let res = await this.$store.dispatch("user/proposeMsig", {
        actions: [action]
      });
      if (res) {
        console.log(res);
      }
    }
  },
  async mounted() {
    this.setFromPermissions();
  },

  validations: {
    // wp_data: {
    //   arbitrator: { required, isEosName },
    //   title: { required },
    //   pay_amount: {
    //     required,
    //     minValue: minValue(0)
    //   },
    //   category: { required }
    // }
    from: { required, isEosName },
    to: { required, isEosName },
    quantity: { required },
    memo: { maxLength: maxLength(255) }
  }
};
</script>

<style></style>
