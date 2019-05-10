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
      </div>
    </div>

    <div class="col-xs-12 col-lg-6">
      <div class="bg-bg1 round-borders shadow-5 q-pa-md">
        <q-field
          :error="$v.to.$error"
          error-label="Please enter a valid accountname"
          icon="mdi-account-outline"
        >
          <q-input
            stack-label="TO"
            v-model="to"
            :dark="getIsDark"
            @input="$v.to.$touch()"
          />
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
              :decimals="decimals"
              stack-label="QUANTITY"
              v-model="quantity"
              :dark="getIsDark"
              @input="$v.quantity.$touch()"
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
// import balanceTimeline from "components/ui/balance-timeline";
// import helpBtn from "components/controls/help-btn";
// import xspan from "components/ui/xspan";
import { mapGetters } from "vuex";

import { required, maxLength, maxValue } from "vuelidate/lib/validators";
import { isEosName } from "../../modules/validators.js";
export default {
  name: "msigTransfer",
  components: {},
  data() {
    return {
      from: "eosdacdoshhq",
      to: "",
      quantity: "",
      memo: "this is the memo",

      title: "this is a custom title",
      description: "this is a custom description",

      from_balance: null,
      from_permissions: null,
      symbol: "EOS",
      contract: "eosio.token",
      decimals: 4
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
      if (this.$v.$error) {
        console.log(this.$v);
        this.$q.notify("Please review fields again.");
        return;
      }
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
        actions: [action],
        title: this.title,
        description: this.description
      });
      if (res) {
        console.log(res);
      }
    }
  },
  async mounted() {
    this.setFromPermissions();
  },

  validations() {
    return {
      from: { required, isEosName },
      to: { required, isEosName },
      quantity: {
        required,
        maxValue: maxValue(this.$helper.assetToNumber(this.from_balance))
      },
      memo: { maxLength: maxLength(255) }
    };
  }
};
</script>

<style></style>
