<template>
  <div>
    <div v-show="show_balance" class="capitalize q-title">
      {{ account }} <span class="text-text2">({{ getLatestBalance }})</span>
    </div>
    <div v-if="description != ''" class="text-text2 q-my-md">
      {{ description }}
    </div>
    <line-chart
      ref="linechart"
      :chartData="chartData"
      :options="chartOptions"
      :width="width"
      :height="height"
    />
  </div>
</template>

<script>
import { colors, date } from "quasar";
import lineChart from "components/ui/line-chart";

export default {
  name: "balanceTimeline",
  components: {
    lineChart
  },
  props: {
    account: {
      type: String,
      default: ""
    },
    contract: {
      type: String,
      default: ""
    },
    symbol: {
      type: String,
      default: ""
    },
    start_block: {
      type: Number,
      default: 0
    },
    end_block: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      default: ""
    },
    show_balance: {
      type: Boolean,
      default: true
    },
    responsive: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      refblock: null,
      refdate: null,
      chartData: null,
      chartOptions: {
        responsive: this.responsive,
        maintainAspectRatio: false,

        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "month",
                unitStepSize: 3,
                displayFormats: {
                  month: "MMM"
                }
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)"
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
                zeroLineColor: "#3E3E3E"
              }
            }
          ]
        }
      }
    };
  },
  computed: {
    getLatestBalance() {
      if (this.chartData) {
        let vals = this.chartData.datasets[0].data;
        let balance = `${vals[vals.length - 1]} ${this.symbol}`;
        this.$emit("onbalance", balance);
        return balance;
      }
    }
  },
  methods: {
    async init() {
      let { head_block_num, head_block_time } = await this.$store.dispatch(
        "global/testEndpoint"
      );
      this.refblock = head_block_num;
      this.refdate = new Date(head_block_time);
      this.getTokenTimeLine({
        account: this.account,
        contract: this.contract,
        symbol: this.symbol,
        start_block: 0,
        end_block: this.end_block
      });
    },
    getGradient() {
      let { r, g, b } = colors.hexToRgb(colors.getBrand("primary"));
      // console.log(r,g,b)
      let gradient = this.$refs.linechart.$refs.canvas
        .getContext("2d")
        .createLinearGradient(0, 0, 0, 450);
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.5)`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.25)`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      return gradient;
    },
    async getTokenTimeLine(query) {
      let res = await this.$store.dispatch("dac/fetchTokenTimeLine", query);
      if (!res || !res.results) return false;
      this.chartData = {
        labels: res.results.map(p => this.numToTime(p.block_num)),
        datasets: [
          {
            label: `${query.account} ${query.symbol}`,
            data: res.results.map(p => p.balance.split(" ")[0]),
            lineTension: 0,
            backgroundColor: this.getGradient(),
            borderColor: colors.getBrand("primary"),
            pointBackgroundColor: "none",
            borderWidth: 1,
            pointBorderColor: "none",
            pointRadius: 0
          }
        ]
      };
    },
    numToTime(blocknum) {
      let diff = (this.refblock - blocknum) * 2; //seconds
      let r = date.subtractFromDate(this.refdate, { seconds: diff });
      return r;
      // return date.formatDate(r, 'MMM DD');
    }
  },
  async mounted() {
    this.init();
    // let { head_block_num, head_block_time } = await this.$store.dispatch(
    //   "global/testEndpoint"
    // );
    // this.refblock = head_block_num;
    // this.refdate = new Date(head_block_time);
    // this.getTokenTimeLine({
    //   account: this.account,
    //   contract: this.contract,
    //   symbol: this.symbol,
    //   start_block: 0,
    //   end_block: this.end_block
    // });
  },
  watch: {
    account: function() {
      this.init();
    }
  }
  //
};
</script>

<style></style>
