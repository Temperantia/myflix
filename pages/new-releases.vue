<template lang="pug">
div
  trending-week.title-border.pa-0
  v-container(fluid)
    v-row
      v-col
        .pb-2.subtitle-border
          h2.font-weight-bold Browse New Releases
          div {{ getWeek() }}
    v-row
      v-col(cols='12', lg='2') Category
        v-select(
          :items='["All", "TV Shows", "Films"]',
          v-model='category',
          hide-details,
          outlined,
          dense
        )
      v-col(cols='12', lg='2') User Score
        v-select(
          :items='[ "All",...Object.entries($ratings).map(([score, rating]) => `${score} - ${rating}`).reverse(), ]',
          v-model='score',
          hide-details,
          outlined,
          dense
        )
      v-col(cols='12', lg='2') Genre
        v-select(
          :items='["All", ...genres]',
          v-model='genre',
          hide-details,
          outlined,
          dense
        )
    v-row
      v-col.py-0(cols='12') More filters
      v-col(cols='12', lg='2')
        v-switch.my-0(
          label='Netflix Original',
          v-model='original',
          dense,
          outlined,
          hide-details
        )
    title-list(:source='newReleases')
</template>
<script>
import genres from '~/netflix/data/categories';
export default {
  data: () => ({
    score: 'All',
    category: 'All',
    genre: 'All',
    original: false,
    genres,
  }),
  methods: {
    getWeek() {
      const week =
        this.$moment().subtract(7, 'days').startOf('isoWeek').format('MMM D') +
        ' - ' +
        this.$moment().endOf('isoWeek').format('MMM D');
      return week;
    },
  },
  computed: {
    newReleases() {
      return this.$search.filter((title) => {
        if (!title.n) {
          return false;
        }
        return (
          (this.category === 'All' ||
            (this.category === 'TV Shows' && title.u) ||
            (this.category === 'Films' && !title.u)) &&
          (this.score === 'All' ||
            Number(this.score.match(/(([^()]+))/)[1]) === parseInt(title.z)) &&
          (this.genre === 'All' || title.c.includes(this.genre)) &&
          (!this.original || title.o)
        );
      });
    },
  },
};
</script>
