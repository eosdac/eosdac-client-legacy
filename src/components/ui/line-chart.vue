<script>
import { Line, mixins } from "vue-chartjs";

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: {
    chartData: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  methods: {
    render() {
      this.renderChart(this.chartData, this.options);
    }
  },
  mounted() {
    this.render();
  }
};
</script>

<style></style>
