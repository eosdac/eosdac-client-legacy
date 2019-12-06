<template>
  <q-page class="text-text2 ">
    <div class="q-pa-md animate-fade" v-if="getAccountName">
      <!-- is already a candidate UNREGISTER-->
      <div
        v-if="getIsCandidate && getIsCandidate.is_active"
        class=" bg-logo bg-bg1 q-pa-md round-borders shadow-4 relative-position overflow-hidden"
      >
        <!-- <div class="" style="bottom:-50%;right:-80%;"></div> -->
        <q-item class="no-padding">
          <q-item-side left>
            <div
              style="width:80px;height:80px;"
              class="profile_image animate-pop profile_image_border"
              v-bind:style="{ 'background-image': `url(${getProfilePicture})` }"
            ></div>
          </q-item-side>
          <q-item-main>
            <q-item-tile class="text-text1 q-display-1" label>{{
              $t("manage_candidateship.candidate")
            }}</q-item-tile>
            <q-item-tile class="text-text2 q-title" sublabel>
              <div class="row items-center">
                {{ getIsCandidate.candidate_name
                }}<q-icon name="check" color="positive" />
              </div>
            </q-item-tile>
          </q-item-main>
        </q-item>
        <div class="q-mt-md">
          {{
            $t("manage_candidateship.page_description_registered", {
              dacname: $configFile.get("dacname")
            })
          }}
        </div>

        <div class="row q-mt-md">
          <q-item class="q-pl-none" v-if="getEnableCustPayments">
            <q-item-side left icon="icon-type-2" class="text-text2" />
            <q-item-main style="margin-left:-5px">
              <q-item-tile class="text-text1" label>{{
                $t(`manage_candidateship.requestedpay`)
              }}</q-item-tile>
              <q-item-tile class="text-text2" sublabel>{{
                $helper.assetToLocaleNumber(getIsCandidate.requestedpay)
              }}</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item class="q-pl-none">
            <q-item-side left icon="how_to_vote" class="text-text2" />
            <q-item-main style="margin-left:-5px">
              <q-item-tile class="text-text1" label>{{
                $t(`manage_candidateship.total_votes`)
              }}</q-item-tile>
              <q-item-tile class="text-text2" sublabel>{{
                $helper.toLocaleNumber(getIsCandidate.total_votes / 10000)
              }}</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item class="q-pl-none">
            <q-item-side left icon="icon-dac-balance" class="text-text2" />
            <q-item-main style="margin-left:-5px; margin-right:-10px">
              <q-item-tile class="text-text1" label>{{
                $t(`manage_candidateship.locked_tokens`)
              }}</q-item-tile>
              <q-item-tile class="text-text2" sublabel>{{
                $helper.assetToLocaleNumber(getIsCandidate.locked_tokens)
              }}</q-item-tile>
            </q-item-main>
            <q-item-side right class="no-padding">
              <q-btn
                icon="add"
                round
                size="sm"
                title="Increase stake"
                color="dark"
                @click="increase_stake_modal = true"
              />
            </q-item-side>
          </q-item>
        </div>
        <div class="row justify-end">
          <q-btn
            class="animate-pop"
            color="primary"
            @click="unRegisterAsCandidtate"
            :label="$t('manage_candidateship.unregister')"
          />
        </div>
      </div>
      <!-- end already a candidate -->

      <!-- Not a candidate REGISTER -->
      <div v-else class="bg-bg1 bg-logo q-pa-md round-borders shadow-4">
        <q-item class="no-padding q-mb-md">
          <q-item-side left>
            <div
              style="width:80px;height:80px"
              class="profile_image animate-pop profile_image_border"
              v-bind:style="{ 'background-image': `url(${getProfilePicture})` }"
            ></div>
          </q-item-side>
          <q-item-main>
            <q-item-tile class="text-text1 q-display-1" label>{{
              $t("manage_candidateship.candidate")
            }}</q-item-tile>
            <q-item-tile class="text-text2 q-title" sublabel>
              <div class="row items-center">{{ getAccountName }}</div>
            </q-item-tile>
          </q-item-main>
        </q-item>

        <span>{{
          $t("manage_candidateship.page_description_unregistered", {
            dacname: $configFile.get("dacname")
          })
        }}</span>
        <div class="row gutter-md q-mt-md">
          <div class="col-xs-12 col-md-6">
            <div>
              <span>{{
                $t("manage_candidateship.stake_description", {
                  minimum_stake: $helper.assetToLocaleNumber(
                    getCustodianConfig.lockupasset.quantity
                  )
                })
              }}</span>
              <q-item class="q-pl-none q-mb-md">
                <q-item-side
                  left
                  icon="icon-dac-balance"
                  v-bind:class="{
                    'text-positive': verifyAndGetStakeAmount,
                    'text-text2': !verifyAndGetStakeAmount
                  }"
                />
                <q-item-main>
                  <q-input
                    color="primary-light"
                    :dark="getIsDark"
                    type="number"
                    v-model="inputs.stakeamount"
                    :stack-label="$t('manage_candidateship.stake_amount')"
                    :placeholder="
                      $t('manage_candidateship.amount_to_stake_placeholder', {
                        token_symbol: $configFile.get('dactokensymbol')
                      })
                    "
                  />
                </q-item-main>
              </q-item>
            </div>
          </div>
          <div class="col-xs-12 col-md-6" v-if="getEnableCustPayments">
            <div>
              <span>{{
                $t("manage_candidateship.pay_description", {
                  requested_pay: $helper.assetToLocaleNumber(
                    getCustodianConfig.requested_pay_max.quantity
                  )
                })
              }}</span>
              <q-item class="q-pl-none">
                <q-item-side
                  left
                  icon="icon-type-2"
                  v-bind:class="{
                    'text-positive': verifyAndGetRequestedPay,
                    'text-text2': !verifyAndGetRequestedPay
                  }"
                />
                <q-item-main>
                  <q-input
                    color="primary-light"
                    :dark="getIsDark"
                    type="number"
                    :max="20"
                    v-model="inputs.requestedpay"
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
            </div>
          </div>
        </div>

        <div class="row justify-end q-mt-md">
          <q-btn
            :disabled="!allowRegister"
            class="animate-pop"
            color="primary"
            @click="registerAsCandidtate"
            :label="$t('manage_candidateship.register')"
          />
        </div>
      </div>
      <!-- end not a candidate -->

      <div
        v-if="
          getIsCandidate &&
            !getIsCandidate.is_active &&
            parseFloat(getIsCandidate.locked_tokens)
        "
        class=" bg-bg1 q-pa-md round-borders shadow-4 q-mt-md"
      >
        <span
          >{{ $t("manage_candidateship.unstake_description")
          }}{{ lockup_release_time_delay_days }}</span
        >

        <div class="row justify-between q-mt-md items-center">
          <div class="q-caption q-py-sm">
            <span class="text-positive"
              >Your stake
              {{
                $helper.assetToLocaleNumber(getIsCandidate.locked_tokens)
              }}</span
            >
            <span class="on-right"
              >Release Date:
              {{
                new Date("2019-05-09T19:17:10").toUTCString(
                  getIsCandidate.custodian_end_time_stamp
                )
              }}</span
            >
          </div>
          <q-btn
            class="animate-pop"
            color="primary"
            @click="unstake"
            :label="$t('manage_candidateship.unstake')"
          />
        </div>
      </div>
      <!-- {{$t('manage_candidateship.page_description_active_custodian', {dacname: $configFile.get('dacname')})}} -->
    </div>

    <div v-if="!getAccountName" class="animate-fade q-pa-md">
      Please login
    </div>

    <div class="q-pa-md">
      <debug-data
        :data="[
          {
            getIsCandidate: getIsCandidate,
            getCustodianConfig: getCustodianConfig,
            inputs: inputs,
            lockup_release_time_delay_days: lockup_release_time_delay_days
          }
        ]"
      />
    </div>

    <q-modal v-model="increase_stake_modal" minimized>
      <div
        style="height:50px"
        class="bg-bg1 row items-center justify-between q-px-md text-text1"
      >
        <span
          >Increase Your stake ({{ $configFile.get("dactokensymbol") }})</span
        >
        <q-btn icon="close" @click="increase_stake_modal = false" flat dense />
      </div>
      <div class="q-pa-md bg-bg2 text-text1">
        <q-input
          :dark="getIsDark"
          type="number"
          color="primary-light"
          v-model="increase_stake_amount"
          stack-label="Extra Stake"
          placeholder="enter amount"
        />
        <div class="row justify-end q-mt-md">
          <q-btn label="ok" color="primary" @click="increase_stake" />
        </div>
      </div>
    </q-modal>
  </q-page>
