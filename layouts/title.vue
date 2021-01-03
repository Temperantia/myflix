<template lang="pug">
defaultLayout
  v-row
    v-col(cols='12', md='1')
    //- ad
    v-col(cols='12', md='2')
      img(:src='title.tallBoxArt')
      client-only
        .mt-5(v-if='$store.state.localStorage.connected')
          .d-flex.justify-space-between.align-end.title-border
            h3.text-h5 YOUR OVERVIEW
          //-span Add to Favorites
          v-row(align='center')
            v-col(cols='4')
              | Status:
            v-col(cols='8')
              v-select(
                :items='title.summary.type === "show" ? $statusesTvShow : $statusesFilm',
                outlined,
                v-model='status',
                dense,
                :hide-details='true',
                @change='updateStatus'
              )
          v-row(align='center', v-if='title.summary.type === "show"')
            v-col(cols='4')
              | Eps seen:
            v-col(cols='3')
              input(type='number', v-model='episodes', @input='updateEpisodes')
            v-col(cols='3')
              | / {{ title.episodeCount }}
          v-row(align='center')
            v-col(cols='4')
              | Your Score
            v-col(cols='8')
              v-select(
                :items='Object.entries($ratings).map(([score, rating]) => `(${score}) ${rating}`)',
                outlined,
                v-model='score',
                dense,
                :hide-details='true'
              )
          v-row
            v-col(offset='3')
              button.update(@click='update') UPDATE
      .mt-5
        h3.text-h5.title-border INFORMATION
        .my-1(
          v-if='data',
          v-for='(data, name) in title.information',
          :key='name'
        )
          b {{ name }}:
          span.pl-1 {{ data }}
      .mt-5
        h3.title-border STATISTICS
        .my-1(v-for='(data, name) in title.statistics', :key='name')
          b {{ name }}:
          span.pl-1 {{ data }}
    v-col(cols='12', md='8')
      .title-border.pa-2
        nuxt-link(v-for='tab in tabs', :to='tab.route', :key='tab.name')
          h3.d-inline.mr-10(
            :class='{ "red-netflix--text": isCurrentTab(tab.route) }'
          ) {{ tab.name }}
      breadcrumb(:titleName='title.title')
      nuxt
</template>
<script>
import DefaultLayout from '~/layouts/default.vue';

export default {
  middleware: ({ route, redirect, $search }) => {
    const parts = route.path.split('/');
    const toFind = '/' + parts[1] + '/' + parts[2];
    const result = $search.find((item) => item.r == toFind);
    if (!result) {
      return redirect('/');
    }
    route.params.id = result.id;
    if (
      (parts.length === 3 && route.path[route.path.length - 1] !== '/') ||
      (parts.length === 4 && route.path[route.path.length - 1] === '/')
    ) {
      return redirect(route.path + '/overview');
    }
  },
  data: () => ({
    status: '',
    episodes: 0,
    score: '',
  }),
  components: { DefaultLayout },
  created() {
    if (this.flixlist) {
      if (this.flixlist.status) {
        this.status = this.flixlist.status;
      }
      if (this.flixlist.episodes) {
        this.episodes = this.flixlist.episodes;
      }
      if (this.flixlist.score) {
        this.score = `(${this.flixlist.score}) ${
          this.$ratings[this.flixlist.score]
        }`;
      }
    }
  },
  computed: {
    flixlist() {
      const flixlist = this.$store.state.localStorage.user.flixlist;
      if (flixlist) {
        return flixlist[this.title.id];
      }
    },
    title() {
      return this.$store.state.title.data;
    },
    tabs() {
      const index = this.$route.path.lastIndexOf('/') + 1;
      const routeTitle = this.$route.path.substr(0, index);
      return [
        {
          name: 'OVERVIEW',
          route: routeTitle + 'overview',
        },
        {
          name: 'REVIEWS',
          route: routeTitle + 'reviews',
        },
        {
          name: 'RECOMMENDATIONS',
          route: routeTitle + 'recommendations',
        },
        /* {
        name: 'NEWS',
        route: routeTitle + 'news',
      }, */
        /*  {
        name: 'MERCHANDISE',
        route: routeTitle + 'merchandise',
      },
      {
        name: 'MEDIA',
        route: routeTitle + 'media',
      }, */
      ];
    },
  },
  methods: {
    isCurrentTab(route) {
      return route === this.$route.path;
    },
    update() {
      if (!this.status) {
        this.$toasted.error('Select a status');
        return;
      }
      this.$updateFlixlist(
        this.$store.state.localStorage.user.id,
        this.title,
        this.status,
        Number(this.episodes),
        this.score ? Number(this.score.match(/(([^()]+))/)[1]) : null
      );
      this.$toasted.success('Flixlist updated');
    },
    updateStatus(value) {
      if (this.title.summary.type === 'show') {
        if (this.status === 'Completed') {
          this.episodes = this.title.episodeCount;
        } else if (
          this.status === 'Unwatched' ||
          (this.episodes === this.title.episodeCount &&
            this.status !== 'Completed')
        ) {
          this.episodes = 0;
        }
      }
    },
    updateEpisodes(event) {
      const value = event.target.value;
      if (value <= 0) {
        this.episodes = 0;
        this.status = 'Unwatched';
      } else if (value >= this.title.episodeCount) {
        this.episodes = this.title.episodeCount;
        this.status = 'Completed';
      } else {
        if (this.status === 'Completed' || this.status === 'Unwatched') {
          this.status = 'Watching';
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
input {
  padding-left: 5px;
  color: white;
  border: 1px solid white;
  width: 50px;
  border-radius: 5px;
}
fieldset {
  border-color: white;
}
.update {
  padding: 5px 30px;
  border: 1px solid $red-netflix;
  color: $red-netflix;
}
</style>
