<template>
  <q-page class="q-pa-md">


    <line-chart :chartData="chartData" :options="chartOptions"/>
  </q-page>
</template>

<script>
import {mapGetters} from 'vuex';
import lineChart from 'components/ui/line-chart';

export default {
  name: 'dacFinancials',
  components:{
    lineChart
  },
  data () {
    return {
      chartData:null,
      chartOptions: {responsive: false}
    }
  },
  computed:{
    ...mapGetters({
      // getEosApi: 'global/getEosApi'
    })

  },
  methods:{
    async getTokenTimeLine(){
      let query = {account: 'piecesnbitss', contract:'kasdactokens', symbol:'KASDAC', start_block:10000000, end_block:17000000};
      let res = await this.$store.dispatch('dac/fetchTokenTimeLine', query)
    }
  },
  mounted(){
    // this.getTokenTimeLine();
    this.chartData={
        labels: ['January', 'February'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: 'blue',
            data: [1, 2]
          }
        ]
      }
    
  }
}
</script>

<style>
</style>