</template>

<script>
import debugData from "components/ui/debug-data";
import { mapGetters } from "vuex";
export default {
  name: "RegisterCandidate",
  components: {
    debugData
  },
  data() {
    return {
      inputs: {
        stakeamount: null,
        requestedpay: null
      },
      // requested_pay_max: 0,
      increase_stake_amount: "",
      increase_stake_modal: false
    };
  },

  computed: {
    ...mapGetters({
      getAccountName: "user/getAccountName",
      getIsloaded: "user/getIsLoaded",
      getIsCandidate: "user/getIsCandidate",
      getProfilePicture: "user/getProfilePicture",
      getCustodianConfig: "dac/getCustodianConfig",
      getIsDark: "ui/getIsDark",
      getEnableCustPayments: "dac/getEnableCustPayments"
    }),

    lockup_release_time_delay_days() {
      if (this.getCustodianConfig.lockup_release_time_delay) {
        return this.getCustodianConfig.lockup_release_time_delay / 60 / 60 / 24;
      }
    },
    verifyAndGetRequestedPay() {
      if (
        this.inputs.requestedpay !== null &&
        this.inputs.requestedpay >= 0 &&
        this.inputs.requestedpay <=
          this.assetToNumber(this.getCustodianConfig.requested_pay_max.quantity)
      ) {
        return this.numberToAsset(
          this.inputs.requestedpay.toFixed(
            this.$configFile.get("systemtokendecimals")
          ),
          this.$configFile.get("systemtokensymbol")
        );
      } else {
        console.log("requested pay out of range");
        return false;
      }
    },
    verifyAndGetStakeAmount() {
      if (
        this.inputs.stakeamount !== null &&
        this.inputs.stakeamount >=
          this.assetToNumber(this.getCustodianConfig.lockupasset.quantity)
      ) {
        return this.numberToAsset(
          this.inputs.stakeamount.toFixed(
            this.quantityToPrecision(
              this.getCustodianConfig.lockupasset.quantity
            )
          ),
          this.$configFile.get("dactokensymbol")
        );
      } else {
        console.log("stake out of range");
        return false;
      }
    },
    checkAlreadyStaked() {
      if (
        this.getIsCandidate &&
        this.assetToNumber(this.getIsCandidate.locked_tokens)
      ) {
        return (
          this.assetToNumber(this.getIsCandidate.locked_tokens) >=
          this.assetToNumber(this.getCustodianConfig.lockupasset.quantity)
        );
      } else {
        return false;
      }
    },
    allowRegister() {
      return (
        (this.verifyAndGetRequestedPay || !this.getEnableCustPayments) &&
        (this.verifyAndGetStakeAmount || this.checkAlreadyStaked)
      );
    }
  },

  methods: {
    numberToAsset(num, symbol) {
      return `${num} ${symbol}`;
    },
    assetToNumber(asset) {
      if (asset) {
        return parseFloat(asset.split(" ")[0]);
      }
    },
    quantityToPrecision(quantity) {
      if (quantity) {
        let [quan] = quantity.split(" ");
        const [, decimals] = quan.split(".");
        if (decimals) {
          return decimals.length;
        }
        return 0;
      }
    },

    async registerAsCandidtate() {
      let stakeaction = {
        account: this.$configFile.get("tokencontract"),
        name: "transfer",
        data: {
          from: this.getAccountName,
          to: this.$configFile.get("custodiancontract"),
          quantity: this.verifyAndGetStakeAmount,
          memo: this.$configFile.get("dacscope")
        }
      };
      let registeraction = {
        account: this.$configFile.get("custodiancontract"),
        name: "nominatecane",
        data: {
          cand: this.getAccountName,
          requestedpay: this.verifyAndGetRequestedPay || "0.0000 EOS",
          dac_id: this.$configFile.get("dacscope")
        }
      };

      let actions = [registeraction];

      if (!this.checkAlreadyStaked) {
        const stake_amount = this.assetToNumber(this.verifyAndGetStakeAmount);
        if ((stake_amount * 1000) > 0){
            actions.unshift(stakeaction);
        }

      }

      let result = await this.$store.dispatch("user/transact", {
        actions: actions
      });

      if (result) {
        this.$store.dispatch("user/fetchIsCandidate");
        this.$store.dispatch("user/fetchBalances");
        this.$store.dispatch("dac/fetchActiveCandidates");
      }
    },

    async unRegisterAsCandidtate() {
      let actions = [
        {
          account: this.$configFile.get("custodiancontract"),
          name: "withdrawcane",
          data: {
            cand: this.getAccountName,
            dac_id: this.$configFile.get("dacscope")
          }
        }
      ];

      let result = await this.$store.dispatch("user/transact", {
        actions: actions
      });
      if (result) {
        // this.$store.commit('user/setIsCandidate', false );
        this.$store.dispatch("user/fetchIsCandidate");
        this.$store.dispatch("dac/fetchActiveCandidates");
      }
    },

    async unstake() {
      let actions = [
        {
          account: this.$configFile.get("custodiancontract"),
          name: "unstakee",
          data: {
            cand: this.getAccountName,
            dac_id: this.$configFile.get("dacscope")
          }
        }
      ];
      let result = await this.$store.dispatch("user/transact", {
        actions: actions
      });
      if (result) {
        this.$store.dispatch("user/fetchIsCandidate");
        this.$store.dispatch("user/fetchBalances");
      }
    },
    async increase_stake() {
      if (!this.increase_stake_amount) return false;
      this.increase_stake_modal = false;
      let amount = this.numberToAsset(
        this.increase_stake_amount.toFixed(
          this.quantityToPrecision(this.getCustodianConfig.lockupasset.quantity)
        ),
        this.$configFile.get("dactokensymbol")
      );
      let stakeaction = {
        account: this.$configFile.get("tokencontract"),
        name: "transfer",
        data: {
          from: this.getAccountName,
          to: this.$configFile.get("custodiancontract"),
          quantity: amount,
          memo: "Increase stake"
        }
      };
      let result = await this.$store.dispatch("user/transact", {
        actions: [stakeaction]
      });
      if (result) {
        this.$store.dispatch("user/fetchIsCandidate");
        this.$store.dispatch("user/fetchBalances");
      }
      this.increase_stake_amount = "";
    }
  }
};
</script>

<style lang="stylus">
.profile_image_border{
  border: 2px solid var(--q-color-text2);
}

.animate_rotate_ease {
  animation: rotate 4s ease-in-out infinite;
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
