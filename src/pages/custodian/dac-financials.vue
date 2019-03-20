<template>
  <q-page class="q-pa-md">

    <div class="bg-bg1 q-pa-md round-borders shadow-5">
      <line-chart ref="linechart" :chartData="chartData" :options="chartOptions"/>
    </div>
    
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
      chartOptions: {
        responsive: true, 
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }
            }],
            yAxes: [{
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }   
            }]
        }
      },
 
    }
  },
  computed:{
    ...mapGetters({
      // getEosApi: 'global/getEosApi'
    })

  },
  methods:{
    getGradient(){
      let gradient = this.$refs.linechart.$refs.canvas
      .getContext('2d')
      .createLinearGradient(0, 0, 0, 450)
      gradient.addColorStop(0, 'rgba(74, 18, 137, 0.5)');
      gradient.addColorStop(0.5, 'rgba(74, 18, 137, 0.25)');
      gradient.addColorStop(1, 'rgba(74, 18, 137, 0)');
      return gradient;
    },
    async getTokenTimeLine(){
      let query = {account: 'evilmikehere', contract:'eosio.token', symbol:'EOS', start_block:0, end_block:17000000000};
      let res = await this.$store.dispatch('dac/fetchTokenTimeLine', query)
      this.chartData ={
        labels: res.map(p => p.block_num),
        datasets:[
          {
            label: 'evilmikehere',
            data: res.map(p => p.balance.split(' ')[0]),

            backgroundColor: this.getGradient(),
            borderColor: 'purple', 
            pointBackgroundColor: 'none', 
            borderWidth: 1, 
            pointBorderColor: 'none',
            pointRadius: 0,
          }
        ]
      }
    }
  },
  mounted(){
    this.getTokenTimeLine();

    
  }
}
</script>

<style>
</style>
