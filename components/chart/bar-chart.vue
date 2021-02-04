<script lang='ts'>
import { ChartData, ChartOptions } from 'chart.js';
import { HorizontalBar } from 'vue-chartjs';
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component({
  extends: HorizontalBar,
})
export default class BarChart extends Vue {
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
