<template>
  <q-page class="q-pa-md">
    
    <div  class="row gutter-sm">
      <div class="col-xs-12 col-xl-6" v-for="(wp, i)  in wps" :key="`wp${i}`">
        <wp-proposal :wp="wp"  />
      </div>
    </div>
    
  </q-page>
</template>

<script>
import wpProposal from 'components/ui/wp-proposal';
import {mapGetters} from 'vuex';
export default {
  name: 'ReviewWP',
  components:{
    wpProposal
  },
  data () {
    return {
      wps: []
    }
  },
  computed:{
    ...mapGetters({
      getWpConfig: 'dac/getWpConfig',
      getIsCustodian: 'user/getIsCustodian'
    }),
  },
  methods:{
    async fetchWps(){
      let res = await this.$store.dispatch('dac/fetchWorkerProposals');
      console.log(res)
      this.wps = res.results;

    }
  },
  mounted(){
    this.fetchWps()
  },
  created() {
    if(this.getWpConfig.service_account===null){
      this.$store.dispatch('dac/fetchWpConfig');
    }
  },
}
</script>

<style>
</style>
