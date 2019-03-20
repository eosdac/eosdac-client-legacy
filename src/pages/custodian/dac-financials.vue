<template>
  <q-page class="q-pa-md">


<div class="row gutter-sm">


    <div class="col-xs-12 col-lg-6">
      <div class="bg-bg1 q-pa-md round-borders shadow-5" >
        <div class="q-title">Block Production Account</div>
        <balance-timeline :account="this.$configFile.get('bpaccount')"  :contract="this.$configFile.get('systemtokencontract')" :symbol="this.$configFile.get('systemtokensymbol')" :start_block="19013068-1814400" />
      </div>
    </div>

    <div class="col-xs-12 col-lg-6">
      <div class="bg-bg1 q-pa-md round-borders shadow-5" >
        <balance-timeline account="evilmikehere"  :contract="this.$configFile.get('systemtokencontract')" :symbol="this.$configFile.get('systemtokensymbol')"  />
      </div>
    </div>

</div>

    
  </q-page>
</template>

<script>

import {mapGetters} from 'vuex';
import balanceTimeline from 'components/ui/balance-timeline';

export default {
  name: 'dacFinancials',
  components:{
    balanceTimeline,

  },
  data () {
    return {

 
    }
  },
  computed:{
    ...mapGetters({
      // getEosApi: 'global/getEosApi'
    })

  },

}
</script>

<style>
</style>
