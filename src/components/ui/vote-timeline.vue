<template>
  <div>
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
import { colors } from "quasar";
import lineChart from "components/ui/line-chart";
//chartjs bug https://github.com/chartjs/Chart.js/pull/5578
import { mapGetters } from "vuex";

export default {
  name: "balanceTimeline",
  components: {
    lineChart
  },
  props: {
    accounts: {
      type: Array,
      default: () => []
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
                unit: "day",
                unitStepSize: 3,
                displayFormats: {
                  month: "DDD"
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
          mode: "nearest",
          intersect: false
        },
        tooltips: {
          mode: "nearest",
          intersect: false,
          position: "average",
          caretPadding: 10,
          callbacks: {
            // title: function(tooltipItem, data) {
            //   let pd = date.formatDate(
            //     data["labels"][tooltipItem[0]["index"]],
            //     "YYYY-MM-DD"
            //   );
            //   return `${pd}`;
            // },
            // label: function(tooltipItem, data) {
            //   console.log(data);
            //   console.log(tooltipItem);
            //   return JSON.stringify(
            //     data["datasets"][tooltipItem["datasetIndex"]]["data"][
            //       tooltipItem["index"]
            //     ]
            //   );
            // }
          },
          backgroundColor: colors.getBrand("dark"),
          titleFontSize: 12,
          titleFontColor: colors.getBrand("text1"),
          bodyFontColor: colors.getBrand("text2"),
          bodyFontSize: 12,
          displayColors: true
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
      if (this.accounts.length) {
        this.setChartData({
          account: this.accounts.join(",")
        });
      }
    },
    getGradient(hexcolor) {
      if (!this.$refs.linechart || !this.$refs.linechart.$refs) {
        return;
      }
      let { r, g, b } = colors.hexToRgb(hexcolor);
      // console.log(r,g,b)
      let gradient = this.$refs.linechart.$refs.canvas
        .getContext("2d")
        .createLinearGradient(0, 0, 0, 450);
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.3)`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.1)`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      return gradient;
    },
    async setChartData(query) {
      let res = await this.$store.dispatch("dac/fetchVotesTimeline", query);
      let c = [
        "#aaec33",
        "#00a5e3",
        "#8dd7bf",
        "#fbd803",
        "#ff96c5",
        "#ff5768",
        "#ffa23a",
        "#ff7400",
        "#8cd8f4",
        "#eff066",
        "#cb91ec",
        "#6dc38e"
      ];
      if (!res || !res.results) return false;
      let chartdata = {
        // labels: res.results[4].votes.map(v => v.block_timestamp),
        datasets: []
      };

      for (let i = 0; i < res.results.length; i++) {
        let dataset = {
          label: `${res.results[i].candidate}`,
          data: res.results[i].votes.map(v => {
            return { x: new Date(v.block_timestamp), y: v.votes / 10000 };
          }),
          lineTension: 0,
          backgroundColor: this.getGradient(c[i]),
          borderColor: c[i],
          pointBackgroundColor: c[i],
          borderWidth: 1,
          pointBorderColor: colors.getBrand("dark"),
          pointRadius: 0
        };
        chartdata.datasets.push(dataset);
      }

      this.chartData = chartdata;

      // this.$emit("onbalance", balance);
    }
  },
  async mounted() {
    this.init();
  },
  watch: {
    account: function() {
      this.init();
    }
  }
  //
};
</script>
