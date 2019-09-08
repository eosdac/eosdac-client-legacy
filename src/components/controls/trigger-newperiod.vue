<template>
  <transition
    appear
    enter-active-class="animated fadeInUp"
    leave-active-class="animated fadeOutDown"
  >
    <div
      v-if="getAccountName && time_flag && showHere && NeedFirstNewPeriod"
      v-bind:class="{ 'drawer-margin': getDrawerIsOpen }"
      class=" trigger_new_period_msg bg-blue q-pa-md bg-logo fixed"
    >
      <div class="row justify-between items-center q-mb-md ">
        <div class="q-title">{{ $t("default.call_new_period") }}</div>
        <q-btn class="no-shadow" icon="close" @click="close" />
      </div>

      <div class="q-mb-md full-width">
        The DAC is unlocked but newperiod should be called manually for the
        first time.
        <!-- <pre>{{ getCustodianState }}</pre> -->
      </div>

      <div class="row justify-end">
        <q-btn
          color="primary-light"
          icon="receipt"
          @click="callNewPeriod"
          :label="$t('default.start_new_period')"
        />
      </div>
      <div style="clear:both"></div>
    </div>
  </transition>
</template>

<script>
var TIMER;
import { mapGetters } from "vuex";
export default {
  // name: 'ComponentName',
  data() {
    return {
      showHere: false,
      time_flag: false
    };
  },
  computed: {
    ...mapGetters({
      getAccountName: "user/getAccountName",
      getCustodianState: "dac/getCustodianState",
      getDrawerIsOpen: "ui/getDrawerIsOpen"
    }),

    NeedFirstNewPeriod() {
      if (
        this.getCustodianState.met_initial_votes_threshold === 1 &&
        new Date(
          this.getCustodianState.lastperiodtime + ".000+00:00"
        ).getTime() === 0
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    startTimer(ms) {
      TIMER = setInterval(() => {
        this.time_flag = true;
      }, ms);
    },
    stopTimer() {
      clearInterval(TIMER);
      this.time_flag = false;
    },
    close() {
      this.stopTimer();
      this.startTimer(10000); //reapear after user has closed
    },
    async callNewPeriod() {
      let actions = [
        {
          account: this.$configFile.get("custodiancontract"),
          name: "newperiode",
          data: {
            message: `First new period called by ${this.getAccountName}`,
            dac_id: this.$configFile.get("dacscope")
          }
        }
      ];

      let result = await this.$store.dispatch("user/transact", {
        actions: actions
      });
      if (result) {
        await this.$store.dispatch("dac/fetchCustodianContractState");
      }
    }
  },
  async mounted() {
    if (this.getCustodianState.lastperiodtime == null) {
      await this.$store.dispatch("dac/fetchCustodianContractState");
    }
    this.startTimer(2000);
    if (this.$router.currentRoute.path == "/constitution") {
      this.showHere = false;
    } else {
      this.showHere = true;
    }
  },

  watch: {
    $route: function() {
      if (this.$router.currentRoute.path == "/constitution") {
        this.showHere = false;
      } else {
        this.showHere = true;
      }
    },
    getAccountName: function(v) {
      this.stopTimer();
      if (this.getAccountName) {
        this.startTimer(2000);
      }
    }
  }
};
</script>

<style lang="stylus">
@import '~variables'

.trigger_new_period_msg{
  border-top: 4px solid var(--q-color-info);
  // border-left: 4px solid var(--q-color-info);
  // border-right: 4px solid var(--q-color-info);
  z-index:2;
  width:100%;
  right:0;
  bottom:0;
}

.drawer-margin{
  padding-left:320px !important;
}
</style>
