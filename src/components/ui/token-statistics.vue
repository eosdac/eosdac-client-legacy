<template>
  <div>
    <!-- <member-select
      itsme="UNDELEGATE"
      @change="handleCatDelegation(cat.value, $event)"
      v-model="selected"
      :accountnames="getCustNames"
      placeholder="Select to Delegate"
    /> -->
    <pre>{{ $configFile.configFile.contracts.token }}</pre>
    <pre>{{ membercounts }}</pre>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import memberSelect from "components/controls/member-select";
export default {
  // name: 'ComponentName',
  components: {
    // memberSelect
  },
  data() {
    return {
      membercounts: ""
    };
  },
  computed: {
    ...mapGetters({
      getCustodians: "dac/getCustodians",
      getAccountName: "user/getAccountName",
      getIsDark: "ui/getIsDark"
    }),
    getCustNames() {
      if (this.getCustodians) {
        return this.getCustodians.map(c => {
          return c.cust_name;
        });
      } else {
        return [];
      }
    }
  },
  async mounted() {
    this.membercounts = await this.$store.dispatch("dac/fetchMemberCounts");
  }
};
</script>

<style></style>
