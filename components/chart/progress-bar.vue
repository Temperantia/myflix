<template lang="pug">
bar-chart(
  v-if='width',
  :chartdata='tvShowsChartDataLatest(status, episodes, episodeCount)',
  :options='optionsBar',
  :width='width',
  :height='15'
)
bar-chart(
  v-else,
  :chartdata='tvShowsChartDataLatest(status, episodes, episodeCount)',
  :options='optionsBar',
  :height='15'
)
</template>
<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class ProgressBar extends Vue {
  @Prop({ type: String }) status!: string;
  @Prop({ type: Number }) episodes!: number;
  @Prop({ type: Number }) episodeCount!: number;
  @Prop({ type: Number }) width!: number;
  optionsBar: any = {
    layout: {
      padding: {
        left: -20,
        top: -20,
      },
    },
    scales: {
      xAxes: [
        {
          offset: false,
          gridLines: {
            offsetGridLines: false,
          },
          ticks: {
            display: false,
          },
          scaleLabel: {
            display: false,
          },
          stacked: true,
        },
      ],
      yAxes: [
        {
          offset: false,
          gridLines: {
            offsetGridLines: false,
          },
          ticks: {
            display: false,
          },
          scaleLabel: {
            display: false,
          },
          stacked: true,
        },
      ],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
    maintainAspectRatio: false,
  };

  created() {
    this.optionsBar.responsive = !this.width;
  }

  tvShowsChartDataLatest(status: string, episodes: number, total: number) {
    let color = '';
    if (status === 'Watching') {
      color = '#6dee76';
    } else if (status === 'Completed') {
      color = '#576bec';
    } else if (status === 'On-Hold') {
      color = '#f2921c';
    } else if (status === 'Dropped') {
      color = '#f51c1f';
    } else if (status === 'Save for Later') {
      color = '#888888';
    }
    return {
      datasets: [
        {
          backgroundColor: color,
          barThickness: 5,
          data: [(episodes * 100) / total],
        },
        {
          backgroundColor: '#888888',
          barThickness: 5,
          data: [100 - (episodes * 100) / total],
        },
      ],
    };
  }
}
</script>
<style lang="scss" scoped>
.bar {
  width: 200px;
  height: 5px;
}
</style>
