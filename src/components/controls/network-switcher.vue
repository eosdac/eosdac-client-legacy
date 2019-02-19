<template>
  <div >
    <q-btn :disable="disable" v-if="getActiveNetworkName != 'jungle'" label="switch to jungle" @click="switchNetwork('jungle')" color="primary" />
    <q-btn :disable="disable" v-if="getActiveNetworkName != 'mainnet'" label="switch to mainnet" @click="switchNetwork('mainnet')" color="primary" />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  // name: 'ComponentName',
  data () {
    return {
      disable: false
    }
  },
  computed:{
    ...mapGetters({
      getActiveNetwork: 'global/getActiveNetwork',
      getActiveNetworkName: 'global/getActiveNetworkName'
      // getCustodians: 'dac/getCustodians',
    }),
    
  },
  methods:{
    async switchNetwork(networkname){
      //we need to pass in this for resetting the profilecache. profile cache is a plugin that only can be accessed via Vue/this
      this.disable =true;
      await this.$store.dispatch('global/switchNetwork', {networkname: networkname, vm: this});
      this.disable =false;
    }
  }
}
</script>

<style>
</style>
