<template>
  <div class="text-text1">
    <div class="text-text1">
      <div class="row justify-between">
        <div class="row ">
          <q-item class="animate-pop">
            <q-item-side icon="timer" color="text2" />
            <q-item-main style="margin-left:-5px">
              <q-item-tile class="text-text1 q-body1" label
                >Trx Delay</q-item-tile
              >
              <q-item-tile class="text-text2" sublabel
                >{{ getSettingByName("trx_delay").value }} seconds</q-item-tile
              >
            </q-item-main>
          </q-item>
          <q-item class="animate-pop">
            <q-item-side :icon="$configFile.icon.action" color="text2" />
            <q-item-main style="margin-left:-5px">
              <q-item-tile class="text-text1 q-body1" label
                >Actions</q-item-tile
              >
              <q-item-tile class="text-text2" sublabel>{{
                actions.length
              }}</q-item-tile>
            </q-item-main>
          </q-item>
        </div>

        <div class="">
          <q-btn
            v-if="actions.length"
            label="view all actions"
            class="on-left animate-pop"
            icon="pageview"
            color="primary"
            @click="view_actions_modal = true"
          />
          <q-btn
            v-if="!msigMode"
            :disabled="!actions.length"
            color="positive"
            class="animate-fade"
            @click="pushTransaction"
            label="Push TRX"
          />
          <q-btn
            v-if="msigMode"
            :disabled="!actions.length"
            color="positive"
            class="animate-fade"
            @click="proposeMsig"
            label="push msig"
          />
        </div>
      </div>

      <div
        class="row q-mb-md bg-bg2 q-pa-md q-mt-md round-borders"
        style="min-height:80px"
      >
        <draggable
          v-model="actions"
          group="actions"
          @start="drag = true"
          @end="drag = false"
          style="display:flex"
        >
          <display-action
            v-for="(action, i) in actions"
            :action="action"
            closable
            viewable
            @close="deleteAction(i)"
            :key="`a${i}`"
            class="cursor-pointer"
          />
        </draggable>
        <span class="text-negative text-weight-light" v-if="!actions.length"
          >No actions added yet. You can add multiple actions to the
          transaction. Drag/Drop to change order.</span
        >
      </div>

      <q-tabs
        :dark="getIsDark"
        color="primary"
        swipeable
        ref="trx_builder_tabs"
      >
        <q-tab slot="title" name="tab-1" :label="`Add Action`" default />
        <q-tab
          slot="title"
          name="tab-2"
          :label="`Msig Options`"
          v-if="msigMode"
        />
        <q-tab-pane
          keep-alive
          name="tab-1"
          class="text-text1  tb-builder-pane-height no-padding"
        >
          <action-maker
            @actiondata="addAction"
            :prefill="{ from: getAccountName }"
          />
        </q-tab-pane>

        <q-tab-pane
          keep-alive
          name="tab-2"
          class="text-text1  tb-builder-pane-height no-padding"
        >
          <div class="row gutter-sm q-pa-md">
            <div v-if="is_personal_msig" class="col-xs-12 col-md-6 col-lg-4">
              <div class="bg-bg1 q-pa-md round-borders full-height">
                <div class="text-text2">
                  Add a proposal name and requested signatures to your personal
                  msig.
                </div>

                <q-input
                  :dark="getIsDark"
                  stack-label="Proposal Name"
                  v-model="msig_proposal_name"
                  class="q-mb-lg"
                />
                <div
                  class="row justify-between items-center q-pa-xs"
                  style="border-bottom:1px solid grey"
                >
                  <div class="q-body1">Requested Signatures</div>
                  <div class="no-wrap row items-center">
                    <q-input
                      v-model="new_requested_signature"
                      class="bg-bg2 q-pa-xs q-mr-xs round-borders"
                      hide-underline
                      placeholder="actor@permission"
                      :dark="getIsDark"
                    />
                    <q-btn
                      round
                      dense
                      icon="add"
                      color="primary"
                      @click="addRequestedSignature(new_requested_signature)"
                    />
                  </div>
                </div>
                <div class="row bg-dark">
                  <div
                    class="q-py-md q-ml-md text-negative"
                    v-if="!msig_requested_signatures.length"
                  >
                    No signatures added yet
                  </div>
                  <div
                    v-for="(req, i) in msig_requested_signatures"
                    :key="`rs${i}`"
                    class="row items-center bg-bg2 round-borders q-ma-sm q-pl-xs"
                  >
                    <q-icon
                      name="mdi-shield-account"
                      class=" text-text2 on-left"
                      size="16px"
                    />
                    <div>{{ `${req.actor}@${req.permission}` }}</div>
                    <q-btn
                      icon="close"
                      flat
                      dense
                      color="negative"
                      class="on-right"
                      @click="msig_requested_signatures.splice(i, 1)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!is_personal_msig" class="col-xs-12 col-md-6 col-lg-4">
              <div class="bg-bg1 q-pa-md round-borders full-height">
                <span class="text-text2"
                  >Add a Title and Description to your proposal.</span
                >
                <q-input
                  :dark="getIsDark"
                  stack-label="Title"
                  v-model="msig_title"
                  class="q-mb-md"
                />
                <div class="q-caption q-mb-sm">Description</div>
                <MarkdownViewer
                  :tags="[
                    'h1',
                    'h2',
                    'h3',
                    'italic',
                    'bold',
                    'underline',
                    'strikethrough',
                    'subscript',
                    'superscript',
                    'anchor',
                    'orderedlist',
                    'unorderedlist'
                  ]"
                  :edit="true"
                  :dark="getIsDark"
                  :text="msig_description"
                  v-on:update="updateText"
                />
              </div>
            </div>
            <div class="col-xs-12 col-md-6 col-lg-4">
              <div class="bg-bg1 q-pa-md round-borders">
                <span class="text-text2"
                  >Set a date when the msig proposal should expire. The msig
                  transaction wll not be executable after this date even if
                  enough signatures are collected.</span
                >
                <q-datetime-picker
                  minimal
                  :dark="getIsDark"
                  class="no-border q-mt-sm round-borders"
                  color="positive"
                  v-model="msig_expiration"
                  :min="mindate"
                  :max="maxdate"
                  type="date"
                />
              </div>
            </div>
            <div class="col-xs-12 col-md-6 col-lg-4">
              <div>
                <div class="bg-bg1 q-pa-md round-borders q-mb-md">
                  <span class="text-text2"
                    >Add an execution delay to the msig transaction. When the
                    proposal receives enough votes it will be executed with the
                    set delay.</span
                  >
                  <q-input
                    :min="0"
                    :step="1"
                    :dark="getIsDark"
                    stack-label="Delay (sec)"
                    type="number"
                    v-model="msig_delay"
                    color="primary-light"
                  />
                </div>
                <div class="bg-bg1 q-pa-md round-borders">
                  <div class="text-text2 q-mb-sm">
                    By default the msig will be sent in the name of the DAC and
                    shown to the custodians for voting. By enabling personal
                    mode you can sent msigs outside the scope of the DAC.
                  </div>
                  <q-toggle
                    :dark="getIsDark"
                    color="primary-light"
                    v-model="is_personal_msig"
                  />
                  <span
                    v-if="is_personal_msig"
                    class="on-right animate-fade q-caption text-positive"
                  >
                    personal msig!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </q-tab-pane>
      </q-tabs>

      <div class="row q-mt-md">
        <q-item class="animate-pop no-padding">
          <q-item-main>
            <q-item-tile class="text-text1 q-body1" label
              >Msig-mode</q-item-tile
            >
            <q-item-tile sublabel>
              <q-toggle
                :dark="getIsDark"
                color="primary-light"
                v-model="msigMode"
                :left-label="true"
              />
            </q-item-tile>
          </q-item-main>
        </q-item>
        <!-- <q-item class="animate-pop no-padding on-right">
          <q-item-main>
            <q-item-tile class="text-text1 q-body1" label
              >Broadcast</q-item-tile
            >
            <q-item-tile sublabel>
              <q-toggle
                :dark="getIsDark"
                color="primary-light"
                v-model="broadcast"
              />
            </q-item-tile>
          </q-item-main>
        </q-item> -->
      </div>
    </div>

    <!-- review modal -->
    <q-modal maximized v-model="view_actions_modal">
      <div
        style="height:50px"
        class="bg-bg1 row items-center justify-between q-px-md text-text1"
      >
        <span>Review Actions</span>
        <q-btn icon="close" @click="view_actions_modal = false" flat dense />
      </div>
      <div class="q-pa-md bg-bg2 text-text1 full-height ">
        <div v-html="prettyHtml(actions)" class="overflow-hidden" />
      </div>
    </q-modal>
  </div>
