<template>
  <div>
    <div v-show="show_balance" class="capitalize q-title">
      {{ account }} <span class="text-text2">({{ balance }})</span>
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
import { mapGetters } from "vuex";

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
    legend: {
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
      balance: null,
      chartOptions: {
        responsive: this.responsive,
        maintainAspectRatio: false,
        legend: {
          display: this.legend
        },
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
              },
              ticks: {
                fontColor: colors.getBrand("text2")
                // beginAtZero: false,
                // stepSize: 15
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
                zeroLineColor: "#3E3E3E"
              },
              ticks: {
                display: true,
                beginAtZero: true,
                fontColor: colors.getBrand("text2")
              }
            }
          ]
        },
        hover: {
          mode: "index",
          intersect: false
        },
        tooltips: {
          mode: "index",
          intersect: false,
          position: "average",
          caretPadding: 10,
          callbacks: {
            title: function(tooltipItem, data) {
              let pd = date.formatDate(
                data["labels"][tooltipItem[0]["index"]],
                "YYYY-MM-DD"
              );
              return `${pd}`;
            },
            label: function(tooltipItem, data) {
              return `${data["datasets"][0]["data"][tooltipItem["index"]]}`;
            }
          },
          backgroundColor: colors.getBrand("dark"),
          titleFontSize: 12,
          titleFontColor: colors.getBrand("text1"),
          bodyFontColor: colors.getBrand("text2"),
          bodyFontSize: 12,
          displayColors: false
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      getNodeInfo: "global/getNodeInfo"
    })
  },
  methods: {
    async init() {
      let { head_block_num, head_block_time } =
        this.getNodeInfo || (await this.$store.dispatch("global/testEndpoint"));
      this.refblock = head_block_num;
      this.refdate = new Date(head_block_time);
      if (this.account && this.contract && this.symbol) {
        this.getTokenTimeLine({
          account: this.account,
          contract: this.contract,
          symbol: this.symbol,
          start_block: 0,
          end_block: this.end_block
        });
      }
    },
    getGradient() {
      if (!this.$refs.linechart || !this.$refs.linechart.$refs) {
        return;
      }
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
      let vals = this.chartData.datasets[0].data;
      let balance = `${vals[vals.length - 1]} ${this.symbol}`;
      this.balance = balance;
      this.$emit("onbalance", balance);
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
  },
  watch: {
    account: function() {
      this.init();
    },
    symbol: function() {
      this.init();
    }
  }
  //
};
</script>
