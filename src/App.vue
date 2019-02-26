
<template>
  <div id="q-app">
    <router-view />
     <q-ajax-bar position="left" color="primary-light" size="3px" />
  </div>
</template>

<script>
import { Notify } from 'quasar';
import NodeSelector from './modules/nodeselector.js';

export default {
  name: 'App',
  data() {
    return {
      leftDrawerOpen: true,
      loading: true

    }
  },
  methods:{
    checkVersionChange(){
      let stored_version = this.$store.getters['global/getDapp_version'];
      const version = require('../package.json').version;

      if(stored_version === null){
        console.log(`Loaded v${version} for the first time`);
                Notify.create({
                    message: `You're ready. Loaded Memberclient v${version}`,
                    timeout: 2500,
                    type: 'info',
                    position: 'bottom-right'
                });
        this.$store.commit('global/setDapp_version', version );
        return;
      }

      if(stored_version != version){
        console.log(`Update detected. New Version ${version}`);
                Notify.create({
                    message: `Detected new version v${version}`,
                    detail: `The memberclient will auto reload`,
                    timeout: 4000,
                    type: 'info',
                    position: 'bottom-right'
                });
        setTimeout(this.clearLocalStorage, 4000);
      }
    },

    clearLocalStorage(){
        window.localStorage.clear();
        window.location.reload(); 
    }
  },

  async mounted(){
    let test = await this.$store.dispatch('global/testEndpoint', false);

    if(test === false){
      const NS = new NodeSelector(this.$configFile.get('bpnodeapi') );
      let fastest = await NS.get_fastest_node();
      // console.log(fastest)
      this.$store.commit('global/setNode', fastest.node);
    }
    this.loading = true;
    this.$store.dispatch('ui/loadTheme');
    this.$store.dispatch('dac/initRoutine', this);
    
    // this.$root.$emit('helloc');
    await this.$store.dispatch('global/connectScatter');
    this.loading = false;
    this.checkVersionChange();  

  }

}
</script>

<style>
</style>
