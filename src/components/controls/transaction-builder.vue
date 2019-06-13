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

      <q-tabs :dark="getIsDark" color="primary" swipeable>
        <q-tab slot="title" name="tab-1" :label="`Add Action`" default />
        <q-tab
          slot="title"
          name="tab-2"
          :label="`Requested Signatures`"
          v-if="msigMode"
        />
        <q-tab slot="title" name="tab-3" :label="`Options`" v-if="msigMode" />
        <q-tab-pane
          name="tab-1"
          class="text-text1  tb-builder-pane-height no-padding"
        >
          <action-maker
            @actiondata="addAction"
            :prefill="{ from: getAccountName }"
          />
        </q-tab-pane>
        <q-tab-pane
          name="tab-2"
          class="text-text1  tb-builder-pane-height no-padding"
        >
          <div class="q-pa-md bg-bg2">
            <q-btn label="load" @click="loadCustPermissions" />
            <div class="row">
              <div
                class="row items-center relative-position bg-bg1 round-borders q-pr-md q-ma-sm"
                v-for="(c, i) in msig_requested_signatures"
                :key="i + 'r'"
              >
                <profile-pic
                  :accountname="c.actor"
                  :scale="0.5"
                  :show_role="true"
                />
                <router-link class="a2" :to="{ path: '/profile/' + c.actor }">
                  <div
                    class="q-ma-none"
                    style="min-width:100px; overflow:hidden"
                  >
                    {{ c.actor }}
                  </div>
                  <div class="q-caption text-text2">@{{ c.permission }}</div>
                </router-link>
              </div>
            </div>
          </div>
        </q-tab-pane>
        <q-tab-pane
          name="tab-3"
          class="text-text1  tb-builder-pane-height no-padding"
        >
          <div class="row gutter-sm q-pa-md">
            <div class="col-xs-12 col-md-6">
              <div>
                <q-datetime-picker
                  minimal
                  :dark="getIsDark"
                  class="bg-bg2 no-border"
                  color="positive"
                  v-model="msig_expiration"
                  :min="mindate"
                  :max="maxdate"
                  type="date"
                />
              </div>
            </div>
            <div class="col-xs-12 col-md-6">
              <div>
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
        <q-item class="animate-pop no-padding on-right">
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
        </q-item>
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
import profilePic from "components/ui/profile-pic";

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
    profilePic
  },

  data() {
    return {
      drag: false,

      actions: [],
      view_actions_modal: false,
      broadcast: true,
      msigMode: false,

      msig_requested_signatures: [],
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
      getCustodianPermissions: "dac/getCustodianPermissions"
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
        delay_sec: this.msig_delay
      };
      console.log(msigOptions);
      let result = await this.$store.dispatch("user/proposeMsig", msigOptions);
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
