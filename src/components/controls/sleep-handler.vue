<template>
  
</template>

<script>
var SCHEDULE_AUTO_LOGOUT_TIMER = null;
var DO_AUTO_LOGOUT_TIMER = null;

import { Notify } from 'quasar';
import {mapGetters} from 'vuex';

export default {
  name: 'sleepHandler',

  onIdle() {
    console.log('sleeping')
    if(SCHEDULE_AUTO_LOGOUT_TIMER === null && this.getAccountName){
      this.sheduleAutoLogout();
    }
  },

  onActive() {
    console.log('wake up')
    this.keepMeLoggedIn();
  },

  data () {
    return {
      logoutNotification: null
    }
  },

  computed:{
    ...mapGetters({
      getSettingByName: 'user/getSettingByName',
      getAccountName: 'user/getAccountName'
    })
  },

  methods:{
    sheduleAutoLogout(){
      let time = 10000;
      SCHEDULE_AUTO_LOGOUT_TIMER = setTimeout(()=>{
        this.doAutoLogout();
      }, time)

    },

    doAutoLogout(){
      let time_seconds = 10;
      DO_AUTO_LOGOUT_TIMER = setTimeout(()=>{
        if(this.getAccountName){
          this.$store.dispatch('global/logout');
        }
      }, time_seconds*1000 );

      if(this.getSettingByName('notify_info_msg').value){
        this.logoutNotification = Notify.create({
            message: `You've been sleeping for a while now.`,
            timeout: 5000,
            type: 'info',
            detail: `auto logout in ${time_seconds} seconds`,
            position: 'bottom-right', // 'top', 'left', 'bottom-left' etc.
        });
      }
    },

    keepMeLoggedIn(){
      if(this.logoutNotification){
        this.logoutNotification(); //dismiss notification;
      }
      clearTimeout(SCHEDULE_AUTO_LOGOUT_TIMER);
      clearTimeout(DO_AUTO_LOGOUT_TIMER);
      DO_AUTO_LOGOUT_TIMER = null;
      SCHEDULE_AUTO_LOGOUT_TIMER = null;
    }
  }
}
</script>

<style>
</style>
