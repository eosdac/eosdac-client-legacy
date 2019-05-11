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
              :height="230"
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
            <msig-transfer
              @onsubmit="addToQeue($event)"
              ref="msigTransferForm"
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
            <q-icon name="mdi-inbox-arrow-down" color="text2" size="24px" />
            <span class="uppercase">trx qeue ({{ trx_qeue.length }})</span>
            <q-btn flat round dense icon="more_vert">
              <q-popover class="bg-bg2 text-text1" style="width:150px">
                <q-list dense highlight>
                  <q-item class="cursor-pointer q-caption">
                    <q-item-main>
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
                    </q-item-main>
                  </q-item>
                  <q-item
                    class="cursor-pointer q-caption"
                    v-close-overlay
                    @click.native="downloadReport"
                  >
                    <q-item-main>Download Qeue</q-item-main>
                  </q-item>
                  <q-item
                    class="cursor-pointer q-caption"
                    v-close-overlay
                    @click.native="trx_qeue = []"
                  >
                    <q-item-main>Clear All</q-item-main>
                  </q-item>
                  <q-item
                    v-if="trx_qeue.length > 1"
                    class="cursor-pointer q-caption"
                    v-close-overlay
                    @click.native="proposeAll"
                  >
                    <q-item-main>Exec All</q-item-main>
                  </q-item>
                </q-list>
              </q-popover>
            </q-btn>
          </div>
          <div>
            <q-scroll-area
              style="height: 350px; padding-bottom:8px"
              :thumb-style="getThumbStyle()"
              :delay="1500"
            >
              <q-list dense no-border separator highlight dark class="q-pa-xs">
                <div
                  v-if="trx_qeue.length == 0"
                  class="text-weight-thin text-center q-body-1 q-mt-md"
                >
                  No transactions in the qeue
                </div>
                <q-item v-for="(trx, i) in trx_qeue" :key="`trx${i}`">
                  <q-item-side left>
                    <q-btn
                      v-if="trx.status == 0"
                      icon="close"
                      flat
                      dense
                      color="negative"
                      @click="removeFromQeue(i)"
                    />
                    <q-spinner v-if="trx.status == 1" color="primary-light" />
                    <q-btn
                      v-if="trx.status == 2"
                      icon="check"
                      flat
                      dense
                      color="positive"
                    />
                    <q-btn
                      v-if="trx.status == 3"
                      icon="edit"
                      flat
                      dense
                      color="text1"
                    />
                  </q-item-side>
                  <q-item-main>
                    <q-item-tile label>{{ trx.title }}</q-item-tile>
                    <q-item-tile sublabel class="q-body-1 q-py-xs">
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
                      v-if="trx.status == 0"
                      label="edit"
                      size="sm"
                      dense
                      flat
                      color="info"
                      class="q-mr-xs"
                      @click="editQeueItem(i)"
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
                    <q-btn
                      v-if="trx.status == 2"
                      label="view"
                      size="sm"
                      flat
                      dense
                      color="positive"
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
import msigTransfer from "components/controls/msig-transfer";
import { colors } from "quasar";
export default {
  name: "dacFinancials",
  components: {
    balanceTimeline,
    msigTransfer,
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
    //status 0 = waiting for exec; 1 = sending; 2 = success; 3 = edit;
    addToQeue(el) {
      if (el.status === undefined) {
        el.status = 0;
      }

      let f = this.trx_qeue.findIndex(qi => qi.status == 3);
      console.log("edit item index", f);
      if (f != -1) {
        el.status = 0;
        this.$set(this.trx_qeue, f, el);
      } else {
        this.trx_qeue.push(el);
      }
    },
    removeFromQeue(qeue_index) {
      this.trx_qeue.splice(qeue_index, 1);
    },
    editQeueItem(qeue_index) {
      //check if there is already an item being edited
      let check = this.trx_qeue.find(qi => qi.status == 3);
      if (check) check.status = 0;

      let qeue_item = this.trx_qeue[qeue_index];
      qeue_item.status = 3;
      this.$refs.msigTransferForm.setFormFieldsEdit(qeue_item);
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
        let entry = content[i];
        this.addToQeue(entry);
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

    async proposeAll() {
      for (let i = 0; i < this.trx_qeue.length; i++) {
        //only propose if not proposed yet
        if (this.trx_qeue[i].status == 0) {
          await this.proposeTransfer(i);
        }
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
        trx_data.trx_id = res.transaction_id;
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
    },

    downloadReport() {
      if (this.trx_qeue.length == 0) return;
      let data = JSON.parse(JSON.stringify(this.trx_qeue));
      data.forEach(d => {
        delete d.status;
      });

      let a = document.createElement("a");
      let file = new Blob([JSON.stringify(data, null, 4)], {
        type: "text/plain;charset=utf-8"
      });
      a.href = URL.createObjectURL(file);
      a.download = "msig_report.json";
      a.click();
    }
  },
  mounted() {
    this.getPermissions();
  }
};
</script>

<style></style>
