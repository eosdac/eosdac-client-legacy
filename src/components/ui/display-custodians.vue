<template>
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
      <q-tooltip v-model="custodian.tooltip" class="bg-bg2">
        <div>Votes: {{ custodian.total_votes / 10000 }}</div>
        <div>Pay: {{ custodian.requestedpay }}</div>
      </q-tooltip>
    </div>
  </div>
</template>

<script>
import profilePic from "./profile-pic";
import { mapGetters } from "vuex";

export default {
  name: "displayCustodians",
  components: {
    profilePic
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
      getCustodians: "dac/getCustodians"
    })
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

  mounted: function() {
    if (this.getCustodians) {
      this.setCustodians();
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
