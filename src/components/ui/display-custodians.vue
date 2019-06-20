<template>
  <div>
    <div v-if="getCustodianState.met_initial_votes_threshold === 1">
      <div class="row items-center justify-between ">
        <div class="q-headline">
          {{ $t("vote_custodians.custodian_board") }}
        </div>
        <div class="row">
          <div class="text-text2 q-mr-sm q-caption">New election in</div>
          <countdown
            v-if="new_period_millisleft"
            :time="Number(new_period_millisleft)"
          >
            <template slot-scope="props">
              <div class="q-caption text-weight-light q-mb-xs">
                <span v-if="props.days">{{ props.days }} days, </span>
                <span v-if="props.hours">{{ props.hours }} hours, </span>
                <span v-if="props.minutes">{{ props.minutes }} minutes, </span>
                <span>{{ props.seconds }} seconds</span>
              </div>
            </template>
          </countdown>
        </div>
      </div>
      <div class="row justify-between " v-if="custodians.length">
        <div
          class="column items-center q-pa-sm animate-fade"
          v-for="(custodian, i) in custodians"
          :key="`cust_${i}`"
          @mouseover="showing = true"
        >
          <profile-pic
            :accountname="custodian.cust_name"
            :scale="1"
            :show_role="true"
          />
          <router-link
            class="q-body-1 a2 q-mt-xs"
            :to="{ path: '/profile/' + custodian.cust_name }"
          >
            <div class="q-ma-none">{{ custodian.cust_name }}</div>
          </router-link>
          <q-tooltip v-model="custodian.tooltip" class="bg-primary">
            <div>Votes: {{ custodian.total_votes / 10000 }}</div>
            <div>Pay: {{ custodian.requestedpay }}</div>
          </q-tooltip>
        </div>
      </div>
    </div>
    <div v-else-if="getCustodianState.met_initial_votes_threshold === 0">
      <div class="q-headline q-mb-md">
        <span>DAC Locked</span>
        <span class="text-text2 q-title on-right"
          >{{ getVotingProgress.toFixed(2) }}% of
          {{ getCustodianConfig.initial_vote_quorum_percent }}%</span
        >
      </div>
      <q-progress
        animate
        stripe
        class="round-borders"
        style="height:20px"
        color="positive"
        :percentage="getVotingProgress"
      />
    </div>
  </div>
</template>

<script>
import profilePic from "./profile-pic";
import { mapGetters } from "vuex";
import countdown from "@chenfengyuan/vue-countdown";
import { date } from "quasar";
const { addToDate } = date;

export default {
  name: "displayCustodians",
  components: {
    profilePic,
    countdown
  },

  props: {
    data: Object
  },

  data() {
    return {
      custodians: [],
      showing: false
    };
  },

  computed: {
    ...mapGetters({
      getCustodians: "dac/getCustodians",
      getCustodianState: "dac/getCustodianState",
      getCustodianConfig: "dac/getCustodianConfig"
    }),
    getVotingProgress() {
      if (this.getCustodianState.total_weight_of_votes !== null) {
        let totalsupply = 1000000000.0 * 10000;

        return (
          (this.getCustodianState.total_weight_of_votes / totalsupply) * 100
        );
      } else {
        return 0;
      }
    },
    new_period_millisleft() {
      if (
        this.getCustodianConfig.periodlength &&
        this.getCustodianState.lastperiodtime
      ) {
        // let lastperiodtime = "2019-05-14T18:42:26";
        let lastperiodtime = this.getCustodianState.lastperiodtime;
        if (Number.isInteger(lastperiodtime)) {
          lastperiodtime = new Date(lastperiodtime * 1000);
        } else {
          // example "2019-05-06 18:34:46"
          lastperiodtime = new Date(
            Date.parse(lastperiodtime.replace(" UTC", ""))
          );
        }
        let end = addToDate(lastperiodtime, {
          seconds: this.getCustodianConfig.periodlength
        });
        return (
          Date.parse(date.formatDate(end, "YYYY-MM-DD HH:mm:ss")) -
          Date.parse(new Date())
        );
      }
    }
  },

  methods: {
    async setCustodians() {
      let custodians;
      if (!this.getCustodians) {
        custodians = await this.$store.dispatch("dac/fetchCustodians");
      } else {
        custodians = this.getCustodians;
      }
      this.custodians = custodians.map(c => {
        c.tooltip = false;
        return c;
      });
    }
  },

  async mounted() {
    if (this.getCustodians) {
      this.setCustodians();
    }
    if (this.getCustodianState.met_initial_votes_threshold === null) {
      this.$store.dispatch("dac/fetchCustodianContractState");
    }
  },

  watch: {
    getCustodians(oldval, newval) {
      if (newval) {
        this.setCustodians();
      }
    }
  }
};
</script>

<style lang="stylus">
@import '~variables'

.loading {
  opacity: 0;
  transition: opacity .4s ease-out;
}

.loaded {
  opacity: 1;
}
</style>
