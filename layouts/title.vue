<template lang="pug">
defaultLayout
  v-container.mt-4(fluid)
    v-row
      v-col(cols='12', md='2')
      //- ad
      client-only
        v-col(cols='12', md='2')
          v-container(fluid)
            img(:src='title.tallBoxArt')
            .mt-5(
              v-if='!isCurrentTab(tabs[0].route) && $store.getters["localStorage/CONNECTED"]'
            )
              v-row.title-border(align='center')
                v-col
                  h3 YOUR OVERVIEW
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
                v-col(cols='12', xl='4') Status
                v-col(cols='12', xl='8')
                  client-only
                    div(style='position: relative')
                      v-select(
                        :items='statuses',
                        outlined,
                        v-model='status',
                        dense,
                        :hide-details='true',
                        @change='updateStatus'
                      )
                        template(v-slot:selection='{ item }')
                          span(
                            v-if='item !== "Remove from List"',
                            :class='$titleStatusColor(item)'
                          ) {{ item }}
                      span.d-flex.align-center(
                        v-if='title.summary.type === "show" && status && status !== "Save for Later"',
                        style='position: absolute; top: 0; bottom: 0; right: 35px'
                      )
                        input.pr-1.border.white-font--border.text-right(
                          :class='$titleStatusColor(status)',
                          style='width: 30px',
                          type='number',
                          v-model='episodes',
                          @input='updateEpisodes'
                        )
                        span.ml-1 {{ " / " + title.episodeCount }}
              v-row(align='center')
                v-col(cols='12', xl='4') Your Score
                v-col(cols='12', xl='8')
                  v-select(
                    :items='Object.entries($ratings).map(([score, rating]) => `${score} - ${rating}`).reverse()',
                    outlined,
                    v-model='score',
                    dense,
                    :hide-details='true'
                  )
              v-row(align='center', v-if='title.summary.type === "show"')
                v-col
                  v-btn(
                    color='black-search',
                    @click='bingeworthy = !bingeworthy; saved = false'
                  )
                    v-icon(
                      :class='bingeworthy ? "green-watching--text" : "greyButton--text"',
                      left
                    ) mdi-check
                    span.font-weight-light(
                      :class='bingeworthy ? "white--text" : "white-font--text"'
                    ) Would you binge-watch this series?
              v-row(align='center')
                v-col.d-flex.justify-center
                  button.update(@click='update')
                    v-icon(color='green-watching', v-if='saved') mdi-check
                    span(v-else) UPDATE
          v-container(fluid)
            v-row.title-border(align='center')
              v-col
                h3 INFORMATION
              v-col.text-right(v-if='isCurrentTab(tabs[0].route)')
                a.click(
                  v-if='isFavorite(title.id)',
                  @click='$removeFavorite(title, title.summary.type === "show" ? "shows" : "films")'
                ) Remove from Favorites
                a.click(
                  v-else,
                  @click='$addFavorite(title, title.summary.type === "show" ? "shows" : "films")'
                ) Add to Favorites
            v-row
              v-col
                table(v-for='(data, name) in title.information', :key='name')
                  th {{ name }}:
                  td {{ data || "-" }}
          v-container(fluid)
            v-row.title-border(align='center')
              v-col
                h3 STATISTICS
            v-row
              v-col
                table(v-for='(data, name) in title.statistics', :key='name')
                  th {{ name }}:
                  td {{ data }}
      v-col(cols='12', md='6')
        v-container(fluid)
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
      v-col(cols='12', md='2')
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
    saved: false,
    bingeworthy: false,
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
        this.score = `${this.flixlist.score} - ${
          this.$ratings[this.flixlist.score]
        }`;
      }
    }
  },
  computed: {
    statuses() {
      const statuses = this.$statusesTvShow;
      return [...statuses, 'Remove from List'];
    },
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
        {
          name: 'GOODS',
          route: routeTitle + 'goods',
        } /*
      {
        name: 'MEDIA',
        route: routeTitle + 'media',
      }, */,
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
    async update() {
      if (
        !this.saved &&
        (await this.$updateFlixlist(
          this.title,
          this.status,
          Number(this.episodes),
          this.score ? Number(this.score.split('-')[0]) : null,
          this.bingeworthy
        ))
      ) {
        this.saved = true;
      }
    },
    updateStatus(value) {
      if (value === 'Remove from List') {
        this.status = '';
        return;
      }
      if (this.title.summary.type === 'show') {
        if (this.status === 'Completed') {
          this.episodes = this.title.episodeCount;
        } else if (!this.status || this.episodes === this.title.episodeCount) {
          this.episodes = 0;
        }
      }
      this.saved = false;
    },
    updateEpisodes(event) {
      const value = event.target.value;
      if (value <= 0) {
        this.episodes = 0;
        this.status = '';
      } else if (value >= this.title.episodeCount) {
        this.episodes = this.title.episodeCount;
        this.status = 'Completed';
      } else {
        if (this.status === 'Completed' || !this.status) {
          this.status = 'Watching';
        }
      }
      this.saved = false;
    },
  },
};
</script>
<style lang="scss" scoped>
img {
  max-width: 100%;
}
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
.breadcrumb {
  padding: 0px 12px 12px 12px;
  margin-top: 12px;
}
.titleTabs {
  padding-left: 0px;
  padding-bottom: 5px;
}
.tabsRow {
  padding: 0px 20px;
}
h3 {
  font-size: 16px;
  font-weight: 500;

  .text-h5.title-border {
    font-size: 16px;
    font-weight: 500;
  }
}
table {
  width: 100%;
  &:nth-child(even) {
    background: rgba(0, 0, 0, 0.2);
  }

  th {
    text-align: left;
  }

  td {
    text-align: right;
  }
}
</style>
