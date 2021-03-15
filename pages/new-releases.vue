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
    title-list(
      :titles='titles',
      :page='page',
      :pages='$globals.newReleaseCount',
      @update='(p) => (page = p)'
    )
</template>
<script lang='ts'>
import { Vue, Component, namespace } from 'nuxt-property-decorator';
import genres from '~/data/categories.json';
import AsyncComputed from 'vue-async-computed-decorator/dist';

const titleModule = namespace('title');

@Component
export default class NewReleases extends Vue {
  score: string = 'All';
  category: string = 'All';
  genre: string = 'All';
  bingeworthiness: boolean = false;
  original: boolean = false;
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

  @AsyncComputed()
  async titles() {
    let search = '';
    if (this.genre !== 'All') {
      search += ' ' + this.genre;
    }

    let filters = ['newReleasesRank>0'];
    if (this.category === 'TV Shows') {
      filters.push('u=1');
    } else if (this.category === 'Films') {
      filters.push('u=0');
    }

    if (this.original) {
      filters.push('o=1');
    }
    if (this.bingeworthiness) {
      filters.push('h>0.5');
    }
    if (this.score != 'All') {
      const score = this.score.match(/(([^-]+))/)?.[1];
      filters.push('z=' + score);
    }

    return (
      await this.$titles.search(search, {
        offset: 24 * (this.page - 1),
        limit: 24,
        filters: filters.join(' AND '),
      })
    ).hits;
  }
}
</script>
