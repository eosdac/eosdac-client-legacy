<template>
  <q-page class="q-pa-md">
    <div class="q-display-1 text-text1 q-mb-md">
      Pending Payments
      <span class="text-text2" v-if="pendingpay.length"
        >({{ pendingpay.length }})</span
      >
    </div>

    <div class="row">
      <div class="bg-bg1 round-borders shadow-5 col-xs-12 col-md-6">
        <div v-if="pendingpay.length" class="animate-fade">
          <q-item v-for="(pay, i) in pendingpay" :key="`pay_id_${i}`">
            <q-item-side left>{{ pay.key }}</q-item-side>
            <q-item-main>
              <q-item-tile label>{{ pay.receiver }}</q-item-tile>
              <q-item-tile sublabel>{{ pay.quantity }}</q-item-tile>
            </q-item-main>
            <q-item-side right>
              <q-btn label="claim" color="primary" @click="claimpay(pay.key)" />
            </q-item-side>
          </q-item>

          <q-item v-if="pendingpay.length > 1">
            <q-item-main>
              <q-item-tile label>Total</q-item-tile>
              <q-item-tile sublabel>{{ totalPayAmount }}</q-item-tile>
            </q-item-main>
            <q-item-side right>
              <q-btn color="positive" label="claim all" @click="claimAll" />
            </q-item-side>
          </q-item>
        </div>
        <div v-else class="q-ma-md">
          You do not have any pending payments.
        </div>
      </div>

      <div class="q-display-1 text-text1 q-my-md full-width">
        Update Requested Pay
        <span class="text-text2 q-caption"
          >(current pay: {{ getIsCandidate.requestedpay }})</span
        >
      </div>
      <div class="text-text1 round-borders bg-bg1 q-pa-md">
        <span>{{
          $t("manage_candidateship.pay_description", {
            requested_pay: $helper.assetToLocaleNumber(
              getCustodianConfig.requested_pay_max
            )
          })
        }}</span>
        <q-item class="q-pl-none">
          <q-item-side
            left
            icon="icon-type-2"
            v-bind:class="{ 'text-negative': $v.new_requested_pay.$error }"
          />
          <q-item-main>
            <q-input
              color="primary-light"
              :dark="getIsDark"
              type="number"
              v-model="new_requested_pay"
              @input="$v.new_requested_pay.$touch()"
              :error="$v.new_requested_pay.$error"
              :stack-label="$t('manage_candidateship.requestedpay')"
              :placeholder="
                $t('manage_candidateship.requested_custodian_pay_placeholder', {
                  system_token: $configFile.get('systemtokensymbol')
                })
              "
            />
          </q-item-main>
        </q-item>
        <div class="row justify-end q-mt-md">
          <q-btn
            :label="$t('default.update')"
            @click="updateRequestedPay"
            color="primary"
          />
        </div>
      </div>
    </div>
    <debug-data :data="[{ pendingpay: pendingpay }]" />
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import debugData from "components/ui/debug-data";
import { required, between } from "vuelidate/lib/validators";
export default {
  name: "MyPayments",
  components: {
    debugData
  },
  data() {
    return {
      loading: false,
      loadingText: "",
      pendingpay: [],
      new_requested_pay: ""
    };
  },
  computed: {
    ...mapGetters({
      getCustodianConfig: "dac/getCustodianConfig",
      getAccountName: "user/getAccountName",
      getIsDark: "ui/getIsDark",
      getIsCandidate: "user/getIsCandidate"
    }),

    totalPayAmount() {
      if (!this.pendingpay.length) return 0;

      let total = this.pendingpay.reduce((total, p) => {
        return total + this.$helper.assetToNumber(p.quantity);
      }, 0);

      return (
        this.$helper.toLocaleNumber(
          total,
          this.$configFile.get("systemtokendecimals")
        ) + " EOS"
      );
    },
    verifyAndGetRequestedPay() {
      if (this.new_requested_pay >= 0) {
        return this.$helper.numberToAsset(
          this.new_requested_pay.toFixed(4),
          this.$configFile.get("systemtokensymbol")
        );
      }
    }
  },
  methods: {
    async claimpay(id) {
      let actions = [
        {
          account: this.$configFile.get("custodiancontract"),
          name: "claimpay",
          data: {
            payid: id
          }
        }
      ];
      let result = await this.$store.dispatch("user/transact", {
        actions: actions
      });
      if (result) {
        this.getClaimPay();
      }
    },

    async claimAll() {
      const contract = this.$configFile.get("custodiancontract");
      let actions = this.pendingpay.map(pp => {
        return {
          account: contract,
          name: "claimpay",
          data: {
            payid: pp.key
          }
        };
      });
      let result = await this.$store.dispatch("user/transact", {
        actions: actions
      });
      if (result) {
        this.getClaimPay();
      }
    },

    async updateRequestedPay() {
      this.$v.new_requested_pay.$touch();

      if (this.$v.new_requested_pay.$error) {
        alert("Requested pay amount invalid");
        return;
      }

      let actions = [
        {
          account: this.$configFile.get("custodiancontract"),
          name: "updatereqpay",
          data: {
            cand: this.getAccountName,
            requestedpay: this.verifyAndGetRequestedPay
          }
        }
      ];
      console.log(actions);
      let result = await this.$store.dispatch("user/transact", {
        actions: actions
      });
      if (result) {
        this.$store.dispatch("user/fetchIsCandidate");
      }
    },

    async getClaimPay() {
      this.loading = true;
      this.pendingpay = await this.$store.dispatch("user/fetchPendingPay");
      this.loading = false;
    }
  },
  mounted() {
    this.getClaimPay();
  },

  validations() {
    return {
      new_requested_pay: {
        required,
        between: between(
          0.0,
          this.$helper.assetToNumber(this.getCustodianConfig.requested_pay_max)
        )
      }
    };
  }
};
</script>

<style></style>
