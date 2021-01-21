<template lang="pug">
bar-chart(
  :chartdata='tvShowsChartDataLatest(status, episodes, episodeCount)',
  :options='optionsBar',
  :width='width ? width : "auto"',
  :height='15'
)
</template>
<script>
export default {
  props: ['status', 'episodes', 'episodeCount', 'width'],
  data: () => ({
    optionsBar: {
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
    },
  }),
  created() {
    this.optionsBar.responsive = !this.width;
  },
  methods: {
    tvShowsChartDataLatest(status, episodes, total) {
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
    },
  },
};
</script>
<style lang="scss" scoped>
.bar {
  width: 200px;
  height: 5px;
}
</style>
