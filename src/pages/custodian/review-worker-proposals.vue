<template>
  <q-page class="q-pa-md">
    
    <div v-for="(wp, i)  in wps" :key="`wp${i}`">
      <wp-proposal :wp="wp" />
    </div>
    
  </q-page>
</template>

<script>
import wpProposal from 'components/ui/wp-proposal'
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
  methods:{
    async fetchWps(){
      let res = await this.$store.dispatch('dac/fetchWorkerProposals');
      console.log(res)
      this.wps = res.results;

    }
  },
  mounted(){
    this.fetchWps()
  }
}
</script>

<style>
</style>
