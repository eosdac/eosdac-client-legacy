<template>
  <q-page >
<div class="q-pa-md" >

    <div class="row gutter-sm">

      <div class="col-xs-12 col-md-6">
        <div class="bg-bg1 round-borders shadow-5 q-pa-md">
          <div class="q-title q-mb-md">Profile Cache</div>
          <div class="row">
            <q-btn class="q-ma-xs" label="log cache" color="primary" @click="logProfileCache" />
            <q-btn class="q-ma-xs" label="empty cache" color="primary" @click="emptyProfileCache" />
          </div>
        </div>
      </div>

      <div class="col-xs-12 col-md-6">
        <div class="bg-bg1 round-borders shadow-5 q-pa-md">
          <div class="q-title q-mb-md">Config File</div>
          <div class="row">
            <q-btn class="q-ma-xs" label="log config" color="primary" @click="logConfigFile" />
          </div>
        </div>
      </div>
  
      <div class="col-xs-12 col-md-6">
        <div class="bg-bg1 round-borders shadow-5 q-pa-md">
          <div class="row justify-between q-mb-md"><span class="q-title">Color Scheme</span><nightModeSwitch /></div>
          <color-picker />
          <div class="q-mt-md"><q-btn label="log scheme" color="primary" @click="getColorScheme" /></div>
        </div>
      </div>

      <div class="col-xs-12 col-md-6">
        <div class="bg-bg1 round-borders shadow-5 q-pa-md">
          <div class="q-title q-mb-md">Network</div>
          <div class="q-mt-md row">
            <network-switcher class="q-ma-xs" />
            <firehose class="q-ma-xs" />
          </div>
        </div>
      </div>

    </div>



    
      

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

import ecc from 'eosjs-ecc';
import {mapGetters} from 'vuex';
import { colors } from 'quasar';
import colorPicker from 'components/controls/color-picker';

import nightModeSwitch from 'components/controls/nightmode-switch';

import networkSwitcher from 'components/controls/network-switcher';

import firehose from 'components/controls/firehose';

import debugData from 'components/ui/debug-data';

export default {
  name: 'test',
  components: {
      nightModeSwitch,
      colorPicker,
      networkSwitcher,

      firehose,

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
      getIsCustodian: 'user/getIsCustodian',
      getThemes: 'ui/getThemes'
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
    emptyProfileCache(){
      this.$profiles.delete();
    },
    switchNode(){

      this.$store.commit('global/setNode', 'http://testerino.com');
    },

    getColorScheme(){
      let new_colors = {};
      Object.keys(this.getThemes[0].colors).forEach(c => {
        new_colors[c] = colors.getBrand(c);
      });
      let response = {
          "name": "",
          "isdark": this.getIsDark,
          "colors": new_colors
      }
      console.log(JSON.stringify(response) )
    }

  },
  mounted(){
    // Object.keys(this.$store.state).forEach(e => {
    //   console.log(`key=${e}`)
    //   console.log(this.$store.state[e])
    // });
    this.$helper.fullHostToJson(this.$configFile.get('defaultnode') )

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
