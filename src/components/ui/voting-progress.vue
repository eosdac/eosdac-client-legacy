<template>
<span>
  <div v-if="!met_initial_votes_threshold" class="full-width">
    <span class="uppercase">
      {{ $t("vote_custodians.voting_progress") }} 
      <span class="text-dimwhite on-right on-left"> {{ voting_progress.toFixed(2) }}%</span>
    </span>
    <span class="q-body-1 text-dimwhite text-italic">({{$t('votingprogress.activated_at')}})</span>
    <q-progress animate stripe class="round-borders votingprogress_bar q-my-xs" :style="{height: height}" color="positive" :percentage="voting_progress" />
    <span v-if="!loading" class="q-caption float-right">
      {{$t("votingprogress.update_in") }} {{update_in_seconds}} {{$t("votingprogress.seconds") }} 
      <q-icon class="cursor-pointer" :title="$t('votingprogress.refresh')" name="refresh" @click.native="initProgressbar()"/>
    </span>
    <span v-else class="q-caption float-right">{{$t('votingprogress.loading')}}</span>
  </div>

  <div v-if="met_initial_votes_threshold && !loading">{{$t('votingprogress.threshold_met')}}
    <!-- <custodiansDisplay /> -->
  </div>

</span>

</template>

<script>

export default {
 name: 'VotingProgress',
  components: {
 
  },
 

  props: {
    height: String
  },

  data () {
    return {
      voting_progress : 0,
      update_in_seconds:0,
      loading : false,
      timer : false,
      met_initial_votes_threshold: false
    }
  },

  methods:{
    async initProgressbar(){
      await this.getContractState();
      this.intervaller(60);
    },

    //get voting progress from chain
    async getContractState() {
      this.resetTimer();
      this.loading = true;
      let totalsupply = this.$configFile.network.tokenContract.totalSupply*10000;
      let state = await this.$store.dispatch('api/getContractState', {contract: this.$configFile.network.custodianContract.name});
      // console.log(state)
      if(state){
        this.voting_progress = state.total_weight_of_votes/totalsupply*100;
        this.met_initial_votes_threshold = state.met_initial_votes_threshold;
      }
      this.loading = false;
    },

    intervaller (i){
      if(this.met_initial_votes_threshold || !this.$configFile.network.custodianContract.enable_voting){
        return false;
      }

      let oldi = i;
      this.timer = setInterval(() => {
        this.update_in_seconds = i;
        i--;
        if(i == -1){
          this.getContractState();
          this.intervaller(oldi);
        }
      }, 1000);
    },

    resetTimer(){
      clearInterval(this.timer);
      this.timer = false;
    }
  },

  mounted(){
    this.initProgressbar();
  },

  beforeDestroy() {
    this.resetTimer();
  }


}
</script>

<style>
.votingprogress_bar .q-progress-track{
  background:white;
}
</style>
