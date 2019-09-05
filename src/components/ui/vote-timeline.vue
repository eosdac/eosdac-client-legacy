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
import { colors, date } from "quasar";
import lineChart from "components/ui/line-chart";
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
      if (this.accounts.length) {
        this.setChartData({
          account: this.accounts.join(",")
        });
      }
    },
    getGradient(colorstylvar) {
      if (!this.$refs.linechart || !this.$refs.linechart.$refs) {
        return;
      }
      let { r, g, b } = colors.hexToRgb(colors.getBrand(colorstylvar));
      // console.log(r,g,b)
      let gradient = this.$refs.linechart.$refs.canvas
        .getContext("2d")
        .createLinearGradient(0, 0, 0, 450);
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.5)`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.25)`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      return gradient;
    },
    async setChartData(query) {
      let res = await this.$store.dispatch("dac/fetchVotesTimeline", query);
      if (!res || !res.results) return false;
      this.chartData = {
        labels: res.results[0].votes.map(v => v.block_timestamp),
        datasets: [
          {
            label: `${res.results[0].candidate}`,
            data: res.results[0].votes.map(v => v.votes),
            lineTension: 0,
            backgroundColor: this.getGradient("primary"),
            borderColor: colors.getBrand("primary"),
            pointBackgroundColor: "none",
            borderWidth: 1,
            pointBorderColor: "none",
            pointRadius: 0
          }
        ]
      };

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
