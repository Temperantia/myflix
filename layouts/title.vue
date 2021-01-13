<template lang="pug">
defaultLayout
  v-container(fluid)
    v-row
      //-v-col(cols='12', md='1')
      //- ad
      client-only
        v-col(cols='12', md='2')
          img(:src='title.tallBoxArt')
          .mt-5(v-if='$store.getters["localStorage/CONNECTED"]')
            v-row.title-border
              v-col
                h3.text-h5 YOUR OVERVIEW
              v-col.text-right
                a.click(
                  v-if='isFavorite(title.id)',
                  @click='$removeFavorite(title, title.summary.type === "show" ? "shows" : "films")'
                ) Remove from Favorites
                a.click(
                  v-else,
                  @click='$addFavorite(title, title.summary.type === "show" ? "shows" : "films")'
                ) Add to Favorites
            v-row(align='center')
              v-col(cols='4') Status:
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
              v-col(cols='4') Eps seen:
              v-col(cols='3')
                input(type='number', v-model='episodes', @input='updateEpisodes')
              v-col(cols='3') / {{ title.episodeCount }}
            v-row(align='center')
              v-col(cols='4') Your Score
              v-col(cols='8')
                v-select(
                  :items='Object.entries($ratings).map(([score, rating]) => `(${score}) ${rating}`)',
                  outlined,
                  v-model='score',
                  dense,
                  :hide-details='true'
                )
            v-row
              v-col(offset='3', cols='6', align='center')
                button.update(@click='update') UPDATE
          .mt-5
            h3.text-h5.title-border INFORMATION
            .my-1(v-for='(data, name) in title.information', :key='name')
              b {{ name }}:
              span.pl-1 {{ data || "-" }}
          .mt-5
            h3.title-border STATISTICS
            .my-1(v-for='(data, name) in title.statistics', :key='name')
              b {{ name }}:
              span.pl-1 {{ data }}
      v-col(cols='12', md='8')
        v-row.title-border
          v-col(v-if='$vuetify.breakpoint.mdAndUp', md='12')
            nuxt-link(:to='tab.route', v-for='tab in tabs', :key='tab.name')
              h3.d-inline.mr-10(
                :class='{ "red-netflix--text": isCurrentTab(tab.route) }'
              ) {{ tab.name }}
          v-col(v-else, v-for='tab in tabs', :key='tab.name', cols='12')
            nuxt-link(:to='tab.route')
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
    user() {
      return this.$store.getters['localStorage/USER'];
    },
    flixlist() {
      return this.user ? this.user.flixlist[this.title.id] : null;
    },
    favorites() {
      return this.user.favorites;
    },
    title() {
      return this.$store.getters['title/TITLE'];
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
    isFavorite(id) {
      return (
        !!this.favorites &&
        !!this.favorites[
          this.title.summary.type === 'show' ? 'shows' : 'films'
        ] &&
        !!this.favorites[
          this.title.summary.type === 'show' ? 'shows' : 'films'
        ][id]
      );
    },
    isCurrentTab(route) {
      return route === this.$route.path;
    },
    update() {
      this.$updateFlixlist(
        this.title,
        this.status,
        Number(this.episodes),
        this.score ? Number(this.score.match(/(([^()]+))/)[1]) : null
      );
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
