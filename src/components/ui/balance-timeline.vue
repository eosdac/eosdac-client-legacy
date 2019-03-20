<template>
  <div><line-chart ref="linechart" :chartData="chartData" :options="chartOptions"/></div>
</template>

<script>
import { colors } from 'quasar';
import {mapGetters} from 'vuex';
import lineChart from 'components/ui/line-chart';

export default {
  name: 'balanceTimeline',
  components:{
    lineChart
  },
  props:{
    account: {
      type: String,
      default: ''
    },
    contract: {
      type: String,
      default: ''
    },
    symbol: {
      type: String,
      default: ''
    },
    start_block: {
      type: Number,
      default: 0
    },
    end_block: {
      type: Number,
      default: 0
    }
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
methods:{
    getGradient(){
      let {r, g, b} = colors.hexToRgb(colors.getBrand('primary') );
      // console.log(r,g,b)
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
      if(!res || !res.results) return false;
      this.chartData = {
        labels: res.results.map(p => p.block_num),
        datasets:[
          {
            label: `${query.account} ${query.symbol}`,
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
    //this.$configFile.get('treasuryaccount')
    //this.$configFile.get('bpaccount')
    this.getTokenTimeLine({ account: this.account, contract: this.contract, symbol:this.symbol, start_block: this.start_block, end_block: this.end_block });

    
  }
}
</script>

<style>
</style>
