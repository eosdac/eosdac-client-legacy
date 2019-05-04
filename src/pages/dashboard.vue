<template>
  <q-page class="q-pa-md">
    <div class="bg-bg1 shadow-5 round-borders q-pa-md q-mb-md">
      <div class="q-headline">Custodian Board</div>
      <display-custodians />
    </div>

    <div v-if="getAccountName" class="row gutter-sm">
      <!-- box profile -->
      <div class="col-xs-12 col-md-6 col-xl-4">
        <div
          class="bg-bg1 round-borders shadow-5 q-pa-md bg-logo dashboard-box"
        >
          <q-item class="no-padding">
            <q-item-side left>
              <div class="q-pa-md">
                <profile-pic :accountname="getAccountName" :scale="1.5" />
              </div>
            </q-item-side>
            <q-item-main>
              <q-item-tile label class="q-headline capitalize">{{
                getAccountName
              }}</q-item-tile>
              <q-item-tile sublabel>info</q-item-tile>
            </q-item-main>
          </q-item>

          <q-item class="no-padding q-mt-lg">
            <q-item-main>
              <q-item-tile label>
                <div class="row justify-start items-center">
                  <span class="q-headline text-text1 q-mr-sm">My Votes</span>
                  <q-btn
                    class="animate-pop"
                    dense
                    size="sm"
                    color="bg2"
                    to="/vote-custodians"
                    :label="getDacVotes ? 'change votes' : 'vote'"
                  />
                </div>
              </q-item-tile>
              <q-item-tile>
                <div v-if="getDacVotes" class="row">
                  <div
                    v-for="(vote, i) in getDacVotes"
                    class="column"
                    :key="`${i}v`"
                  >
                    <profile-pic
                      class="animate-pop"
                      :accountname="vote"
                      :scale="0.7"
                    />
                  </div>
                </div>
                <div v-else class="text-text2">
                  You have not voted yet.
                </div>
              </q-item-tile>
            </q-item-main>
          </q-item>
        </div>
      </div>
      <!-- box profile -->

      <div v-if="getIsCustodian" class="col-xs-12 col-md-6 col-xl-4">
        <div
          class="bg-bg1 round-borders shadow-5 q-pa-md bg-logo dashboard-box full-height"
        >
          <q-item class="no-padding" style="margin-left:-10px;margin-top:-10px">
            <q-item-side left>
              <div class="">
                <q-icon
                  :name="$configFile.icon.cust_symbol"
                  color="warning"
                  size="70px"
                />
              </div>
            </q-item-side>
            <q-item-main>
              <q-item-tile label class="q-headline">Custodian</q-item-tile>
              <q-item-tile sublabel>info</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item class="no-padding q-mt-sm">
            <q-item-main>
              <q-item-tile label class="q-headline">Tools</q-item-tile>
              <q-item-tile>
                <div class="row">
                  <q-btn
                    class="animate-pop q-ma-xs"
                    color="bg2"
                    to="/custodian/review-msigs"
                    label="View Msigs"
                  />
                  <q-btn
                    class="animate-pop q-ma-xs"
                    color="bg2"
                    to="/custodian/create-msigs"
                    label="Propose Msigs"
                  />
                  <q-btn
                    class="animate-pop q-ma-xs"
                    color="bg2"
                    icon="icon-social-discord-com"
                    @click="openURL('https://discord.gg/8ARMTmG')"
                    label="Discord"
                  />
                  <q-btn
                    disabled
                    class="animate-pop q-ma-xs"
                    color="bg2"
                    to="/custodian/create-msigs"
                    label="Review Proposals"
                  />
                </div>
              </q-item-tile>
            </q-item-main>
          </q-item>
        </div>
      </div>

      <div class="col-xs-12 col-md-6 col-xl-4">
        <div class="bg-bg1 round-borders shadow-5 q-pa-md full-height bg-logo">
          <period-timer />
          <div class="text-text2 q-mt-md">
            A new custodian board will be elected every 7 days when the timer
            expires.
          </div>
        </div>
      </div>

      <div class="col-xs-12 col-md-6 col-xl-8">
        <div class="bg-bg1 round-borders shadow-5 q-pa-md full-height">
          <balance-timeline
            :account="getAccountName"
            :contract="this.$configFile.get('tokencontract')"
            :symbol="this.$configFile.get('dactokensymbol')"
          />
        </div>
      </div>
    </div>

    <div class="row justify-end">
      <div class="text-weight-thin q-pa-md q-caption">
        Memberclient: v{{ getDapp_version }} · Local Storage: v{{
          getLocal_storage_version
        }}
        · Network: {{ getActiveNetworkName }}
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import profilePic from "components/ui/profile-pic";
import displayCustodians from "components/ui/display-custodians";
import periodTimer from "components/ui/period-timer";
import balanceTimeline from "components/ui/balance-timeline";

import { openURL } from "quasar";
export default {
  name: "Grid",
  components: {
    profilePic,
    displayCustodians,
    periodTimer,
    balanceTimeline
  },
  computed: {
    ...mapGetters({
      getAccountName: "user/getAccountName",
      getDacVotes: "user/getDacVotes",
      getLocal_storage_version: "global/getLocal_storage_version",
      getDapp_version: "global/getDapp_version",
      getActiveNetworkName: "global/getActiveNetworkName",
      getIsCustodian: "user/getIsCustodian"
    })
  },
  data() {
    return {};
  },
  methods: {
    openURL
  },
  mounted() {}
};
</script>

<style>
.dashboard-box {
  min-height: 250px;
  overflow: hidden;
}
</style>
