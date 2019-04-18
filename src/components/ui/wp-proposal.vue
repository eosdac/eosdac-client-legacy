<template>
  <div
    v-if="wp.id && show"
    style="min-height:100%"
    class=" q-pa-md column no-wrap justify-between bg-bg1 round-borders shadow-5 bg-logo animate-fade"
  >
    <div class="full-width">
      <div class="row relative-position">
        <profile-pic :accountname="wp.proposer" />
        <q-item>
          <q-item-main>
            <q-item-tile label>Proposer</q-item-tile>
            <q-item-tile sublabel>{{ wp.proposer }}</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-main>
            <q-item-tile label>Requested Pay</q-item-tile>
            <q-item-tile sublabel>{{ wp.pay_amount.quantity }}</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-main>
            <q-item-tile label>Arbitrator</q-item-tile>
            <q-item-tile sublabel>{{ wp.arbitrator }}</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item v-if="expanded">
          <q-item-main>
            <q-item-tile label>Submitted</q-item-tile>
            <q-item-tile sublabel>date</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-main>
            <q-item-tile label>Status</q-item-tile>
            <q-item-tile sublabel>{{ wp.status }}</q-item-tile>
          </q-item-main>
        </q-item>

        <q-btn
          v-if="!expanded"
          dense
          class="absolute-top-right text-text2"
          icon="fullscreen"
          flat
          @click="$emit('wp_expand', array_index)"
        />
        <q-btn
          v-if="expanded"
          dense
          class="absolute-top-right text-text2"
          icon="fullscreen_exit"
          flat
          @click="$emit('wp_compress')"
        />
      </div>

      <div class="q-my-md">
        <div class="q-caption q-mb-xs text-text2">Expiration</div>
        {{ getExpiryPercent }}
        <q-progress
          :percentage="wp_expiration"
          color="primary-light"
          style="height: 4px"
        />
      </div>

      <div class="q-mt-sm q-title text-weight-thin">
        <span class="capitalize">{{ wp.title }}</span>
        <span class="q-caption on-right"
          >({{
            $t(`wp_categories.${getCategoryNameFromId(wp.category)}`)
          }})</span
        >
      </div>
      <q-scroll-area
        class="bg-bg2  q-mt-sm round-borders text-weight-light text-text2"
        :style="scroll_area_style"
        color="primary"
        :thumb-style="{
          right: '0px',
          background: '#7c41ba',
          width: '8px',
          opacity: 1
        }"
        :delay="1500"
      >
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
          :dark="getIsDark"
          :text="wp.summary"
        />
      </q-scroll-area>

      <div
        v-if="expanded"
        class="row justify-between q-mt-xs items-center q-body-1"
      >
        <span class="text-text2">ID {{ wp.id }}</span>
        <a
          target="_blank"
          :href="$configFile.get('explorer') + `/transaction/${wp.trx_id}`"
          >{{ $helper.truncate(wp.trx_id, 10) }}</a
        >
      </div>
    </div>

    <div class="q-mt-md full-width">
      <div class="row justify-between items-center">
        <div class="row">
          <div
            v-for="(vote, i) in getVotes.filter(v => v.vote == 1)"
            :key="`v1${i}`"
            class="bg-positive"
          >
            <div><profile-pic :accountname="vote.voter" :scale="0.7" /></div>
          </div>
          <div
            v-for="(vote, i) in getVotes.filter(v => v.vote == 2)"
            :key="`v2${i}`"
            class="bg-negative"
          >
            <div><profile-pic :accountname="vote.voter" :scale="0.7" /></div>
          </div>
        </div>

        <div v-if="!read_only && getAccountName" class="row animate-pop">
          <div v-if="wp.status == 0">
            <q-btn
              v-if="getVoterStatus == 2 || getVoterStatus == 0"
              class="on-right"
              color="positive"
              label="Approve"
              @click="voteprop('voteApprove')"
            />
            <q-btn
              v-if="getVoterStatus == 1 || getVoterStatus == 0"
              class="on-right"
              color="negative"
              label="Deny"
              @click="voteprop('voteDeny')"
            />
          </div>
          <div v-else-if="wp.status == 2">
            <q-btn
              class="on-right"
              color="positive"
              label="Approve Claim"
              @click="voteprop('claimApprove')"
            />
            <q-btn
              class="on-right"
              color="negative"
              label="Deny Claim"
              @click="voteprop('claimDeny')"
            />
            <q-btn
              v-if="getIsArbitrator"
              class="on-right"
              flat
              color="positive"
              label="arb approve"
              @click="arbApprove()"
            />
          </div>
          <div v-else-if="wp.status == 1">
            Work is being executed
          </div>
          <div v-if="getIsCreator">
            <q-btn
              class="on-right"
              flat
              color="negative"
              label="cancel"
              @click="cancelProp()"
            />
            <q-btn
              v-if="proposal_threshold_met"
              class="on-right"
              flat
              color="info"
              label="Start work"
              @click="startWork()"
            />
            <q-btn
              v-if="wp.status == 1"
              class="on-right"
              flat
              color="info"
              label="complete work"
              @click="completeWork()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import profilePic from "components/ui/profile-pic";
