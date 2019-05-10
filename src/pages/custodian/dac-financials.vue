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
        <div class="bg-bg1 round-borders shadow-5 overflow-hidden full-height">
          <div
            v-bind:class="{
              'bg-primary': !account.selected,
              'bg-primary-light': account.selected
            }"
            class="q-pa-sm row justify-between items-center"
          >
            <span class="uppercase">{{ account.account }}</span>
            <xspan class="q-caption" :value="account.balance" />
            <help-btn
              :content="account.description"
              :title="account.account"
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

      <div class="col-xs-12 col-lg-6">
        <div class="bg-bg1 round-borders shadow-5 overflow-hidden">
          <div class="bg-primary q-pa-sm row justify-between items-center">
            <span class="uppercase">Transfer</span>
            <help-btn
              content="jqh q shkq sdk dk qskdh qskd"
              title="account.account"
              color="text1"
              size="sm"
            />
          </div>
          <div class="q-pa-md">dsfsdfsdf</div>
        </div>
      </div>

      <div class="col-xs-12 col-lg-6">
        <div class="bg-bg1 round-borders shadow-5 overflow-hidden">
          <div class="bg-primary q-pa-sm row justify-between items-center">
            <q-icon name="mdi-inbox-arrow-down" color="text2" size="24px" />
            <span class="uppercase">trx que ({{ trx_qeue.length }})</span>
            <help-btn
              content="jqh q shkq sdk dk qskdh qskd"
              title="account.account"
              color="text1"
              size="sm"
            />
          </div>
          <div>
            <q-list dense highlight no-border>
              <q-item v-for="(trx, i) in trx_qeue" :key="`trx${i}`">
                <q-item-side left>
                  <q-btn icon="close" flat dense color="negative" />
                  <q-spinner color="primary-light" />
                </q-item-side>
                <q-item-main>
                  <q-item-tile class="q-body-1 q-py-xs">
                    {{ trx.from }} > {{ trx.to }} {{ trx.quantity }}
                  </q-item-tile>
                </q-item-main>
                <q-item-side right>
                  <q-btn
                    label="view"
                    size="sm"
                    dense
                    flat
                    color="info"
                    class="q-mr-xs"
                  />
                  <q-btn
                    label="send"
                    size="sm"
                    flat
                    dense
                    color="positive"
                    @click="proposeTransfer(i)"
                  />
                </q-item-side>
              </q-item>
            </q-list>
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
          permissions: [],
          contract: this.$configFile.get("systemtokencontract"),
          symbol: this.$configFile.get("systemtokensymbol"),
          balance: null,
          selected: false,
          description:
            "The EOS Mainnet block producer account for eosDAC which receives Block Producer rewards."
        },
        {
          account: this.$configFile.get("treasuryaccount"),
          permissions: [],
          contract: this.$configFile.get("systemtokencontract"),
          symbol: this.$configFile.get("systemtokensymbol"),
          balance: null,
          selected: false,
          description:
            "The DAC owner account where DAC funds are secured and controlled by a 12-account multisig permission system of elected custodians."
        },
        {
          account: "dacocoiogmbh",
          permissions: [],
          contract: this.$configFile.get("systemtokencontract"),
          symbol: this.$configFile.get("systemtokensymbol"),
          balance: null,
          selected: false,
          description:
            "The current eosDAC service provider account which manages payroll, employment contracts, and real-world interactions on behalf of the DAC."
        }
      ],

      trx_qeue: [
        {
          from: "eosdacdoshhq",
          to: "piecesnbitss",
          quantity: "1.0000 EOS",
          memo: "this is the memo of the transaction",
          title: "Payment for wp #999",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
        },
        {
          from: "eosdacdoshhq",
          to: "evilmikehere",
          quantity: "10000.0000 EOS",
          memo: "this is the memo of the transaction",
          title: "Payment for wp #789",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
        },
        {
          from: "eosdacdoshhq",
          to: "lukedactest1",
          quantity: "9999.0000 EOS",
          memo: "this is the memo of the transaction",
          title: "Payment for wp #781",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
        }
      ]
    };
  },

  computed: {
    ...mapGetters({
      // getEosApi: 'global/getEosApi'
    })
  },
  methods: {
    async getPermissions() {
      for (let i = 0; i < this.financialaccounts.length; i++) {
        let finacc = this.financialaccounts[i];

        let account_permissions = (await this.$store.dispatch(
          "dac/fetchAccount",
          {
            accountname: finacc.account
          }
        )).permissions;
        finacc.permissions = account_permissions;
      }
    },
    async proposeTransfer(trx_index) {
      let trx_data = this.trx_qeue[trx_index];

      let from_account = this.financialaccounts.find(
        fa => fa.account == trx_data.from
      );

      const hasXfer = !!from_account.permissions.find(
        fp => fp.perm_name == "xfer"
      );
      const permission = hasXfer ? `xfer` : `active`;

      let action = {
        account: "eosio.token",
        name: "transfer",
        data: {
          from: trx_data.from,
          to: trx_data.to,
          quantity: trx_data.quantity,
          memo: trx_data.memo
        },
        authorization: [
          {
            actor: trx_data.from,
            permission: permission
          }
        ]
      };

      let res = await this.$store.dispatch("user/proposeMsig", {
        actions: [action],
        title: trx_data.title,
        description: trx_data.description
      });
      if (res) {
        console.log(res);
      }
    }
  },
  mounted() {
    this.getPermissions();
  }
};
</script>

<style></style>
