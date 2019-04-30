<template>
  <div>
    <div v-if="loaded">
      <div class="row justify-center q-mb-xs">Next Period In</div>
      <flip-clock
        :deadline="periodEnds"
        :labels="{
          days: 'Days',
          hours: 'Hours',
          minutes: 'Minutes',
          seconds: 'Seconds'
        }"
      />
    </div>
    <div v-else>
      <q-spinner color="primary-light" />
    </div>
  </div>
</template>

<script>
import flipClock from "components/ui/flip-clock";

import { mapGetters } from "vuex";

import { date } from "quasar";
const { addToDate } = date;

export default {
  name: "periodTimer",
  components: {
    flipClock
  },
  data() {
    return {
      loaded: false
    };
  },
  computed: {
    ...mapGetters({
      getCustodianState: "dac/getCustodianState",
      getCustodianConfig: "dac/getCustodianConfig"
    }),
    periodEnds() {
      if (
        this.getCustodianConfig.periodlength &&
        this.getCustodianState.lastperiodtime
      ) {
        let end = addToDate(
          new Date(this.getCustodianState.lastperiodtime * 1000),
          { seconds: this.getCustodianConfig.periodlength }
        );
        return date.formatDate(end, "YYYY-MM-DD HH:mm:ss");
      }
    }
  },
  methods: {
    async getCustodianContractstate() {
      this.loaded = false;
      if (this.getCustodianState.lastperiodtime == null) {
        await this.$store.dispatch("dac/fetchCustodianContractState");
        this.loaded = true;
      } else {
        this.loaded = true;
      }
    }
  },
  mounted() {
    this.getCustodianContractstate();
  }
};
</script>

<style></style>
