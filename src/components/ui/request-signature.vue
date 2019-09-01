<template>
  <transition
    appear
    enter-active-class="animated fadeInDown"
    leave-active-class="animated fadeOutUp"
  >
    <div
      v-if="getAccountName && needSignature && time_flag && showHere"
      v-bind:class="{ 'drawer-margin': getDrawerIsOpen }"
      class=" request_signature_msg bg-bg2 q-pa-md bg-logo fixed"
    >
      <div class="row justify-between items-center q-mb-md ">
        <div class="q-title">{{ $t("default.sign_the_constitution") }}</div>
        <q-btn class="no-shadow" icon="close" @click="close" />
      </div>

      <div class="q-mb-md full-width">
        <span v-if="!getAgreedTermsVersion" class="on-left">{{
          $t("default.you_have_not_yet_registered")
        }}</span>
        <span v-else class="on-left">{{
          $t("default.constitution_has_been_updated")
        }}</span>
        <!-- <span class="on-left">{{ $t('default.you_have_not_yet_registered') }}</span>
          <span class="on-left">{{ $t('default.constitution_has_been_updated') }}</span> -->
      </div>

      <div class="row justify-end">
        <q-btn
          color="primary-light"
          to="/constitution"
          icon="receipt"
          :label="$t('default.sign_the_constitution')"
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
      getMemberTerms: "dac/getMemberTerms",
      getLatestMemberTerm: "dac/getLatestMemberTerm",
      getAccountName: "user/getAccountName",
      getAgreedTermsVersion: "user/getAgreedTermsVersion",
      getDrawerIsOpen: "ui/getDrawerIsOpen"
    }),

    needSignature() {
      if (
        this.getLatestMemberTerm &&
        this.getAgreedTermsVersion &&
        this.getLatestMemberTerm.version === this.getAgreedTermsVersion
      ) {
        return false;
      } else {
        return true;
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
    }
  },
  mounted() {
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

.request_signature_msg{
  border-bottom: 4px solid var(--q-color-info);
  // border-left: 4px solid var(--q-color-info);
  // border-right: 4px solid var(--q-color-info);
  z-index:2;
  width:100%;

  right:0;
}

.drawer-margin{
  padding-left:320px !important;
}
</style>
