<template>
  <div>
    <div v-if="loaded">
      <div class="row justify-center q-mb-xs">Next Period</div>
      <flip-countdown :deadline="periodEnds" :labels=" {days: 'Days',hours: 'Hours',minutes: 'Minutes',seconds: 'Seconds'}"></flip-countdown>
    </div>
    <div v-else>
      <q-spinner color="primary-light" />
    </div>
  </div>
</template>

<script>

import FlipCountdown from 'vue2-flip-countdown';
import {mapGetters} from 'vuex';

import { date } from 'quasar';
const today = new Date();
const { addToDate, subtractFromDate } = date;


export default {
  name: 'periodTimer',
  components:{
    FlipCountdown
  },
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
        return date.formatDate(end, 'YYYY-MM-DD HH:mm:ss');
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

<style lang ="stylus">
@import '~variables'

.flip-card__top,
.flip-card__bottom,
.flip-card__back-bottom,
.flip-card__back::before,
.flip-card__back::after {
  color: var(--q-color-primary) !important;
  background: #222;

}
.flip-card__bottom,
.flip-card__back-bottom {
  color: var(--q-color-primary-light) !important;
  border-top: solid 1px #000;
  background: #393939;

}

.flip-clock {
  
  text-align: center;
  margin: 0 !important;

}



</style>
