<template lang="pug">
div
  v-row
    v-col
      trending-week(:trendingWeek='trendingWeek')
  v-row
    v-col
      premieres(:premieres='premieres')
</template>

<script>
export default {
  async asyncData({ store, $getPremieres, $getTrendingWeek }) {
    const premieres = await $getPremieres();
    const trendingWeek = (await $getTrendingWeek());
    return {
      premieres,
      trendingWeek,
    };
  },
};
</script>