import MarkdownViewer from "components/ui/markdown-viewer";
import wpcats from "../../extensions/statics/config/wp_categories.json";

import { date } from "quasar";
const { addToDate } = date;

export default {
  name: "wpProposal",
  components: {
    profilePic,
    MarkdownViewer
  },
  props: {
    array_index: null,
    read_only: false,
    wp: {
      type: Object,
      default: () => {
        return {};
      }
    },
    expanded: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: true,
      wp_expiration: this.$helper.randomIntFromInterval(10, 100)
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "user/getAccountName",
      getWpConfig: "dac/getWpConfig",
      getIsDark: "ui/getIsDark",
      getAuth: "user/getAuth"
    }),
    scroll_area_style() {
      if (this.expanded) {
        return { height: "400px", width: "100%" };
      } else {
        return { height: "200px", width: "100%" };
      }
    },
    getVotes() {
      if (this.wp.votes) {
        return this.wp.votes;
      } else {
        return [];
      }
    },
    getIsCreator() {
      return this.getAccountName === this.wp.proposer;
    },
    getIsArbitrator() {
      return this.getAccountName === this.wp.arbitrator;
    },
    //get vote type of logged in user
    getVoterStatus() {
      let myvote = this.wp.votes.find(v => v.voter == this.getAccountName);
      if (!myvote) {
        return 0;
      } else {
        return myvote.vote;
      }
    },
    //when wp state is 0
    proposal_threshold_met() {
      if (!this.wp.votes) return false;
      const approved_votes = this.wp.votes.filter(wpv => wpv.vote == 1).length;
      if (
        this.getWpConfig.proposal_threshold !== null &&
        this.getWpConfig.proposal_threshold <= approved_votes
      ) {
        return true;
      } else {
        return false;
      }
    },
    //when wp state is 2
    claim_threshold_met() {
      const approved_claim = this.wp.votes.filter(wpv => wpv.vote == 3).length;
      if (
        this.getWpConfig.claim_threshold !== null &&
        this.getWpConfig.claim_threshold <= approved_claim
      ) {
        return true;
      } else {
        return false;
      }
    },
    getExpiryPercent() {
      let expiration_seconds;
      if (this.wp.status === 0) {
        expiration_seconds = Number(this.getWpConfig.approval_expiry);
      }
      if (this.wp.status === 2) {
        expiration_seconds = Number(this.getWpConfig.claim_expiry);
      }
      const expiration_days = expiration_seconds / 60 / 60 / 24;
      //todo calculate relative expiration based on NOW and expiration
      let expirationdate = addToDate(new Date(this.wp.block_timestamp), {
        days: expiration_days
      });
      return expirationdate;
    }
  },

  methods: {
    getCategoryNameFromId(id) {
      let wpc = wpcats.find(wpc => wpc.value == id);
      return wpc.label;
    },
    async delegatevote() {
      let actions = [
        {
          account: this.$configFile.get("wpcontract"),
          name: "delegatevote",
          //todo get permission from account instead hardcoding it
          authorization: [
            { actor: this.getAccountName, permission: this.getAuth },
            {
              actor: this.$configFile.get("authaccountname"),
              permission: "one"
            }
          ],
          data: {
            custodian: this.getAccountName,
            proposal_id: Number(this.wp.id),
            dalegatee_custodian: "piecesnbitss", //xxxx
            dac_scope: this.$configFile.get("authaccountname") //xxx
          }
        }
      ];
      let result = await this.$store.dispatch("user/transact", {
        actions: actions
      });
      if (result) {
        console.log(result);
      }
    },

    async voteprop(votetype) {
      const map = {
        voteApprove: 1,
        voteDeny: 2,
        claimApprove: 3,
        claimDeny: 4
      };

      let actions = [
        {
          account: this.$configFile.get("wpcontract"),
          name: "voteprop",
          authorization: [
            { actor: this.getAccountName, permission: this.getAuth },
            {
              actor: this.$configFile.get("authaccountname"),
              permission: "one"
            }
          ],
          data: {
            custodian: this.getAccountName,
            proposal_id: Number(this.wp.id),
            vote: map[votetype],
            dac_scope: this.$configFile.get("authaccountname") //xxx
          }
        }
      ];

      let result = await this.$store.dispatch("user/transact", {
        actions: actions
      });
      if (result) {
        let vote = this.wp.votes.find(v => v.voter == this.getAccountName);

        if (vote) {
          vote.vote = map[votetype];
        } else {
          this.wp.votes.push({
            proposal_id: Number(this.wp.id),
            voter: this.getAccountName,
            vote: map[votetype],
            comment_hash: ""
          });
        }

        console.log(result);
      }
    },
    async cancelProp() {
      let actions = [
        {
          account: this.$configFile.get("wpcontract"),
          name: "cancel",
          authorization: [
            { actor: this.getAccountName, permission: this.getAuth },
            {
              actor: this.$configFile.get("authaccountname"),
              permission: "one"
            }
          ],
          data: {
            proposal_id: Number(this.wp.id),
            dac_scope: this.$configFile.get("authaccountname") //xxx
          }
        }
      ];

      let result = await this.$store.dispatch("user/transact", {
        actions: actions
      });
      if (result) {
        this.show = false;
        console.log(result);
      }
    },
    async startWork() {
      let actions = [
        {
          account: this.$configFile.get("wpcontract"),
          name: "startwork",
          // authorization: [ {actor: this.getAccountName, permission: 'active'}],
          data: {
            proposal_id: Number(this.wp.id),
            dac_scope: this.$configFile.get("authaccountname") //xxx
          }
        }
      ];

      let result = await this.$store.dispatch("user/transact", {
        actions: actions
      });
      if (result) {
        console.log(result);
      }
    },
    async completeWork() {
      let actions = [
        {
          account: this.$configFile.get("wpcontract"),
          name: "completework",
          // authorization: [ {actor: this.getAccountName, permission: 'active'}],
          data: {
            proposal_id: Number(this.wp.id),
            dac_scope: this.$configFile.get("authaccountname") //xxx
          }
        }
      ];

      let result = await this.$store.dispatch("user/transact", {
        actions: actions
      });
      if (result) {
        console.log(result);
      }
    },

    async arbApprove() {
      let actions = [
        {
          account: this.$configFile.get("wpcontract"),
          name: "arbapprove",
          // authorization: [ {actor: this.getAccountName, permission: 'active'}],
          data: {
            arbitrator: this.getAccountName,
            proposal_id: Number(this.wp.id),
            dac_scope: this.$configFile.get("authaccountname") //xxx
          }
        }
      ];

      let result = await this.$store.dispatch("user/transact", {
        actions: actions
      });
      if (result) {
        console.log(result);
      }
    },

    async finalize() {
      let actions = [
        {
          account: this.$configFile.get("wpcontract"),
          name: "finalize",
          // authorization: [ {actor: this.getAccountName, permission: 'active'}],
          data: {
            proposal_id: Number(this.wp.id),
            dac_scope: this.$configFile.get("authaccountname") //xxx
          }
        }
      ];

      let result = await this.$store.dispatch("user/transact", {
        actions: actions
      });
      if (result) {
        console.log(result);
      }
    }
  }
};

//  wp status: pending_approval == 0, work_in_progress == 1 after approved when a worker is working on the WP, and pending_claim == 2

// enum VoteType {
//             none = 0,
//             // a vote type to indicate a custodian's approval of a worker proposal.
//            1= proposal_approve,
//             // a vote type to indicate a custodian's denial of a worker proposal.
//             2=proposal_deny,
//             // a vote type to indicate a custodian's acceptance of a worker proposal as completed.
//            3= claim_approve,
//             // a vote type to indicate a custodian's rejection of a worker proposal as completed.
//            4= claim_deny
//         };

// The values only support integers on the input into the contract. Inside the values are cast to Doubles for the percentage calculation and then assert for >= to required perecentage
// eg. double(approved_count) / double(approved_count + deny_count) * 100.0
</script>

<style></style>
