<template> </template>

<script>
var SCHEDULE_AUTO_LOGOUT_TIMER = null;
var DO_AUTO_LOGOUT_TIMER = null;

import { Notify } from "quasar";
import { mapGetters } from "vuex";

export default {
  name: "sleepHandler",

  onIdle() {
    console.log("sleeping");
    if (
      SCHEDULE_AUTO_LOGOUT_TIMER === null &&
      this.getAccountName &&
      this.getSettingByName("auto_logout_delay").value > 0
    ) {
      this.sheduleAutoLogout();
    } else {
      console.log("already logged out or auto logout disabled");
    }
  },

  onActive() {
    console.log("wake up");
    this.keepMeLoggedIn();
  },

  data() {
    return {
      logoutNotification: null
    };
  },

  computed: {
    ...mapGetters({
      getSettingByName: "user/getSettingByName",
      getAccountName: "user/getAccountName",
      getScatter: "global/getScatter"
    })
  },

  methods: {
    sheduleAutoLogout() {
      if (this.getSettingByName("auto_logout_delay").value <= 0) return;
      let time = this.getSettingByName("auto_logout_delay").value * 60 * 1000;
      console.log("shedule logout in", time, "ms");
      SCHEDULE_AUTO_LOGOUT_TIMER = setTimeout(() => {
        this.doAutoLogout();
      }, time);
    },

    doAutoLogout() {
      let time_seconds = 10;
      DO_AUTO_LOGOUT_TIMER = setTimeout(() => {
        if (this.getAccountName) {
          this.$store.dispatch("global/logout");
        }
      }, time_seconds * 1000);

      if (this.getSettingByName("notify_info_msg").value) {
        this.logoutNotification = Notify.create({
          message: `You've been sleeping for a while now.`,
          timeout: 5000,
          type: "info",
          detail: `auto logout in ${time_seconds} seconds`,
          position: "bottom-right" // 'top', 'left', 'bottom-left' etc.
        });
      }
    },

    keepMeLoggedIn() {
      if (this.logoutNotification) {
        this.logoutNotification(); //dismiss notification;
      }
      clearTimeout(SCHEDULE_AUTO_LOGOUT_TIMER);
      clearTimeout(DO_AUTO_LOGOUT_TIMER);
      DO_AUTO_LOGOUT_TIMER = null;
      SCHEDULE_AUTO_LOGOUT_TIMER = null;
    }

    // checkScatterConnection(){
    // console.log('scatterisconnected', this.getScatter.isConnected());
    // if(this.getAccountName && this.getScatter.isConnected() ){

    // }
    // }
  }
};
</script>

<style></style>
