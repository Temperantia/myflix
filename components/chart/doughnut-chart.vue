<script lang='ts'>
import { Doughnut } from 'vue-chartjs';

import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  extends: Doughnut,
})
export default class ProgressBar extends Vue {
  @Prop({ type: Object }) readonly chartdata!: ChartData;
  @Prop({ type: Object })
  readonly options!: ChartOptions | undefined;
  public renderChart!: (
    chartData: ChartData,
    options: ChartOptions | undefined
  ) => void;

  mounted() {
    this.renderChart(this.chartdata, this.options);
  }
}
</script>
