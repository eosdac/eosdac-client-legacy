<template>
  <q-page class="q-pa-md">
    <p class="text-text2">
      The following EOS accounts represent value flow over time within the DAC
      and can be useful for budgeting and decision making.
    </p>

    <q-carousel class="text-white " arrows>
      <q-carousel-slide
        class="no-padding"
        v-for="(chunk, si) in $helper.chunkArray(
          financialaccounts,
          getChunkSize()
        )"
        :key="`ssc${si}`"
      >
        <div class="row gutter-sm q-mb-md">
          <div
            style="height:340px"
            v-for="(account, i) in chunk"
            class="col-xs-12 col-sm-6 col-lg-4 animate-scale"
            :key="`fc${i}`"
          >
            <financial-account
              :accountname="account.account"
              :description="account.description"
              :default_contract="account.contract"
              :default_symbol="account.symbol"
            />
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>

    <div class="row gutter-sm">
      <div class="col-xs-12 col-lg-6">
        <div class="bg-bg1 round-borders shadow-4 overflow-hidden">
          <div
            class="bg-primary q-pa-sm row justify-between items-center"
            style="height:50px"
          >
            <q-icon
              :name="$configFile.icon.dactoken"
              color="text2"
              size="24px"
            />
            <span>{{ $t("dac_financials.propose_transfer") }}</span>
            <help-btn
              :content="$t('dac_financials.propose_transfer_help')"
              :title="$t('dac_financials.propose_transfer')"
              color="text1"
              size="sm"
            />
          </div>
          <div class="relative-position">
            <div class="cust_only_overlay" v-if="!getIsCustodian">
              <q-icon name="lock" class="q-mr-xs text-text2" />
              {{ $t("dac_financials.cust_only") }}
            </div>
            <div class="q-pa-md">
              <msig-transfer
                @onsubmit="addToQeue($event)"
                ref="msigTransferForm"
                :from_accounts="financialaccounts.map(fa => fa.account)"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="col-xs-12 col-lg-6 ">
        <div class="bg-bg1 round-borders shadow-4 overflow-hidden bg-logo">
          <div
            class="bg-primary q-pa-sm row justify-between items-center"
            style="height:50px"
          >
            <q-icon
              :name="$configFile.icon.dactoken"
              color="text2"
              size="24px"
            />
            <span>{{
              `${$t("dac_financials.trx_que")} (${trx_qeue.length})`
            }}</span>
            <q-btn flat round dense icon="more_vert" :disable="!getIsCustodian">
              <q-popover
                class="bg-bg2 text-text1"
                style="width:150px"
                v-if="getIsCustodian"
              >
                <q-list highlight>
                  <q-item class="cursor-pointer q-body-1">
                    <q-item-main>
                      <label
                        style="display:block"
                        for="myInput"
                        class="cursor-pointer full-width"
                      >
                        {{ $t("dac_financials.import_file") }}
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
                    class="cursor-pointer q-body-1"
                    v-close-overlay
                    @click.native="downloadReport"
                  >
                    <q-item-main>{{ $t("dac_financials.export") }}</q-item-main>
                  </q-item>
                  <q-item
                    class="cursor-pointer q-body-1"
                    v-close-overlay
                    @click.native="clearQeue"
                  >
                    <q-item-main>{{ $t("dac_financials.clear") }}</q-item-main>
                  </q-item>
                  <q-item
                    v-if="trx_qeue.length > 1"
                    class="cursor-pointer q-body-1"
                    v-close-overlay
                    @click.native="proposeAll"
                  >
                    <q-item-main>{{ $t("dac_financials.exec") }}</q-item-main>
                  </q-item>
                </q-list>
              </q-popover>
            </q-btn>
          </div>
          <div class="relative-position">
            <div class="cust_only_overlay" v-if="!getIsCustodian">
              <q-icon name="lock" class="q-mr-xs text-text2" />
              {{ $t("dac_financials.cust_only") }}
            </div>

            <q-scroll-area
              style="height: 380px; padding-bottom:8px"
              :thumb-style="getThumbStyle()"
              :delay="1500"
            >
              <q-list dense no-border separator highlight :dark="getIsDark">
                <div
                  v-if="trx_qeue.length == 0"
                  class="text-weight-thin text-center q-body-1 q-mt-md"
                >
                  {{ $t("dac_financials.empty_qeue") }}
                </div>
                <q-item
                  v-for="(trx, i) in trx_qeue"
                  :key="`trx${i}`"
                  class="animate-fade"
                >
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
                      <q-chip
                        dense
                        color="bg2"
                        class="text-weight-thin on-right q-caption"
                      >
                        <span>{{ `${trx.asset.amount}` }}</span>
                        <span class="text-weight-bold">
                          {{ trx.asset.symbol }}
                        </span>
                      </q-chip>
                    </q-item-tile>
                  </q-item-main>
                  <q-item-side right>
                    <q-btn
                      v-if="trx.status == 0 || trx.status == 3"
                      :label="$t('dac_financials.edit')"
                      size="sm"
                      dense
                      flat
                      color="info"
                      class="q-mr-xs"
                      @click="editQeueItem(i)"
                      :disabled="trx.status == 3"
                      :loading="trx.status == 3"
                    />
                    <q-btn
                      v-if="trx.status == 0 || trx.status == 3"
                      :label="$t('dac_financials.send')"
                      size="sm"
                      flat
                      dense
                      color="positive"
                      @click="proposeTransfer(i)"
                      :disabled="trx.status == 3"
                    />
                    <q-btn
                      v-if="trx.status == 2"
                      :label="$t('dac_financials.view')"
                      size="sm"
                      flat
                      dense
                      color="positive"
                      @click="viewTrx(trx.trx_id)"
                    />
                    <span class="animate-pop" v-if="trx.status == 1">
                      <q-spinner color="primary-light" />
                      <span class="q-caption text-text2 q-ml-sm">{{
                        $t("dac_financials.signing")
                      }}</span>
                    </span>
                  </q-item-side>
                </q-item>
              </q-list>
            </q-scroll-area>
          </div>
        </div>
      </div>
      <!-- end trx qeue -->

      <!-- <div class="col-xs-12 col-lg-6">
        <div class="bg-bg1 round-borders shadow-4 overflow-hidden">
          <div
            class="bg-primary q-pa-sm row justify-between items-center"
            style="height:50px"
          >
            <q-icon
              :name="$configFile.icon.dactoken"
              color="text2"
              size="24px"
            />
            <span>Open Payments</span>
            <help-btn
              content="Fill in the form to propose a transfer from one of the DAC accounts. The transfers will be submitted to the blockchain as multisignature proposals. The custodians need to vote before the transfer can be executed."
              title="Propose Transfer"
              color="text1"
              size="sm"
            />
          </div>
          <div class="relative-position">
            <div class="q-pa-md">
              <custodian-payments />
            </div>
          </div>
        </div>
      </div> -->
      <!-- end open payments -->
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import financialAccount from "components/ui/financial-account";
import helpBtn from "components/controls/help-btn";
import msigTransfer from "components/controls/msig-transfer";
import { saveAs } from "file-saver";
// import custodianPayments from "components/controls/custodian-payments";
import { colors, openURL } from "quasar";
export default {
  name: "dacFinancials",
  components: {
    msigTransfer,
    helpBtn,
    financialAccount
    // custodianPayments
  },
  data() {
    return {
      financialaccounts: this.$configFile.get("financialaccounts"),
      permissions_map: [],

      trx_qeue: this.$store.state.user.msigTransferQeue
    };
  },

  computed: {
    ...mapGetters({
      getIsDark: "ui/getIsDark",
      getMsigTransferQeue: "user/getMsigTransferQeue",
      getIsCustodian: "user/getIsCustodian"
    })
  },
  methods: {
    openURL,
    //status 0 = waiting for exec; 1 = sending; 2 = success; 3 = edit;
    addToQeue(el) {
      if (el.status === undefined) {
        el.status = 0;
      }
      this.$store.commit("user/setMsigTransferQeue", {
        mode: "add",
        qeue_entry: el
      });
    },
    removeFromQeue(qeue_index) {
      this.$store.commit("user/setMsigTransferQeue", {
        mode: "remove",
        qeue_entry: qeue_index
      });
    },
    clearQeue() {
      this.$store.commit("user/setMsigTransferQeue", { mode: "clear" });
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

      try {
        content = JSON.parse(content);
      } catch (e) {
        alert("Malformed import file !!", e);
        return;
      }

      for (let i = 0; i < content.length; i++) {
        let entry = content[i];
        //be sure precision is correct
        entry.asset.amount = parseFloat(entry.asset.amount).toFixed(
          entry.asset.precision
        );
        if (entry.trx_id != undefined && entry.trx_id != "") {
          entry.status = 2; //if trxid is present set status to executed
        }
        this.addToQeue(entry);
      }
      document.getElementById("myInput").value = "";
    },

    async getPermissions(accountname) {
      let from_permissions = this.permissions_map.find(
        pm => pm.account == accountname
      );
      if (from_permissions) return from_permissions.permissions;

      let account_permissions = (await this.$store.dispatch(
        "dac/fetchAccount",
        {
          accountname: accountname
        }
      )).permissions;
      if (account_permissions) {
        this.permissions_map.push({
          account: accountname,
          permissions: account_permissions
        });
        return account_permissions;
      }
    },

    async proposeAll() {
      this.$store.commit("ui/setEnableTransactionOverlay", false);
      for (let i = 0; i < this.trx_qeue.length; i++) {
        //only propose if not proposed yet
        if (this.trx_qeue[i].status == 0) {
          await this.proposeTransfer(i);
        }
      }
      this.$store.commit("ui/setEnableTransactionOverlay", true);
    },

    async proposeTransfer(trx_index) {
      let trx_data = this.trx_qeue[trx_index];

      //set status to the sending state 1
      trx_data.status = 1;

      let permission = "active"; //default to active
      let from_permissions = await this.getPermissions(trx_data.from);

      if (from_permissions) {
        const hasXfer = !!from_permissions.find(fp => fp.perm_name == "xfer");
        permission = hasXfer ? `xfer` : `active`;
      }

      let action = {
        account: trx_data.asset.contract,
        name: "transfer",
        data: {
          from: trx_data.from,
          to: trx_data.to,
          quantity:
            parseFloat(trx_data.asset.amount).toFixed(
              trx_data.asset.precision
            ) +
            " " +
            trx_data.asset.symbol,
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
        trx_data.proposal_name = res.proposal_name;
        trx_data.block_time = res.processed.block_time;
      } else {
        console.log(res);
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

    getChunkSize() {
      //col-xs-12 col-sm-6 col-lg-4
      let size = 1;
      if (this.$q.screen.gt.xs) {
        size = 2;
      }
      if (this.$q.screen.gt.sm) {
        size = 3;
      }
      return size;
    },

    downloadReport() {
      if (this.trx_qeue.length == 0) return;
      let data = JSON.parse(JSON.stringify(this.trx_qeue));
      data.forEach(d => {
        delete d.status;
      });
      let blob = new Blob([JSON.stringify(data, null, 4)], {
        type: "text/plain;charset=utf-8"
      });
      saveAs(blob, "msig_report.json");
    },
    viewTrx(trx_id) {
      openURL(`${this.$configFile.get("explorer")}/transaction/${trx_id}`);
    }
  }
};
</script>

<style>
.cust_only_overlay {
  background-color: var(--q-color-bg1);
  opacity: 0.9;
  font-size: 18px;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
