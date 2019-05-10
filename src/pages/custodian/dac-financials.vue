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
          <div
            class="bg-primary q-pa-sm row justify-between items-center"
            style="height:50px"
          >
            <span class="uppercase">Transfer</span>
            <help-btn
              content="jqh q shkq sdk dk qskdh qskd"
              title="account.account"
              color="text1"
              size="sm"
            />
          </div>
          <div class="q-pa-md">
            <q-btn label="add" dense color="primary" @click="addToQeue" />
          </div>
        </div>
      </div>

      <div class="col-xs-12 col-lg-6">
        <div class="bg-bg1 round-borders shadow-5 overflow-hidden">
          <div
            class="bg-primary q-pa-sm row justify-between items-center"
            style="height:50px"
          >
            <q-icon name="mdi-inbox-arrow-down" color="text2" size="24px" />
            <span class="uppercase">trx qeue ({{ trx_qeue.length }})</span>
            <q-btn flat round dense icon="more_vert">
              <q-popover class="bg-bg2 text-text1" style="width:150px">
                <q-list dense highlight>
                  <q-item class="cursor-pointer q-caption">
                    <label for="myInput" class="cursor-pointer full-width">
                      Load From File
                    </label>
                    <input
                      id="myInput"
                      type="file"
                      style="display:none"
                      ref="inputFile"
                      accept=".json,application/json"
                      @input="handleFileInput()"
                    />
                  </q-item>
                  <q-item class="cursor-pointer q-caption" v-close-overlay>
                    <q-item-main>Download Executed</q-item-main>
                  </q-item>
                  <q-item
                    class="cursor-pointer q-caption"
                    v-close-overlay
                    @click.native="trx_qeue = []"
                  >
                    <q-item-main>Clear All</q-item-main>
                  </q-item>
                </q-list>
              </q-popover>
            </q-btn>
          </div>
          <div>
            <q-scroll-area
              style="height: 300px; padding-bottom:8px"
              :thumb-style="getThumbStyle()"
              :delay="1500"
            >
              <q-list dense highlight no-border>
                <q-item v-for="(trx, i) in trx_qeue" :key="`trx${i}`">
                  <q-item-side left>
                    <q-btn
                      v-if="trx.status == 0"
                      icon="close"
                      flat
                      dense
                      color="negative"
                      @click="trx_qeue.splice(i, 1)"
                    />
                    <q-spinner v-if="trx.status == 1" color="primary-light" />
                    <q-btn
                      v-if="trx.status == 2"
                      icon="check"
                      flat
                      dense
                      color="positive"
                    />
                  </q-item-side>
                  <q-item-main>
                    <q-item-tile class="q-body-1 q-py-xs">
                      <span>{{ trx.from }}</span>
                      <span class="text-weight-thin"> > </span>
                      <span>{{ trx.to }}</span>
                      <span class="text-weight-thin on-right q-caption">{{
                        trx.quantity
                      }}</span>
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
                      v-if="trx.status == 0"
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
            </q-scroll-area>
          </div>
        </div>
      </div>
      <!-- end trx qeue -->
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import balanceTimeline from "components/ui/balance-timeline";
import helpBtn from "components/controls/help-btn";
import xspan from "components/ui/xspan";
import { colors } from "quasar";
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

      trx_qeue: []
    };
  },

  computed: {
    ...mapGetters({
      // getEosApi: 'global/getEosApi'
    })
  },
  methods: {
    addToQeue() {
      let trx = {
        status: 0,
        from: "eosdacdoshhq",
        to: "lukedactest1",
        quantity: "9999.0000 EOS",
        memo: "this is the memo of the transaction",
        title: "Payment for wp #781",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
      };
      this.trx_qeue.push(trx);
    },
    async handleFileInput() {
      let file = this.$refs.inputFile.files[0];
      console.log(file);
      // this.filename = file.name;
      // this.filesize = `${(file.size / 1024).toFixed(2)}KB`;
      let content = await new Promise((resolve, reject) => {
        var fr = new FileReader();
        fr.onload = function(result) {
          return resolve(fr.result);
        };
        fr.readAsText(file, `utf8`);
      });
      content = JSON.parse(content);
      for (let i = 0; i < content.length; i++) {
        let trxdata = content[i];
        trxdata.status = 0;
        this.trx_qeue.push(trxdata);
      }
      document.getElementById("myInput").value = "";
    },
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

      //set status to the sending state 1
      trx_data.status = 1;

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
        trx_data.status = 2;
      } else {
        trx_data.status = 0;
      }
    },
    getThumbStyle() {
      return {
        right: "0px",
        borderRadius: "0px",
        background: colors.getBrand("primary-light"),
        width: "5px",
        opacity: 1
      };
    }
  },
  mounted() {
    this.getPermissions();
  }
};
</script>

<style></style>