</template>

<script>
const prettyHtml = require("json-pretty-html").default;
import { mapGetters } from "vuex";
import actionMaker from "components/controls/action-maker";
import displayAction from "components/ui/display-action";

import MarkdownViewer from "components/ui/markdown-viewer";

import draggable from "vuedraggable";
import { date } from "quasar";
const today = new Date();
const { addToDate } = date;

export default {
  name: "transactionBuilder",
  components: {
    actionMaker,
    displayAction,
    draggable,

    MarkdownViewer
  },

  data() {
    return {
      drag: false,
      new_requested_signature: "",

      actions: [],
      view_actions_modal: false,
      broadcast: true,
      msigMode: false,

      is_personal_msig: false,
      msig_proposal_name: "",
      msig_requested_signatures: [],

      msig_title: "",
      msig_description: "",

      msig_delay: 0,
      msig_expiration: new Date(
        new Date().getTime() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      mindate: today,
      maxdate: addToDate(today, { days: 14 })
    };
  },

  computed: {
    ...mapGetters({
      getAccountName: "user/getAccountName",
      getIsDark: "ui/getIsDark",
      getSettingByName: "user/getSettingByName",
      getAuthString: "user/getAuthString",
      getCustodianPermissions: "dac/getCustodianPermissions",
      getCustodianConfig: "dac/getCustodianConfig"
    }),

    parseNumberToAsset(number, symbol) {
      return `${number.toFixed(4)} ${symbol}`;
    },
    verifyStep2() {
      return true;
    }
  },

  methods: {
    prettyHtml,
    updateText(val) {
      this.msig_description = val;
    },
    addAction(data) {
      this.actions.push(data);
    },

    deleteAction(i) {
      this.actions.splice(i, 1);
    },

    async pushTransaction() {
      let result = await this.$store.dispatch("user/transact", {
        actions: this.actions,
        options: { broadcast: this.broadcast }
      });
      if (result) {
        console.log("transaction callback", result);
        this.actions = [];
        // this.latest_trx_id = result.transaction_id
      }
    },

    async proposeMsig() {
      let msigOptions = {
        actions: this.actions,
        expiration: this.msig_expiration.split(".")[0],
        delay_sec: this.msig_delay,
        title: this.msig_title,
        description: this.msig_description,
        is_personal_msig: this.is_personal_msig
      };
      if (this.is_personal_msig) {
        msigOptions.proposal_name = this.msig_proposal_name;
        msigOptions.requested = this.msig_requested_signatures;
      }
      console.log(msigOptions);
      let result = await this.$store.dispatch(
        "user/proposeMsig",
        JSON.parse(JSON.stringify(msigOptions))
      );
      if (result) {
        console.log("transaction callback", result);
        this.actions = [];
        // this.latest_trx_id = result.transaction_id
      }
    },
    async loadCustPermissions() {
      this.msig_requested_signatures =
        this.getCustodianPermissions ||
        (await this.$store.dispatch("dac/fetchCustodianPermissions"));
    },

    addRequestedSignature(authstring) {
      if (authstring == "") {
        return;
      }
      let [actor, perm] = authstring.split("@");
      if (!actor || !perm) {
        this.new_auth = "";
        return;
      }
      this.msig_requested_signatures.push({ actor: actor, permission: perm });
      this.new_requested_signature = "";
    }
  },
  watch: {
    msigMode: function(newv, oldv) {
      if (newv == false) {
        console.log(this.$refs.trx_builder_tabs);
        this.$refs.trx_builder_tabs.selectTab("tab-1");
      }
    }
  }
};
</script>

<style lang="stylus">
@import '~variables'

.tb-builder-pane-height{
  min-height: 420px;
  background-color: var(--q-color-bg2)
}
</style>
