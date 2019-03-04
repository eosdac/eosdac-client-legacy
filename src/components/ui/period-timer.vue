<template>
  <div>
    <div v-if="loaded">
      Current period ends: {{periodEnds}}
      <!-- <span>{{new Date(getCustodianState.lastperiodtime*1000).toString() }}</span> -->
    </div>
    <div v-else>
      <q-spinner color="primary-light" />
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

import { date } from 'quasar';
const today = new Date();
const { addToDate, subtractFromDate } = date;


export default {
  name: 'periodTimer',
  data () {
    return {
      loaded: false
    }
  },
  computed:{
    ...mapGetters({
      getCustodianState: 'dac/getCustodianState',
      getCustodianConfig: 'dac/getCustodianConfig'
    }),
    periodEnds(){
      if(this.getCustodianConfig.periodlength && this.getCustodianState.lastperiodtime ){
        let end =  addToDate(new Date(this.getCustodianState.lastperiodtime*1000), { days: this.getCustodianConfig.periodlength/60/60/24 });
        return date.formatDate(end, 'YYYY MMMM dddd HH:mm:ss');
      }



    }
  },
  methods:{
    async getCustodianContractstate(){
      this.loaded = false;
      if(this.getCustodianState.lastperiodtime == null){
        await this.$store.dispatch('dac/fetchCustodianContractState');
        this.loaded = true
      }
      else{
        this.loaded = true;
      }
    }
  },
  mounted(){
    this.getCustodianContractstate();

  }
}
</script>

<style>
</style>
