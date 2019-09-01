<template>
  <q-page class="q-pa-md">
    <div class="row gutter-sm ">
      <div class="col-xs-12 col-md-6 animate-fade">
        <div class="round-borders bg-bg1 bg-logo shadow-4 overflow-hidden">
          <div
            class="bg-primary q-pa-sm row justify-between items-center"
            style="height:50px"
          >
            <q-icon
              :name="$configFile.icon.dactoken"
              color="text2"
              size="24px"
            />
            <span>Pending Payments ({{ pendingpay.length }})</span>
            <help-btn
              content="Each new period you can claim or reject your custodian payment. The payment amount is the mean value of all requested custodian pays. When you reject a payment the funds will not be transfered to your account and will stay in the dac's treasury account."
              title="My pending payments"
              color="text1"
              size="sm"
            />
          </div>

          <q-scroll-area
            style="width: 100%; height: 250px;"
            :thumb-style="{
              right: '0px',
              borderRadius: '2px',
              background: '#7c41ba',
              width: '10px',
              opacity: 0.8
            }"
          >
            <q-list no-border separator highlight :dark="getIsDark">
              <div
                class="row justify-center text-weight-thin q-mt-md"
                v-if="!pendingpay.length"
              >
                You don't have any pending payments
              </div>
              <q-item
                v-for="(pay, i) in pendingpay"
                :key="`pay_id_${i}`"
                class="animate-fade"
              >
                <q-item-side left icon="icon-ui-19" :title="`id: ${pay.key}`" />
                <q-item-main>
                  <q-item-tile label>
                    <div class="overflow-hidden">
                      <span>{{ pay.receiver }}</span>
                    </div>
                  </q-item-tile>
                  <q-item-tile sublabel>
                    <div style="white-space: nowrap;" class=" overflow-hidden">
                      {{ pay.quantity }}
                    </div>
                  </q-item-tile>
                </q-item-main>
                <q-item-side right style="min-width:65px">
                  <q-btn
                    :title="
                      `Refuse to get paid. The funds will stay in the DAC`
                    "
                    color="negative"
                    class="animate-fade"
                    flat
                    size="sm"
                    label="reject"
                    @click="rejectpay(pay.key)"
                  />
                  <q-btn
                    :title="
                      `Claim your payment. The funds will be transfered to your account.`
                    "
                    color="primary"
                    class="animate-fade"
                    size="sm"
                    label="claim"
                    @click="claimpay(pay.key)"
                  />
                </q-item-side>
              </q-item>
            </q-list>
          </q-scroll-area>
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
      </div>

      <div class="col-xs-12 col-md-6 animate-fade">
        <div class="round-borders bg-bg1 shadow-4 overflow-hidden">
          <div
            class="bg-primary q-pa-sm row justify-between items-center"
            style="height:50px"
          >
            <q-icon
              :name="$configFile.icon.dactoken"
              color="text2"
              size="24px"
            />
            <span>Update Requested Pay</span>
            <help-btn
              :content="
                $t('manage_candidateship.pay_description', {
                  requested_pay: $helper.assetToLocaleNumber(
                    getCustodianConfig.requested_pay_max.quantity
                  )
                })
              "
              title="Update Requested Pay"
              color="text1"
              size="sm"
            />
          </div>
          <div class="q-pa-md">
            <span
              >Your current pay amount is set to
              {{ getIsCandidate.requestedpay }}</span
            >
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
                    $t(
                      'manage_candidateship.requested_custodian_pay_placeholder',
                      {
                        system_token: $configFile.get('systemtokensymbol')
                      }
                    )
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
      </div>
    </div>

    <debug-data :data="[{ pendingpay: pendingpay }]" />
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import debugData from "components/ui/debug-data";
import helpBtn from "components/controls/help-btn";
import { required, between } from "vuelidate/lib/validators";
export default {
  name: "MyPayments",
  components: {
    debugData,
    helpBtn
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
      let symbol = this.pendingpay[0].quantity.split(" ")[1];
      let total = this.pendingpay.reduce((total, p) => {
        return total + this.$helper.assetToNumber(p.quantity);
      }, 0);

      return (
        this.$helper.toLocaleNumber(
          total,
          this.$configFile.get("systemtokendecimals")
        ) +
        " " +
        symbol
      );
    },
    verifyAndGetRequestedPay() {
      if (this.new_requested_pay >= 0) {
        return this.$helper.numberToAsset(
          this.new_requested_pay.toFixed(
            this.$configFile.get("systemtokendecimals")
          ),
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
          name: "claimpaye",
          data: {
            payid: id,
            dac_id: this.$configFile.get("dacscope")
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

    async rejectpay(id) {
      let actions = [
        {
          account: this.$configFile.get("custodiancontract"),
          name: "rejectcuspay",
          data: {
            payid: id,
            dac_id: this.$configFile.get("dacscope")
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
      let actions = this.pendingpay.slice(0, 10).map(pp => {
        return {
          account: contract,
          name: "claimpaye",
          data: {
            payid: pp.key,
            dac_id: this.$configFile.get("dacscope")
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
          name: "updatereqpae",
          data: {
            cand: this.getAccountName,
            requestedpay: this.verifyAndGetRequestedPay,
            dac_id: this.$configFile.get("dacscope")
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
          this.$helper.assetToNumber(
            this.getCustodianConfig.requested_pay_max.quantity
          )
        )
      }
    };
  }
};
</script>
