<template>
  <q-page class="q-pa-md">

    <div class="bg-bg1 q-pa-md round-borders shadow-5">
      <line-chart ref="linechart" :chartData="chartData" :options="chartOptions"/>
    </div>
    
  </q-page>
</template>

<script>
import { colors } from 'quasar';
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
      let {r, g, b} = colors.hexToRgb(colors.getBrand('primary') );
      console.log(r,g,b)
      let gradient = this.$refs.linechart.$refs.canvas
      .getContext('2d')
      .createLinearGradient(0, 0, 0, 450)
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.5)`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.25)`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      return gradient;
    },
    async getTokenTimeLine(query){

      let res = await this.$store.dispatch('dac/fetchTokenTimeLine', query);
      console.log(res)
      this.chartData = {
        labels: res.results.map(p => p.block_num),
        datasets:[
          {
            label: query.account,
            data: res.results.map(p => p.balance.split(' ')[0]),

            backgroundColor: this.getGradient(),
            borderColor: colors.getBrand('primary'), 
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
    this.getTokenTimeLine({account: this.$configFile.get('bpaccount'), contract:'eosio.token', symbol:'EOS', start_block:0, end_block:17000000000});

    
  }
}
</script>

<style>
</style>
