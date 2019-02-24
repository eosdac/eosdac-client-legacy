
<template>
  <div id="q-app">
    <router-view />
     <q-ajax-bar position="left" color="primary-light" size="3px" />
  </div>
</template>

<script>
import { Notify } from 'quasar'
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
