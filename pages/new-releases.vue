<template lang="pug">
div
  trending-week.title-border.pa-0(isNewReleases)
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
          :items='[ "All",...Object.entries(ratings).map(([score, rating]) => `${score} - ${rating}`).reverse(), ]',
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
          label='Bingeworthiness',
          v-model='bingeworthiness',
          dense,
          outlined,
          hide-details
        )
      v-col(cols='12', lg='2')
        v-switch.my-0(
          label='Netflix Original',
          v-model='original',
          dense,
          outlined,
          hide-details
        )
    title-list(:source='newReleases', :page='page')
</template>
<script lang='ts'>
import { Vue, Component, namespace } from 'nuxt-property-decorator';
import genres from '~/netflix/data/categories.json';

const browseModule = namespace('browse');
const titleModule = namespace('title');

@Component
export default class NewReleases extends Vue {
  score: string = 'All';
  category: string = 'All';
  genre: string = 'All';
  bingeworthiness: boolean = false;
  original: boolean = false;
  newReleases: any[] = [];
  genres = genres;
  page = 1;

  @titleModule.State('ratings') ratings!: any;

  getWeek() {
    const week =
      this.$moment().subtract(7, 'days').startOf('isoWeek').format('MMM D') +
      ' - ' +
      this.$moment().endOf('isoWeek').format('MMM D');
    return week;
  }

  async fetch() {
    this.newReleases = await (
      await this.$titles.search(null, { limit: 1000000 })
    ).hits.filter((title: any) => {
      if (!title.n) {
        return false;
      }
      return (
        (this.category === 'All' ||
          (this.category === 'TV Shows' && title.u) ||
          (this.category === 'Films' && !title.u)) &&
        (this.score === 'All' ||
          Number(this.score.match(/(([^()]+))/)?.[1]) === parseInt(title.z)) &&
        (this.genre === 'All' || title.c.includes(this.genre)) &&
        (!this.original || title.o) &&
        (!this.bingeworthiness || title.h > 0.5)
      );
    });
  }
}
</script>
