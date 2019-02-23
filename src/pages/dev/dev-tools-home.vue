<template>
  <q-page >


<div class="q-pa-md" >
  <pre>{{assettest}}</pre>
  <asset-input  v-model="assettest"  icon="icon-type-2" label="Requested Pay" :max="50" :min="0.0001" />

    <div class="bg-bg1 round-borders shadow-5 row justify-between items-center q-pa-md">
      <div >
        <q-btn label="console.log configfile" color="primary" @click="logConfigFile" />
      </div>
      <div >
        <q-btn label="console profile cache" color="primary" @click="logProfileCache" />
      </div>
      <div >
        <network-switcher />
      </div>
      <div >
        <nightModeSwitch />
      </div>
    </div>

    <q-btn label="switch node" @click="switchNode" />
    
    

    
    <color-picker />
    <!-- <lang-selector /> -->
    <display-custodians />

    <debug-data :data="[{
      'getIsCustodian': getIsCustodian,
      'getActiveNetwork': getActiveNetwork,
      'getMemberStatus': getMemberStatus,
      'getAgreedTermsVersion': getAgreedTermsVersion,
      'getMemberTerms': getMemberTerms
      
    }]" />








</div> <!-- end wrapper -->

    
  </q-page>
  
</template>

<style>
</style>

<script>

import ecc from 'eosjs-ecc'
import {mapGetters} from 'vuex'
import nightModeSwitch from 'components/controls/nightmode-switch'
import colorPicker from 'components/controls/color-picker'
import langSelector from 'components/controls/lang-selector'
import networkSwitcher from 'components/controls/network-switcher'
import displayCustodians from 'components/ui/display-custodians'
import debugData from 'components/ui/debug-data'
import assetInput from 'components/controls/asset-input'
export default {
  name: 'test',
  components: {
      nightModeSwitch,
      colorPicker,
      langSelector,
      displayCustodians,
      networkSwitcher,
      assetInput,
      debugData
  },
  data() {
    return {
      scatter:null,
      assettest:'',
    }
  },
  computed:{
    ...mapGetters({
      getActiveNetwork: 'global/getActiveNetwork',
      getAgreedTermsVersion: 'user/getAgreedTermsVersion',
      getDacBalance: 'user/getDacBalance',
      getMemberStatus: 'user/getMemberStatus',
      getIsDark: 'ui/getIsDark',
      getMemberTerms: 'dac/getMemberTerms',
      getIsCustodian: 'user/getIsCustodian'
      // getCustodians: 'dac/getCustodians',
    }),
    
  },

  methods:{
    logConfigFile(){
      console.log(this.$configFile)
    },
    logProfileCache(){
      console.log(this.$profiles)
    },
    switchNode(){
      let node =  {
        host:'junglepeer.eossweden.se',
        protocol:'https',
        port:443,
      }
      this.$store.dispatch('global/changeNode', node);
    }

  },
  mounted(){
    // Object.keys(this.$store.state).forEach(e => {
    //   console.log(`key=${e}`)
    //   console.log(this.$store.state[e])
    // });

  },
  watch: {
  // '$route': function(){
  //             this.redeemid = this.$route.params.redeemid;
  //             this.redeemtokens = this.$route.params.redeemtokens;
  //             console.log(this.redeemid, this.redeemtokens)
  //           }
  },

}
</script>
